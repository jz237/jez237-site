"""Build a continuous gravel road overlay without changing the driving planes."""
import bpy,bmesh,math,json,pathlib,random,hashlib,runpy,struct
from mathutils import Vector,Euler
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=json.loads((ROOT/'source/models/quarry-road-approach-base.json').read_text())
TERRAIN=json.loads((ROOT/'source/models'/BASE['terrainSource']).read_text())['terrain']
ROADSIDE=json.loads((ROOT/'src/quarry-roadside-data.json').read_text())['surface']
CUT=runpy.run_path(str(ROOT/'tools/author-quarry-cut.py'),run_name='cut_helpers')
START=BASE['sector']['startCell'];END=BASE['sector']['endCellExclusive'];COUNT=END-START
clamp=CUT['clamp'];lerp=CUT['lerp'];mix=CUT['mix'];smooth=CUT['smooth'];to_blender=CUT['xyz_to_blender'];to_world=CUT['blender_to_xyz']
f32=lambda x:struct.unpack('f',struct.pack('f',x))[0]
lane=[tuple(BASE['lane']['positions'][i:i+3]) for i in range(0,len(BASE['lane']['positions']),3)]
lane_normals=[tuple(BASE['lane']['normals'][i:i+3]) for i in range(0,len(BASE['lane']['normals']),3)]
centres=[mix(lane[2*i],lane[2*i+1],.5) for i in range(COUNT+1)]
distance=[0.0]
for a,b in zip(centres,centres[1:]):distance.append(distance[-1]+math.dist(a,b))
RAW=[];RAW_TRIS=[];RAW_GROUP=[];KEYS={}
FANS=[(4.5,-1,8.0,55,1.8,1.5),(15.0,1,8.3,38,1.25,1.2),
      (27.0,-1,8.4,48,2.0,1.4),(39.5,-1,7.5,32,1.35,1.1),
      (47.0,1,8.6,35,1.6,1.3),(55.0,-1,9.0,32,1.4,1.5)]

def chunks(values,n):return [tuple(values[i:i+n]) for i in range(0,len(values),n)]
def cross2(a,b):return a[0]*b[1]-a[1]*b[0]
def bary(x,z,a,b,c):
    d=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2])
    u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/d
    v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/d
    return u,v,1-u-v

TP=chunks(TERRAIN['positions'],3);TN=chunks(TERRAIN['normals'],3)
def terrain_triangles(ix,iz):
    a=iz*TERRAIN['columns']+ix;b=a+TERRAIN['columns']
    return [(a,b,a+1),(a+1,b,b+1)]
def terrain_sample(x,z):
    ix=int((x-TERRAIN['minX'])/TERRAIN['step']);iz=int((z-TERRAIN['minZ'])/TERRAIN['step'])
    for ids in terrain_triangles(ix,iz):
        w=bary(x,z,*[TP[i] for i in ids])
        if min(w)>=-1e-6:return sum(a*TP[i][1] for a,i in zip(w,ids)),tuple(sum(a*TN[i][k] for a,i in zip(w,ids)) for k in range(3))
    raise ValueError(('terrain',x,z))

def roadside_boundary():
    points=chunks(ROADSIDE['positions'],3);edges={}
    for tri in chunks(ROADSIDE['indices'],3):
        for a,b in zip(tri,tri[1:]+tri[:1]):
            key=tuple(sorted((a,b)));edges[key]=edges.get(key,0)+1
    return [(points[a],points[b]) for (a,b),n in edges.items() if n==1]
BOUNDARY=roadside_boundary()

def frame(t):
    i=min(COUNT-1,int(t));f=t-i
    left=mix(lane[2*i],lane[2*(i+1)],f);right=mix(lane[2*i+1],lane[2*(i+1)+1],f)
    centre=mix(left,right,.5);direction=((right[0]-left[0])/12,(right[2]-left[2])/12)
    return i,f,centre,direction,left,right

def ray_hit(t,side):
    _,_,c,d,_,_=frame(t);d=(d[0]*side,d[1]*side);best=None
    for a,b in BOUNDARY:
        e=(b[0]-a[0],b[2]-a[2]);ac=(a[0]-c[0],a[2]-c[2]);det=cross2(d,e)
        if abs(det)<1e-10:continue
        u=cross2(ac,e)/det;v=cross2(ac,d)/det
        if 6.05<u<15 and -1e-7<=v<=1+1e-7 and (best is None or u<best[0]):best=(u,mix(a,b,clamp(v,0,1)))
    return best

def boundary_parameters():
    """All old boundary corners become cross-sections of the new strip."""
    values=set()
    for p in {p for edge in BOUNDARY for p in edge}:
        for i in range(COUNT):
            _,_,a,d,_,_=frame(i);_,_,b,e,_,_=frame(i+1)
            c=(p[0]-a[0],p[2]-a[2]);v=(b[0]-a[0],b[2]-a[2]);dd=(e[0]-d[0],e[1]-d[1])
            A=-cross2(v,dd);B=cross2(c,dd)-cross2(v,d);C=cross2(c,d)
            if abs(A)<1e-10:roots=[] if abs(B)<1e-10 else [-C/B]
            else:
                disc=B*B-4*A*C;roots=[] if disc<0 else [(-B+math.sqrt(disc))/(2*A),(-B-math.sqrt(disc))/(2*A)]
            for f in roots:
                if 0<f<1:
                    t=i+f;_,_,c,d,_,_=frame(t);offset=((p[0]-c[0])*d[0]+(p[2]-c[2])*d[1])/(d[0]*d[0]+d[1]*d[1])
                    if 6<abs(offset)<14:values.add(round(t,9))
    return values

def paint(s,v,coverage):
    drift=.34*math.sin(s*.073)+.15*math.sin(s*.19)
    tracks=max(math.exp(-((v-2.6-drift)/1.10)**2),math.exp(-((v+2.6-drift)/1.1)**2))
    packed=clamp(.18*(1-smooth(3.5,6.4,abs(v)))+tracks*.76,0,1)
    drainage=0.0
    for index in [0,2,4]:
        t,side,lateral,_,_,_=FANS[index];i=int(t);mouth=lerp(distance[i],distance[i+1],t-i)
        outward=v*side;axis=7.4+(s-mouth)*.28;width=.55+.33*smooth(7,10,outward)
        stream=math.exp(-((outward-axis)/width)**2)*math.exp(-((s-mouth)/3.6)**2)
        fan=math.exp(-((outward-lateral)/1.1)**2-((s-mouth-1.3)/2.6)**2)*.35
        drainage=max(drainage,(stream*.76+fan)*smooth(5.8,7.0,outward)*(1-smooth(9.6,11,outward)))
    drainage=clamp(drainage,0,1)
    return coverage,packed,drainage,1.0

def raw_vertex(p,uv,coverage,conform,normal):
    key=tuple(round(v,8) for v in p)
    if key not in KEYS:
        KEYS[key]=len(RAW);RAW.append({'p':p,'uv':uv,'color':paint(*uv,coverage),'conform':conform,'normal':normal})
    return KEYS[key]
def triangle(ids,group):
    a,b,c=[RAW[i]['p'] for i in ids]
    if (b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])<0:ids=[ids[0],ids[2],ids[1]]
    RAW_TRIS.append(ids);RAW_GROUP.append(group)

def author_surface():
    sections=sorted(set([i/2 for i in range(COUNT*2+1)])|boundary_parameters())
    # Keep every original diagonal: a strip across the old quad is divided at
    # its old diagonal, then subdivided laterally without changing its plane.
    for t0,t1 in zip(sections,sections[1:]):
        cell=min(COUNT-1,int((t0+t1)*.5));f0=t0-cell;f1=t1-cell
        a,b,c,d=lane[cell*2],lane[(cell+1)*2],lane[cell*2+1],lane[(cell+1)*2+1]
        ns=[lane_normals[j] for j in [cell*2,(cell+1)*2,cell*2+1,(cell+1)*2+1]]
        def lane_point(f,v):
            if f+v<=1+1e-9:w=(1-f-v,f,v);ps=[a,b,c];norm=ns[:3]
            else:w=(1-f,1-v,f+v-1);ps=[c,b,d];norm=[ns[2],ns[1],ns[3]]
            p=tuple(sum(q*z[k] for q,z in zip(w,ps)) for k in range(3));n=tuple(sum(q*z[k] for q,z in zip(w,norm)) for k in range(3))
            s=lerp(distance[cell],distance[cell+1],f);coverage=smooth(0,5,s)*smooth(0,5,distance[-1]-s)
            return raw_vertex(p,(s,lerp(-6,6,v)),coverage,0,n)
        cuts=sorted(set([i/4 for i in range(5)]+[clamp(1-f0,0,1),clamp(1-f1,0,1)]))
        for v0,v1 in zip(cuts,cuts[1:]):
            # Clip each rectangle in (f,v) by the fixed f+v=1 diagonal.
            for positive in [False,True]:
                polygon=[(f0,v0),(f1,v0),(f1,v1),(f0,v1)];result=[];prev=polygon[-1];dp=(prev[0]+prev[1]-1)*(1 if positive else -1)
                for cur in polygon:
                    dc=(cur[0]+cur[1]-1)*(1 if positive else -1)
                    if (dc>=-1e-10)!=(dp>=-1e-10):
                        u=dp/(dp-dc);result.append(mix(prev,cur,u))
                    if dc>=-1e-10:result.append(cur)
                    prev=cur;dp=dc
                ids=[]
                for f,v in result:
                    vi=lane_point(f,v)
                    if not ids or ids[-1]!=vi:ids.append(vi)
                if len(ids)>1 and ids[-1]==ids[0]:ids.pop()
                for k in range(1,len(ids)-1):triangle([ids[0],ids[k],ids[k+1]],'lane')
    for side in [-1,1]:
        strips=[]
        shoulder=next(x for x in BASE['shoulders'] if x['side']==side)
        sp=chunks(shoulder['positions'],3)
        for t in sections:
            i,f,c,d,left,right=frame(t);edge=left if side<0 else right
            normal=mix(lane_normals[i*2+(side>0)],lane_normals[(i+1)*2+(side>0)],f)
            s=lerp(distance[i],distance[i+1],f);along=smooth(0,5,s)*smooth(0,5,distance[-1]-s)
            outer=mix(sp[i*2+1],sp[(i+1)*2+1],f)
            outer_offset=abs(((outer[0]-c[0])*d[0]+(outer[2]-c[2])*d[1])/(d[0]*d[0]+d[1]*d[1]))
            width=11.5+.5*math.sin(s*.16)+.32*math.sin(s*.41)
            hit=ray_hit(t,side)
            if hit and hit[0]<width:
                width=hit[0];end=hit[1];end_conform=0
            else:
                x=c[0]+d[0]*side*width;z=c[2]+d[1]*side*width;y,_=terrain_sample(x,z);end=(x,y+.012,z);end_conform=1
            outer_offset=min(outer_offset,width-.15)
            # Shared lane/shoulder edge, loose shoulder, feathered terrain skirt.
            offsets=[6,7.15,outer_offset,(outer_offset+width)/2,width];row=[]
            for j,offset in enumerate(offsets):
                if j==0:p=edge;weight=0;n=normal;coverage=along
                elif j==4:p=end;weight=end_conform;n=terrain_sample(p[0],p[2])[1];coverage=0
                else:
                    x=c[0]+d[0]*side*offset;z=c[2]+d[1]*side*offset;y,n=terrain_sample(x,z)
                    lift=lerp(.06,.012,smooth(6,width,offset));p=(x,y+lift,z);weight=smooth(6,outer_offset,offset)
                    coverage=along*(1 if j<=2 else .55)
                    if j==2 and (t==0 or t==COUNT):p=outer;weight=0
                row.append(raw_vertex(p,(s,side*offset),coverage,weight,n))
            strips.append(row)
        for a,b in zip(strips,strips[1:]):
            for j in range(4):
                group='lane' if j<2 else 'skirt'
                triangle([a[j],b[j],a[j+1]],group);triangle([a[j+1],b[j],b[j+1]],group)

def clip_polygon(poly,base):
    boundary=[(p[0],p[2]) for p in base]
    sign=1 if cross2((boundary[1][0]-boundary[0][0],boundary[1][1]-boundary[0][1]),(boundary[2][0]-boundary[0][0],boundary[2][1]-boundary[0][1]))>0 else -1
    for a,b in zip(boundary,boundary[1:]+boundary[:1]):
        if not poly:return []
        out=[];prev=poly[-1];dp=sign*cross2((b[0]-a[0],b[1]-a[1]),(prev[0]-a[0],prev[1]-a[1]))
        for cur in poly:
            dc=sign*cross2((b[0]-a[0],b[1]-a[1]),(cur[0]-a[0],cur[1]-a[1]))
            if (dc>=-1e-9)!=(dp>=-1e-9):out.append(mix(prev,cur,dp/(dp-dc)))
            if dc>=-1e-9:out.append(cur)
            prev=cur;dp=dc
        poly=out
    return poly

def conform_surface():
    out=[];groups={'lane':[],'skirt':[]};weld={};step=TERRAIN['step']
    for ids,group in zip(RAW_TRIS,RAW_GROUP):
        raw=[RAW[i] for i in ids];ps=[v['p'] for v in raw]
        if abs((ps[1][2]-ps[0][2])*(ps[2][0]-ps[0][0])-(ps[1][0]-ps[0][0])*(ps[2][2]-ps[0][2]))<1e-10:continue
        depths=[v['p'][1]-terrain_sample(v['p'][0],v['p'][2])[0] for v in raw]
        for iz in range(int((min(p[2] for p in ps)-TERRAIN['minZ'])/step),int((max(p[2] for p in ps)-TERRAIN['minZ'])/step)+1):
            for ix in range(int((min(p[0] for p in ps)-TERRAIN['minX'])/step),int((max(p[0] for p in ps)-TERRAIN['minX'])/step)+1):
                for base_ids in terrain_triangles(ix,iz):
                    bp=[TP[i] for i in base_ids];poly=clip_polygon([(p[0],p[2]) for p in ps],bp);vertices=[]
                    for x,z in poly:
                        w=bary(x,z,*ps);bw=bary(x,z,*bp);floor=sum(a*p[1] for a,p in zip(bw,bp))
                        authored=sum(a*p[1] for a,p in zip(w,ps));weight=sum(a*v['conform'] for a,v in zip(w,raw))
                        y=lerp(authored,floor+sum(a*d for a,d in zip(w,depths)),weight)
                        uv=tuple(sum(a*v['uv'][k] for a,v in zip(w,raw)) for k in range(2))
                        if abs(uv[1])>6.0001:y=max(floor+.001,y)
                        p=tuple(f32(v) for v in (x,y,z));key=p
                        if key not in weld:
                            weld[key]=len(out);out.append({'p':p,'uv':uv,'color':tuple(sum(a*v['color'][k] for a,v in zip(w,raw)) for k in range(4)),
                                                       'normal':tuple(sum(a*v['normal'][k] for a,v in zip(w,raw)) for k in range(3))})
                        vi=weld[key]
                        if not vertices or vertices[-1]!=vi:vertices.append(vi)
                    if len(vertices)>1 and vertices[-1]==vertices[0]:vertices.pop()
                    for i in range(1,len(vertices)-1):
                        tri=(vertices[0],vertices[i],vertices[i+1]);a,b,c=[out[v]['p'] for v in tri]
                        area=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])
                        if abs(area)>1e-9:groups[group].append(tri if area>0 else (tri[0],tri[2],tri[1]))
    return out,groups

def make_surface(name,vertices,faces,material):
    obj=CUT['make_mesh'](name,[v['p'] for v in vertices],faces,[v['uv'] for v in vertices],[v['color'] for v in vertices],material)
    normals=[]
    for loop in obj.data.loops:normals.append(tuple(Vector(to_blender(vertices[loop.vertex_index]['normal'])).normalized()))
    obj.data.normals_split_custom_set(normals);return obj

def main():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    author_surface();vertices,groups=conform_surface()
    materials=[bpy.data.materials.new(name) for name in ['ROAD_LANE_MASKS','ROAD_SKIRT_MASKS','EXISTING_SCAN_ATLAS']]
    for mat in materials:
        mat.use_nodes=True;color=mat.node_tree.nodes.new('ShaderNodeVertexColor');color.layer_name='Color'
        mat.node_tree.links.new(color.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
    output=[make_surface('RoadLane',vertices,groups['lane'],materials[0]),make_surface('RoadSkirt',vertices,groups['skirt'],materials[1])]
    cells={};surface=groups['lane']+groups['skirt']
    for tri in surface:
        ps=[vertices[i]['p'] for i in tri]
        for ix in range(math.floor(min(p[0] for p in ps)/3),math.floor(max(p[0] for p in ps)/3)+1):
            for iz in range(math.floor(min(p[2] for p in ps)/3),math.floor(max(p[2] for p in ps)/3)+1):cells.setdefault((ix,iz),[]).append(ps)
    def final_height(x,z):
        hits=[]
        for ps in cells.get((math.floor(x/3),math.floor(z/3)),[]):
            w=bary(x,z,*ps)
            if min(w)>=-1e-6:hits.append(sum(a*p[1] for a,p in zip(w,ps)))
        if not hits:raise ValueError(('fragment outside surface',x,z))
        return max(hits)
    # A small, low debris population is visual only and adds no contact height.
    bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/rocks-lod.glb'))
    scans=sorted([o for o in bpy.context.scene.objects if o.type=='MESH' and o not in output],key=lambda o:o.name)
    templates={level:[CUT['simplified_template'](o,budget) for o in scans] for level,budget in [('near',72),('far',20)]}
    for obj in scans:bpy.data.objects.remove(obj,do_unlink=True)
    rng=random.Random(834192);fragments=[]
    # Unequal fans of washed-out gravel, with long empty stretches between.
    # Local lobes and a few loose singles avoid a continuous dotted edge strip.
    assignments=[fan for fan in FANS for _ in range(fan[3])]+[None]*20
    for fan in assignments:
      for attempt in range(80):
        if fan:
            centre,side,lateral,_,length,width=fan
            a=rng.random()*math.tau;r=math.sqrt(rng.random())
            lobe=-.45 if rng.random()<.35 else .25
            t=clamp(centre+math.sin(a)*r*length+lobe,.5,COUNT-.5)
            offset=lateral+math.cos(a)*r*width+.35*math.sin((t-centre)*2.2)
        else:t=rng.uniform(.6,COUNT-.6);side=-1 if rng.random()<.56 else 1;offset=rng.uniform(6.0,10.4)
        _,_,c,d,_,_=frame(t);hit=ray_hit(t,side)
        limit=min(11.5+.5*math.sin(lerp(distance[min(COUNT-1,int(t))],distance[min(COUNT-1,int(t))+1],t-int(t))*.16)-.3,hit[0]-.22 if hit else 20)
        if offset<5.2 or offset>limit:continue
        x=c[0]+d[0]*side*offset;z=c[2]+d[1]*side*offset;size=rng.uniform(.065,.25)
        y=min(final_height(x+dx,z+dz) for dx,dz in [(0,0),(-size*.4,0),(size*.4,0),(0,-size*.4),(0,size*.4)])-.005
        fragments.append({'x':x,'z':z,'y':y,'size':size,'height':rng.uniform(.02,.072),'yaw':rng.random()*math.tau,'variant':rng.randrange(len(scans)),'section':0 if t<COUNT/2 else 1})
        break
      else:raise ValueError('Unable to seat a gravel fan fragment')
    for section in range(2):
        for level in ['near','far']:
            ps=[];uv=[];colors=[];faces=[]
            for spec in fragments:
                if spec['section']!=section:continue
                template=templates[level][spec['variant']];offset=len(ps);rot=Euler((0,0,spec['yaw']),'XYZ').to_matrix()
                bounds=[p[1] for p in template['p']];low=min(bounds);height=max(bounds)-low
                for p in template['p']:
                    q=to_world(rot@Vector(to_blender((p[0]*spec['size'],(p[1]-low)*spec['height']/height,p[2]*spec['size']))))
                    ps.append((q[0]+spec['x'],q[1]+spec['y'],q[2]+spec['z']))
                uv.extend(template['uv']);colors.extend([(.80,.86,.9,1)]*len(template['p']));faces.extend(tuple(offset+v for v in f) for f in template['faces'])
            obj=CUT['make_mesh'](f'RoadFragments_{section}_{level}',ps,faces,uv,colors,materials[2]);output.append(obj)
    data={'sector':BASE['sector'],'surface':{'positions':[v for p in vertices for v in p['p']],'uv':[v for p in vertices for v in p['uv']],
          'colors':[v for p in vertices for v in p['color']],'groups':{k:[v for tri in fs for v in tri] for k,fs in groups.items()}},'fragments':fragments}
    data_path=ROOT/'source/models/quarry-road-approach-data.json';data_path.write_text(json.dumps(data,separators=(',',':')),newline='\n')
    bounds={'startSegment':START,'endSegmentExclusive':END,'segments':360};(ROOT/'src/quarry-road-approach-bounds.json').write_text(json.dumps(bounds,indent=2),newline='\n')
    bpy.ops.object.select_all(action='DESELECT')
    for obj in output:obj.select_set(True)
    blend=ROOT/'source/models/quarry-road-approach.blend';bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    glb=ROOT/'public/models/quarry-road-approach.glb';bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True,export_materials='EXPORT',export_yup=True)
    manifest={'version':1,'generator':'tools/author-quarry-road-approach.py','sector':bounds,'lengthMetres':distance[-1],
              'masks':'COLOR_0 RGB = coverage, compaction, drainage; UV0 = longitudinal metres, signed lateral metres; restore Blender V on road meshes only.',
              'physics':'Exact existing lane planes; thin visual shoulders/skirt and fragments only. No collision or traction changes.',
              'source':'Original geometry and existing CC0 Rock Moss Set 01 scanned fragments','source_url':'https://polyhaven.com/a/rock_moss_set_01',
              'runtime_maps':'Existing shared gravel, mud, Rock Ground, forest/rock ground and scanned rock atlas; no embedded texture maps.',
              'fragmentCount':len(fragments),'meshes':[{'name':o.name,'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in output],
              'assets':[{'file':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [glb,blend,data_path,ROOT/'source/models/quarry-road-approach-base.json']]}
    (ROOT/'source/models/quarry-road-approach-manifest.json').write_text(json.dumps(manifest,indent=2),newline='\n');print('ROAD_APPROACH_REPORT',json.dumps(manifest),flush=True)

if __name__=='__main__':main()
