"""Author the continuous quarry approach using existing terrain and CC0 scans.

Run Blender --background --python tools/author-quarry-roadside.py.
Ground is an additive, exact shared surface; no changes to the driving corridor.
"""
import bpy,bmesh,json,math,pathlib,random,hashlib,runpy,struct
from mathutils import Vector,Euler
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=json.loads((ROOT/'source/models/quarry-roadside-base.json').read_text())
CUT=runpy.run_path(str(ROOT/'tools/author-quarry-cut.py'),run_name='quarry_cut_library')
CONFORM=runpy.run_path(str(ROOT/'tools/quarry_surface_clip.py'))['conform_ground']
START,END=112,151
BREAKS=[112,122,137,151]
COLS=(END-START)*4+1;ROWS=41
FANS=[(114.2,2.0,.82),(119.2,3.3,1.45),(126.3,4.0,1.9),(134.7,3.0,1.28),(142.6,3.8,1.62),(149.0,2.2,.76)]
CHANNELS=[115.0,122.2,130.8,138.8,146.2]
POCKETS=[(114.2,.27,3.2),(121.1,.42,4),(132.2,.27,3.6),(140.6,.5,3.8),(149.1,.34,2.8)]
TREE_ANCHORS=[(110.33957501887365,-60.82300814527774,2.0),(94.92363676845558,-94.97497561724782,2.0)]
clamp=CUT['clamp'];lerp=CUT['lerp'];smooth=CUT['smooth'];mix=CUT['mix']
to_blender=CUT['xyz_to_blender'];to_world=CUT['blender_to_xyz']

def terrain_sample(x,z):
    grid=BASE['terrain'];step=grid['step'];n=grid['columns'];positions=grid['positions'];normals=grid['normals']
    ix=int(clamp(math.floor((x-grid['minX'])/step),0,n-2));iz=int(clamp(math.floor((z-grid['minZ'])/step),0,n-2))
    a=iz*n+ix;b=a+n
    x0,x1=positions[a*3],positions[(a+1)*3];z0,z1=positions[a*3+2],positions[b*3+2]
    u=clamp((x-x0)/(x1-x0),0,1);v=clamp((z-z0)/(z1-z0),0,1)
    ids,weights=([a,b,a+1],[1-u-v,v,u]) if u+v<=1 else ([a+1,b,b+1],[1-v,1-u,u+v-1])
    height=sum(positions[i*3+1]*w for i,w in zip(ids,weights))
    normal=Vector(tuple(sum(normals[i*3+k]*w for i,w in zip(ids,weights)) for k in range(3))).normalized()
    return height,normal

def cliff_sample(row,degrees):
    if 118<=degrees<=139:return CUT['authored'](row,degrees-118)[0]
    col=clamp(degrees-BASE['foot']['startDegrees'],0,43);ci=min(42,int(col));ri=min(5,int(row));u=col-ci;v=row-ri
    p=BASE['foot']['profiles']
    return mix(mix(p[ri][ci],p[ri][ci+1],u),mix(p[ri+1][ci],p[ri+1][ci+1],u),v)

def track_distance(x,z):
    points=BASE['track'];distance=1e9
    for a,b in zip(points,points[1:]+points[:1]):
        dx=b['x']-a['x'];dz=b['z']-a['z'];t=clamp(((x-a['x'])*dx+(z-a['z'])*dz)/(dx*dx+dz*dz),0,1)
        distance=min(distance,math.hypot(x-a['x']-dx*t,z-a['z']-dz*t))
    return distance

def bounds_for_angle(degrees):
    a=math.radians(degrees);edge=smooth(0,2.5,degrees-START)*smooth(0,2.5,END-degrees)
    lo,hi=0.0,6.0
    for _ in range(24):
        row=(lo+hi)/2;p=cliff_sample(row,degrees)
        if p[1]<terrain_sample(p[0],p[2])[0]:lo=row
        else:hi=row
    contact=(lo+hi)/2
    foot=cliff_sample(lerp(contact,max(3,contact),edge),degrees)
    outer=math.hypot(foot[0]/1.08,foot[2])
    nearest=min(BASE['track'],key=lambda p:abs(math.atan2(math.sin(math.atan2(p['x']/1.08,p['z'])-a),math.cos(math.atan2(p['x']/1.08,p['z'])-a))))
    lo=math.hypot(nearest['x']/1.08,nearest['z']);hi=outer
    for _ in range(24):
        r=(lo+hi)/2;x=math.sin(a)*r*1.08;z=math.cos(a)*r
        if track_distance(x,z)<9.5:lo=r
        else:hi=r
    inner=(lo+hi)/2
    if outer-inner<6:raise RuntimeError(f'Insufficient roadside width at{degrees}: {outer-inner}')
    innerpoint=(math.sin(a)*inner*1.08,0,math.cos(a)*inner)
    return inner,outer,innerpoint,foot

BOUNDS=[]
SURFACE_POSITIONS=[]
SURFACE_TRIANGLES=[]
SURFACE_CELLS={}
SURFACE_CELL_SIZE=4.0
def get_bounds(degrees):
    c=clamp((degrees-START)/.25,0,COLS-1);i=min(COLS-2,int(c));t=c-i
    a,b=BOUNDS[i],BOUNDS[i+1]
    return lerp(a[0],b[0],t),lerp(a[1],b[1],t),mix(a[2],b[2],t),mix(a[3],b[3],t)

def sample(degrees,s):
    inner,outer,inside,foot=get_bounds(degrees);x=lerp(inside[0],foot[0],s);z=lerp(inside[2],foot[2],s)
    base,_=terrain_sample(x,z);outerbase=terrain_sample(foot[0],foot[2])[0]
    edge=smooth(0,2.5,degrees-START)*smooth(0,2.5,END-degrees)
    shoulder=smooth(0,.12,s)
    fan=0;stone=0
    for i,(centre,width,height) in enumerate(FANS):
        # Low broken runout wedges stay close to the foot rather than forming
        # round dune crests halfway across the approach. Offset lobes and
        # piecewise slope breaks interrupt their outlines at several scales.
        centre+=math.sin(s*3.4+i*1.1)*(.35+.08*i)*(1-s)
        width*=.48+.75*(1-s)
        lateral=(degrees-centre)/width
        cross=max(0,1-abs(lateral))**1.25
        cross=max(cross,.63*max(0,1-abs((lateral-.52)/.65))**1.35)
        breaks=[(0,0),(.20,0),(.47,.08),(.66,.32),(.81+(i%3)*.025,1),(.95,.46),(1,0)]
        profile=next(lerp(a[1],b[1],(s-a[0])/(b[0]-a[0])) for a,b in zip(breaks,breaks[1:]) if a[0]<=s<=b[0])
        fan+=cross*profile*height*.42
        stone=max(stone,cross*(.3+.65*s))
    drainage=0
    for i,centre in enumerate(CHANNELS):
        path=channel_angle(i,s)
        drainage=max(drainage,math.exp(-((degrees-path)/(.2+.32*(1-s)))**2))
    # Shallow drains are recesses between deposits, never below existing terrain.
    fan*=1-.82*drainage
    berm=.10*math.exp(-((s-.115)/.08)**2)*(.6+.4*math.sin(degrees*.22+.6))
    meso=.035*(1+math.sin(degrees*1.67+s*19)*math.cos(degrees*.71-s*7))*s*(1-s)
    deposit=max(0,fan+berm+meso)*edge*shoulder
    walljoin=max(0,foot[1]-outerbase)*s**7
    height=base+deposit+walljoin
    # At the outer edge join the actual wall exactly; at other edges lift only
    # 12mm to avoid z-fighting while the material restores original terrain.
    height+=.012*(1-s**10)
    if s==1:height=foot[1]
    coverage=edge*smooth(0,.1,s)
    compaction=clamp(drainage*.87+.22*math.exp(-((s-.12)/.12)**2),0,1)
    mixture=clamp(.18+stone*.78+s*.1,0,1)
    return (x,height,z),(coverage,compaction,mixture,1),(x/9,z/9)

def channel_angle(index,s):
    return CHANNELS[index]+(.35+.12*index)*math.sin(s*3+index*.7)*(1-s)

def surface_grid():
    positions=[];masks=[];uv=[]
    for row in range(ROWS):
        for col in range(COLS):
            p,c,t=sample(START+col*.25,row/(ROWS-1));positions.append(p);masks.append(c);uv.append(t)
    return positions,masks,uv

def ground_indices():
    indices=[];sections=[]
    for section,(lo,hi) in enumerate(zip(BREAKS,BREAKS[1:])):
        start=round((lo-START)*4);end=round((hi-START)*4);first=len(indices)//3
        for row in range(ROWS-1):
            for col in range(start,end):
                a=row*COLS+col;indices.extend([a,a+COLS,a+1,a+1,a+COLS,a+COLS+1])
        sections.append({'id':section,'startColumn':start,'endColumn':end,'firstTriangle':first,'triangleCount':len(indices)//3-first})
    return indices,sections

def quantize_surface(positions,masks,uv,indices,sections):
    """Keep the grid prefix and weld/drop Float32-collapsed clipped slivers."""
    fp32=lambda value:struct.unpack('f',struct.pack('f',value))[0]
    out_positions=[];out_masks=[];out_uv=[];mapping=[];keys={}
    for i,point in enumerate(positions):
        p=tuple(fp32(v) for v in point)
        if i<COLS*ROWS or p not in keys:
            index=len(out_positions);keys.setdefault(p,index)
            out_positions.append(p);out_masks.append(masks[i]);out_uv.append((p[0]/9,p[2]/9))
        else:index=keys[p]
        mapping.append(index)
    out_indices=[];out_sections=[]
    for section in sections:
        first=len(out_indices)//3
        for at in range(section['firstTriangle']*3,(section['firstTriangle']+section['triangleCount'])*3,3):
            triangle=[mapping[i] for i in indices[at:at+3]]
            a,b,c=[out_positions[i] for i in triangle]
            upward=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])
            if len(set(triangle))<3 or abs(upward)<1e-8:continue
            if upward<0:triangle[1],triangle[2]=triangle[2],triangle[1]
            out_indices.extend(triangle)
        out_sections.append({**section,'firstTriangle':first,'triangleCount':len(out_indices)//3-first})
    print(f'Float32 surface: {len(positions)} to {len(out_positions)} vertices; {len(indices)//3-len(out_indices)//3} collapsed triangles removed.',flush=True)
    return out_positions,out_masks,out_uv,out_indices,out_sections


def mesh_object(name,positions,faces,uv,colors,material,is_ground=False,ground_normals=None):
    obj=CUT['make_mesh'](name,positions,faces,uv,colors,material)
    if is_ground:
        custom=[];mesh=obj.data
        for poly in mesh.polygons:
            for loop in poly.loop_indices:
                i=mesh.loops[loop].vertex_index;_,base=terrain_sample(positions[i][0],positions[i][2])
                n=ground_normals[i] if ground_normals is not None else mesh.vertices[i].normal;weight=smooth(0,.35,colors[i][0])
                custom.append(tuple((Vector(to_blender(base))*(1-weight)+n*weight).normalized()))
        mesh.normals_split_custom_set(custom)
    else:
        bm=bmesh.new();bm.from_mesh(obj.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001);bm.to_mesh(obj.data);bm.free();obj.data.update()
    return obj

def fragment_specs():
    rng=random.Random(790271);specs=[]
    pockets=[(*sample(a,s)[0][::2],radius) for a,s,radius in POCKETS]+TREE_ANCHORS
    channels=[[sample(channel_angle(i,s),s)[0] for s in [.15,.3,.5,.7,.9]] for i in range(len(CHANNELS))]
    def drain_distance(x,z):
        distance=1e9
        for line in channels:
            for a,b in zip(line,line[1:]):
                dx=b[0]-a[0];dz=b[2]-a[2];t=clamp(((x-a[0])*dx+(z-a[2])*dz)/(dx*dx+dz*dz),0,1)
                distance=min(distance,math.hypot(x-a[0]-t*dx,z-a[2]-t*dz))
        return distance
    for fan,(centre,width,_) in enumerate(FANS):
        for i in range(160):
            kind='large' if i<15 else 'medium' if i<60 else 'chip'
            size=rng.uniform(1.05,2.8) if kind=='large' else rng.uniform(.30,1.05) if kind=='medium' else rng.uniform(.065,.23)
            lobe=rng.randrange(2 if kind=='large' else 3)
            s=clamp(rng.gauss([.83,.68,.46][lobe],.065 if kind=='large' else .10),.16,.94)
            offset=[-.19,.26,-.1][lobe]*width
            degrees=clamp(centre+offset+rng.gauss(0,width*(.19 if kind=='large' else .28)),START+.6,END-.6)
            inner,outer,*_=get_bounds(degrees);margin=size*.78+.12
            s=clamp(s,margin/(outer-inner),1-margin/(outer-inner))
            p,mask,_=sample(degrees,s)
            if mask[1]>.57:continue
            if drain_distance(p[0],p[2])<1.4+size*.55:continue
            if any(math.hypot(p[0]-x,p[2]-z)<radius+size*.55 for x,z,radius in pockets):continue
            if any(math.hypot(p[0]-old['x'],p[2]-old['z'])<(size+old['diameter'])*.26 for old in specs if old['kind']!='chip' and kind!='chip'):continue
            height=rng.uniform(.68,1.02) if kind!='chip' else rng.uniform(.24,.38)
            specs.append({'degrees':degrees,'s':s,'x':p[0],'z':p[2],'diameter':size,
                          'yaw':rng.random()*math.tau,'pitch':rng.uniform(-.35,.35),'roll':rng.uniform(-.4,.4),
                          'height':height,'kind':kind,'burial':.10 if kind!='chip' else .20,
                          'variant':rng.randrange(6),'shade':rng.uniform(.84,1),'solid':kind!='chip','section':min(2,next(j for j in range(3) if degrees<=BREAKS[j+1]))})
    return specs

def index_surface(positions,indices):
    """Seat fragments on the exported triangles, including terrain crossings."""
    SURFACE_POSITIONS[:] = positions
    SURFACE_TRIANGLES[:] = [indices[i:i+3] for i in range(0,len(indices),3)]
    SURFACE_CELLS.clear()
    for ti,triangle in enumerate(SURFACE_TRIANGLES):
        points=[positions[i] for i in triangle]
        for ix in range(math.floor(min(p[0] for p in points)/SURFACE_CELL_SIZE),math.floor(max(p[0] for p in points)/SURFACE_CELL_SIZE)+1):
            for iz in range(math.floor(min(p[2] for p in points)/SURFACE_CELL_SIZE),math.floor(max(p[2] for p in points)/SURFACE_CELL_SIZE)+1):
                SURFACE_CELLS.setdefault((ix,iz),[]).append(ti)


def approximate_height(x,z):
    for ti in SURFACE_CELLS.get((math.floor(x/SURFACE_CELL_SIZE),math.floor(z/SURFACE_CELL_SIZE)),[]):
        a,b,c=[SURFACE_POSITIONS[i] for i in SURFACE_TRIANGLES[ti]]
        denominator=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2])
        if abs(denominator)<1e-12:continue
        u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/denominator
        v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/denominator
        if u>=-1e-7 and v>=-1e-7 and u+v<=1+1e-7:
            return a[1]*u+b[1]*v+c[1]*(1-u-v)
    degrees=math.degrees(math.atan2(x/1.08,z));inner,outer,*_=get_bounds(degrees)
    s=clamp((math.hypot(x/1.08,z)-inner)/(outer-inner),0,1)
    return sample(degrees,s)[0][1]

def fragment_points(template,spec):
    rot=Euler((spec['pitch'],spec['roll'],spec['yaw']),'XYZ').to_matrix();points=[]
    for p in template['p']:
        q=to_world(rot@Vector(to_blender((p[0]*spec['diameter'],p[1]*spec['diameter']*spec['height'],p[2]*spec['diameter']))))
        points.append((q[0]+spec['x'],q[1],q[2]+spec['z']))
    lo=min(p[1] for p in points);hi=max(p[1] for p in points)
    support=sorted(approximate_height(x,z)-y for x,y,z in points if y<lo+(hi-lo)*.3)
    anchor=spec.get('anchor',support[len(support)//3]-spec['burial']*spec['diameter']);spec['anchor']=anchor
    return [(x,y+anchor,z) for x,y,z in points]

def hull_points(points):
    centre=tuple(sum(p[i] for p in points)/len(points) for i in range(3));selected=[]
    for direction in [(x,y,z) for x in [-1,0,1] for y in [-1,0,1] for z in [-1,0,1] if x or y or z]:
        p=max(points,key=lambda p:sum((p[k]-centre[k])*direction[k] for k in range(3)))
        if p not in selected:selected.append(p)
    return [v for p in selected for v in p]

def main():
    print('Sampling exact terrain and safe road boundary...',flush=True)
    BOUNDS.extend(bounds_for_angle(START+i*.25) for i in range(COLS))
    positions,masks,uv=surface_grid();indices,sections=ground_indices()
    positions,masks,uv,indices,sections=CONFORM(positions,masks,uv,indices,sections,BASE['terrain'])
    positions,masks,uv,indices,sections=quantize_surface(positions,masks,uv,indices,sections)
    index_surface(positions,indices)
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    # Calculate normals on the complete joined surface before splitting chunks.
    # Per-chunk normals are one-sided at122°/137° and leave a lighting seam.
    shared_mesh=bpy.data.meshes.new('RoadsideSharedNormalSource')
    shared_mesh.from_pydata([to_blender(p) for p in positions],[],[indices[i:i+3] for i in range(0,len(indices),3)])
    for poly in shared_mesh.polygons:poly.use_smooth=True
    shared_mesh.update();ground_normals=[v.normal.copy() for v in shared_mesh.vertices]
    bpy.data.meshes.remove(shared_mesh)
    bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/rocks-lod.glb'))
    originals=sorted([o for o in bpy.context.scene.objects if o.type=='MESH'],key=lambda o:o.name)
    templates={name:[CUT['simplified_template'](o,budget) for o in originals] for name,budget in [('large_near',360),('large_far',90),('medium_near',200),('medium_far',48),('chip_near',18),('chip_far',8)]}
    for o in originals:bpy.data.objects.remove(o,do_unlink=True)
    materials=[]
    for name in ['EXISTING_ROADSIDE_MASKED_GROUND','EXISTING_SCAN_ATLAS']:
        mat=bpy.data.materials.new(name);mat.use_nodes=True
        color=mat.node_tree.nodes.new('ShaderNodeVertexColor');color.layer_name='Color'
        mat.node_tree.links.new(color.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);materials.append(mat)
    specs=fragment_specs();output=[];solids=[]
    for section in sections:
        si=section['id'];used=sorted(set(indices[section['firstTriangle']*3:(section['firstTriangle']+section['triangleCount'])*3]));mapping={v:i for i,v in enumerate(used)}
        face_indices=indices[section['firstTriangle']*3:(section['firstTriangle']+section['triangleCount'])*3]
        faces=[tuple(mapping[v] for v in face_indices[i:i+3]) for i in range(0,len(face_indices),3)]
        for level in ['near','far']:
            output.append(mesh_object(f'RoadsideGround_{si}_{level}',[positions[i] for i in used],faces,[uv[i] for i in used],[masks[i] for i in used],materials[0],True,[ground_normals[i] for i in used]))
            ps=[];ts=[];cs=[];fs=[]
            for n,spec in enumerate(specs):
                if spec['section']!=si:continue
                template=templates[f"{spec['kind']}_{level}"][spec['variant']]
                points=fragment_points(template,spec);offset=len(ps);ps.extend(points);ts.extend(template['uv'])
                shade=spec['shade'];cs.extend([(shade*.84,shade*.92,shade,1)]*len(points));fs.extend(tuple(offset+v for v in f) for f in template['faces'])
                if level=='near' and spec['solid']:solids.append({'id':f'roadside-fragment-{n}','points':hull_points(points)})
            output.append(mesh_object(f'RoadsideFragments_{si}_{level}',ps,fs,ts,cs,materials[1]))
    pockets=[]
    for degrees,s,radius in POCKETS:
        p,mask,_=sample(degrees,s);pockets.append({'x':p[0],'z':p[2],'radius':radius,'surfaceHeight':approximate_height(p[0],p[2]),'mask':list(mask[:3])})
    corridors=[]
    for i,centre in enumerate(CHANNELS):
        corridors.append([{'x':sample(channel_angle(i,s),s)[0][0],'z':sample(channel_angle(i,s),s)[0][2],'radius':1.4} for s in [.15,.3,.5,.7,.9]])
    data={'version':1,'sector':{'startDegrees':START,'endDegrees':END,'sectionDegrees':BREAKS},
          'surface':{'columns':COLS,'rows':ROWS,'angles':[math.radians(START+i*.25) for i in range(COLS)],'innerRadii':[b[0] for b in BOUNDS],'outerRadii':[b[1] for b in BOUNDS],
                     'positions':[v for p in positions for v in p],'indices':indices,'masks':[v for c in masks for v in c[:3]],'sections':sections},
          'solids':solids,'vegetationPockets':pockets,'bareDrainageCorridors':corridors}
    data_path=ROOT/'src/quarry-roadside-data.json';data_path.write_text(json.dumps(data,separators=(',',':')),newline='\n')
    for obj in output:obj.select_set(True)
    blend=ROOT/'source/models/quarry-roadside.blend';bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    glb=ROOT/'public/models/quarry-roadside.glb';bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True,export_materials='EXPORT',export_yup=True)
    report={'version':1,'generator':'tools/author-quarry-roadside.py','conforming_helper':'tools/quarry_surface_clip.py','base':'source/models/quarry-roadside-base.json','source':'Original authored terrain and Poly Haven Rock Moss Set 01 fragments',
            'source_url':'https://polyhaven.com/a/rock_moss_set_01','license':'CC0-1.0 for scans; original authored terrain','runtime_maps':'Shared Poly Haven Rock Ground color/normal/roughness at 1.5m physical scale, blended with existing soil/gravel/rock maps and Rock Moss Set 01 scan atlas; no embedded textures',
            'sector':data['sector'],'minimum_track_clearance':9.5,'surface_triangles':len(indices)//3,'fragment_count':len(specs),'solid_fragment_count':len(solids),
            'meshes':[{'name':o.name,'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in output],
            'assets':[{'file':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [glb,blend,data_path,ROOT/'source/models/quarry-roadside-base.json']]}
    (ROOT/'source/models/quarry-roadside-manifest.json').write_text(json.dumps(report,indent=2),newline='\n')
    print('ROADSIDE_REPORT',json.dumps(report))

if __name__=='__main__':main()
