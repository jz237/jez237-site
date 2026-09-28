"""Author the next extraction bay; Blender --background --python this file.

The frozen lower apron and perimeter close against the released quarry. Runtime
uses existing rock maps/scan atlas; the exact near wall supplies shared physics.
"""
import bpy,bmesh,math,json,pathlib,random,hashlib,runpy,struct,functools
from mathutils import Vector,Euler
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE=json.loads((ROOT/'source/models/quarry-extension-base.json').read_text())
CUT=runpy.run_path(str(ROOT/'tools/author-quarry-cut.py'),run_name='quarry_cut_helpers')
START,END=139,172
BREAKS=[139,150,161,172]
ROWS=sorted(set([float(i) for i in range(7)]+[6.12,9.25,11.8,20.2,22.25]+[i/4 for i in range(25,121)]))
clamp=CUT['clamp'];lerp=CUT['lerp'];mix=CUT['mix'];smooth=CUT['smooth']
to_blender=CUT['xyz_to_blender'];to_world=CUT['blender_to_xyz']
f32=lambda x:struct.unpack('f',struct.pack('f',x))[0]
SURFACE=[];CELLS={};WALL_PARAMS={}
def fracture_controls(seed):
    rng=random.Random(seed);angles=[float(START)]
    while angles[-1]<END:angles.append(min(END,angles[-1]+rng.uniform(1.05,2.7)))
    return [(a,[rng.uniform(-1,1) for _ in range(6)]) for a in angles]
LOWER=fracture_controls(88142);UPPER=fracture_controls(95681);RIDGE=fracture_controls(91357)

def fracture_plates(seed,lo,hi):
    """An irregular joint network in the unfolded face, with planar interiors.

    Unlike independent bumps, adjoining plates share a recessed bevel at their
    Voronoi border. Jittered cells and oblique per-cell planes avoid brick courses.
    """
    rng=random.Random(seed);plates=[];r=lo-.8
    while r<hi+1.5:
        a=START-1.1+rng.uniform(-.5,.5)
        while a<END+1.5:
            plates.append((a+rng.uniform(-.28,.28),r+rng.uniform(-.55,.55),
                           rng.uniform(-.96,.20),rng.uniform(-.18,.18),rng.uniform(-.16,.16),rng.uniform(.32,.55)))
            a+=rng.uniform(.78,1.62)
        r+=rng.uniform(1.3,2.15)
    return plates

FACE_PLATES=[(6,14,fracture_plates(48211,6,14)),(18,24,fracture_plates(66383,18,24))]
NOTCHES=[]
for ledge,seed in [(14,91217),(24,47289)]:
    rng=random.Random(seed);a=START+2.0
    while a<END-1.7:
        NOTCHES.append((ledge,a,rng.uniform(.40,.92),rng.uniform(.65,1.3),rng.uniform(.3,.62),rng.uniform(-.30,.30)))
        a+=rng.uniform(1.65,3.4)

def fracture_relief(row,degrees):
    radial=0.0;vertical=0.0
    for lo,hi,plates in FACE_PLATES:
        if not lo<row<hi:continue
        # World-scale unfolding: one angular degree is about3m at this wall,
        # while the local radial parameter corresponds to about1m of rise.
        closest=sorted((((degrees-a)*3.0)**2+((row-r)*1.18)**2,p) for p in plates for a,r,*_ in [p])[:2]
        (_,p),(d2,q)=closest;d1=closest[0][0]
        separation=math.hypot((p[0]-q[0])*3.0,(p[1]-q[1])*1.18)
        edge_distance=(d2-d1)/max(1e-6,2*separation)
        plane=p[2]+p[3]*(degrees-p[0])*3.0+p[4]*(row-p[1])*1.18
        bevel=clamp(edge_distance/p[5],0,1)
        envelope=min(1,(row-lo)/.72,(hi-row)/.60)
        radial+=lerp(.24,plane,bevel)*envelope
    for ledge,a,width,depth,drop,slant in NOTCHES:
        if not ledge-1.35<row<ledge+1.8:continue
        axis=a+slant*(row-ledge)
        angular=clamp((1-abs(degrees-axis)/width)*1.6,0,1)
        radial_envelope=clamp(min((row-(ledge-1.35))/1.35,((ledge+1.8)-row)/1.8),0,1)
        # Remove an angular wedge from the face lip, leaving a chipped shelf.
        radial+=depth*angular*radial_envelope
        vertical-=drop*angular*radial_envelope
    return radial,vertical

def control(points,degrees,channel):
    a,b=next((a,b) for a,b in zip(points,points[1:]) if a[0]<=degrees<=b[0])
    return lerp(a[1][channel],b[1][channel],(degrees-a[0])/(b[0]-a[0]))

def coarse_original(points,degrees,row):
    a,b=next((a,b) for a,b in zip(points,points[1:]) if a[0]<=degrees<=b[0])
    return mix(original(row,a[0])[0],original(row,b[0])[0],(degrees-a[0])/(b[0]-a[0]))

def original(row,degrees):
    row=clamp(row,0,30);col=clamp(degrees-START,0,END-START)
    r=min(29,int(row));c=min(END-START-1,int(col));fx=col-c;fy=row-r
    return tuple(mix(mix(BASE['rows'][r][c][key],BASE['rows'][r][c+1][key],fx),
                     mix(BASE['rows'][r+1][c][key],BASE['rows'][r+1][c+1][key],fx),fy)
                 for key in ['p','uv','color'])

def radius(p):return math.hypot(p[0]/1.08,p[2])

def target(row,degrees):
    old,_,_=original(row,degrees)
    if row<=6 or row==30 or degrees in [START,END]:return old
    foot=original(6,degrees)[0];top=original(30,degrees)[0]
    r0=radius(foot);crest=radius(top)
    # One offset extraction bay: two real steep faces, an intermediate bench,
    # then a broken ridge that closes behind itself to the unchanged outer rim.
    # Coherent multi-metre fracture planes have independent angular breaks at
    # each face. A few large hinges carry the shape; no repeated chip embossing.
    lower_base=radius(coarse_original(LOWER,degrees,6))
    first_r=max(r0+.85,lower_base+2.5+1.6*control(LOWER,degrees,0))
    first_y=coarse_original(LOWER,degrees,15)[1]+1.35*control(LOWER,degrees,1)
    middle_r=max(first_r+7.0,lower_base+17.0+2.4*control(UPPER,degrees,0))
    middle_y=max(first_y+.35,coarse_original(UPPER,degrees,18)[1]+.65*control(UPPER,degrees,1))
    second_r=middle_r+2.4+1.4*control(UPPER,degrees,2)
    ridge_y=max(middle_y+3.8,coarse_original(RIDGE,degrees,30)[1]+1.8+1.3*control(RIDGE,degrees,0))
    first_hinge1=.28+.13*control(LOWER,degrees,2)
    first_hinge2=.64+.11*control(UPPER,degrees,3)
    second_hinge1=.26+.13*control(UPPER,degrees,4)
    second_hinge2=.68+.12*control(RIDGE,degrees,2)
    knots=[(6,r0,foot[1]),
           (9.25,lerp(r0,first_r,first_hinge1),lerp(foot[1],first_y,.40)+.3*control(LOWER,degrees,4)),
           (11.8,lerp(r0,first_r,first_hinge2),lerp(foot[1],first_y,.72)+.25*control(UPPER,degrees,5)),
           (14,first_r,first_y),(18,middle_r,middle_y),
           (20.2,lerp(middle_r,second_r,second_hinge1),lerp(middle_y,ridge_y,.37)+.25*control(UPPER,degrees,3)),
           (22.25,lerp(middle_r,second_r,second_hinge2),lerp(middle_y,ridge_y,.71)+.3*control(RIDGE,degrees,3)),
           (24,second_r,ridge_y),
           (27,min(crest-8,lower_base+34+2*control(RIDGE,degrees,4)),ridge_y-.8),
           (30,crest,top[1])]
    a,b=next((a,b) for a,b in zip(knots,knots[1:]) if a[0]<=row<=b[0])
    t=(row-a[0])/(b[0]-a[0]);r=lerp(a[1],b[1],t);y=lerp(a[2],b[2],t)
    edge=smooth(0,2.1,degrees-START)*smooth(0,2.1,END-degrees)
    # The chute changes direction at fractured bedding planes. Asymmetric,
    # piecewise banks replace the former smooth triangular/trapezoid ramps.
    axes=[(6,157.9),(11,158.45),(15,158.05),(20,158.65),(24,158.15),(30,158.5)]
    ga,gb=next((a,b) for a,b in zip(axes,axes[1:]) if a[0]<=row<=b[0])
    axis=lerp(ga[1],gb[1],(row-ga[0])/(gb[0]-ga[0]))
    side=degrees-axis;distance=abs(side)
    outer=2.55 if side<0 else 3.1
    outer+=.28*math.sin(row*.53)
    cuts=[(0,1),(.62,.92),(outer*.65,.28),(outer,0)]
    if distance>=outer:collapse=0
    else:
        ca,cb=next((a,b) for a,b in zip(cuts,cuts[1:]) if a[0]<=distance<=b[0])
        collapse=lerp(ca[1],cb[1],(distance-ca[0])/(cb[0]-ca[0]))
    weight=edge*(1-collapse*.97)
    r=lerp(radius(old),r,weight);y=lerp(old[1],y,weight)
    dr,dy=fracture_relief(row,degrees)
    r+=dr*edge;y+=dy*edge
    a=math.radians(degrees)
    return (math.sin(a)*r*1.08,y,math.cos(a)*r)

@functools.lru_cache(maxsize=None)
def column(degrees):
    points=[]
    for row in ROWS:
        # Local overhangs are intentional fracture lips; the shared exact mesh
        # is collision geometry, rather than a height-field approximation.
        p=target(row,degrees)
        points.append(tuple(f32(v) for v in p))
    distances=[0.0]
    for a,b in zip(points,points[1:]):distances.append(distances[-1]+math.dist(a,b))
    six=ROWS.index(6.0);v6=original(6,degrees)[1][1]
    end_v=v6+(distances[-1]-distances[six])/3.6
    correction=original(30,degrees)[1][1]-end_v
    data=[]
    for i,row in enumerate(ROWS):
        _,uv,color=original(row,degrees)
        if row>6 and degrees not in [START,END]:
            v=v6+(distances[i]-distances[six])/3.6+correction*smooth(24,30,row)
            uv=(uv[0],v)
        shade=.79+.035*math.sin(degrees*.61+row*.44)
        blend=smooth(6,9,row)*smooth(0,2.1,degrees-START)*smooth(0,2.1,END-degrees)*smooth(0,2,30-row)
        tint=mix(color,(shade*.985,shade,shade*1.015),blend)
        data.append((points[i],uv,(*tint,1)))
    return data

def point_at(row,degrees):
    data=column(round(degrees,8));i=next(i for i in range(len(ROWS)-1) if ROWS[i]<=row<=ROWS[i+1])
    return mix(data[i][0],data[i+1][0],(row-ROWS[i])/(ROWS[i+1]-ROWS[i]))

def surface_height(x,z):
    heights=[]
    for ti in CELLS.get((math.floor(x/4),math.floor(z/4)),[]):
        a,b,c=SURFACE[ti]
        det=(b[2]-c[2])*(a[0]-c[0])+(c[0]-b[0])*(a[2]-c[2])
        if abs(det)<1e-12:continue
        u=((b[2]-c[2])*(x-c[0])+(c[0]-b[0])*(z-c[2]))/det
        v=((c[2]-a[2])*(x-c[0])+(a[0]-c[0])*(z-c[2]))/det
        if min(u,v,1-u-v)>=-1e-7:heights.append(u*a[1]+v*b[1]+(1-u-v)*c[1])
    if heights:return max(heights)
    degrees=clamp(math.degrees(math.atan2(x/1.08,z)),START,END);r=math.hypot(x/1.08,z)
    col=column(round(degrees*4)/4);last=col[0][0]
    for data in col[1:]:
        p=data[0]
        if r<=radius(p):return lerp(last[1],p[1],clamp((r-radius(last))/max(1e-6,radius(p)-radius(last)),0,1))
        last=p
    return last[1]

def wall_mesh(section,level,material):
    lo,hi=BREAKS[section:section+2];div=8 if level=='near' else 4
    positions=[];uv=[];colors=[];params=[];strips=[];faces=[]
    for ri,row in enumerate(ROWS):
        step=1 if row<=6 else 1/div
        degrees=[lo+i*step for i in range(round((hi-lo)/step)+1)]
        if row>6:
            # Both LODs retain structural fracture corners exactly.
            degrees=sorted(set(degrees+[a for controls in [LOWER,UPPER,RIDGE] for a,_ in controls if lo<a<hi]))
        start=len(positions)
        for a in degrees:
            p,t,c=column(a)[ri];positions.append(p);uv.append(t);colors.append(c);params.append((row,a))
        strips.append((start,degrees))
    for (start,a),(nxt,b) in zip(strips,strips[1:]):
        i=j=0
        while i<len(a)-1 or j<len(b)-1:
            if i==len(a)-1:faces.append((start+i,nxt+j,nxt+j+1));j+=1
            elif j==len(b)-1:faces.append((start+i,nxt+j,start+i+1));i+=1
            elif abs(a[i+1]-b[j+1])<1e-7:
                # Keep the exact legacy diagonal, including the preserved apron.
                faces.extend([(start+i,nxt+j,start+i+1),(start+i+1,nxt+j,nxt+j+1)]);i+=1;j+=1
            elif a[i+1]<b[j+1]:faces.append((start+i,nxt+j,start+i+1));i+=1
            else:faces.append((start+i,nxt+j,nxt+j+1));j+=1
    obj=CUT['make_mesh'](f'ExtensionRock_{section}_{level}',positions,faces,uv,colors,material,False)
    WALL_PARAMS[obj.name]=params
    custom=[];mesh=obj.data;averages={}
    for poly in mesh.polygons:
        row=sum(params[v][0] for v in poly.vertices)/3
        if not (6<row<14 or 18<row<24):
            for v in poly.vertices:averages[v]=averages.get(v,Vector())+poly.normal*poly.area
    for poly in mesh.polygons:
        row=sum(params[v][0] for v in poly.vertices)/3;band=min(29,int(row))
        for loop in poly.loop_indices:
            vi=mesh.loops[loop].vertex_index;r,a=params[vi]
            if a in [START,END]:
                side='left' if a==START else 'right';pair=BASE['normalBands'][band][side]
                normal=Vector(to_blender(mix(pair[0],pair[1],clamp(r-band,0,1))))
            elif row<=6:normal=poly.normal
            else:normal=averages.get(vi,poly.normal) if not (6<row<14 or 18<row<24) else poly.normal
            custom.append(tuple(normal.normalized()))
        poly.use_smooth=True
    mesh.normals_split_custom_set(custom)
    return obj

def finish_wall_shading(walls):
    """Remove grid-triangle shading while preserving real fracture corners.

    Neighbours span chunk boundaries. The 50-degree gate keeps the deep joints
    crisp, while area and corner-angle weighting rejects skinny bevel slivers.
    Protected apron/perimeter normals retain their exact imported values.
    """
    cosine=math.cos(math.radians(50))
    for level in ['near','far']:
        objects=[walls[(s,level)] for s in range(3)];neighbours={}
        for obj in objects:
            mesh=obj.data
            for poly in mesh.polygons:
                vertices=list(poly.vertices)
                for i,vi in enumerate(vertices):
                    p=mesh.vertices[vi].co
                    v1=mesh.vertices[vertices[i-1]].co-p;v2=mesh.vertices[vertices[(i+1)%len(vertices)]].co-p
                    angle=v1.angle(v2,0.0);key=tuple(round(v,6) for v in p)
                    neighbours.setdefault(key,[]).append((poly.normal.copy(),poly.area*angle))
        for obj in objects:
            mesh=obj.data;params=WALL_PARAMS[obj.name];old=[tuple(n.vector) for n in mesh.corner_normals];custom=[]
            for poly in mesh.polygons:
                for loop in poly.loop_indices:
                    vi=mesh.loops[loop].vertex_index;r,a=params[vi]
                    if r<=6 or r==30 or a in [START,END]:custom.append(old[loop]);continue
                    key=tuple(round(v,6) for v in mesh.vertices[vi].co)
                    normal=sum((n*w for n,w in neighbours[key] if n.dot(poly.normal)>=cosine),Vector())
                    custom.append(tuple(normal.normalized() if normal.length>1e-10 else poly.normal))
            mesh.normals_split_custom_set(custom)

def finish_wall_uv(walls):
    """Relax UV shear on the bevels, with fixed authored and inter-chunk joins.

    The near mesh is the sole unwrap authority. Far vertices are an exact subset
    of its parameters and inherit those UVs, so LOD switching does not rephase
    the photograph. Every apron/perimeter loop stays pinned to the frozen data.
    """
    for section in range(3):
        near=walls[(section,'near')];mesh=near.data;params=WALL_PARAMS[near.name]
        lo,hi=BREAKS[section:section+2];layer=mesh.uv_layers.active
        protected={}
        for loop in mesh.loops:
            row,a=params[loop.vertex_index]
            fixed=row<=6 or row==30 or a in [lo,hi]
            layer.data[loop.index].pin_uv=fixed
            if fixed:protected[loop.index]=tuple(layer.data[loop.index].uv)
        # Edit-mode unwrap may reorder internal mesh arrays. Operate on a copy
        # and transfer only UV coordinates back by immutable vertex position.
        temporary=near.copy();temporary.data=mesh.copy();bpy.context.collection.objects.link(temporary)
        bpy.ops.object.select_all(action='DESELECT');temporary.select_set(True);bpy.context.view_layer.objects.active=temporary
        bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
        bpy.ops.uv.unwrap(method='ANGLE_BASED',margin=0)
        bpy.ops.object.mode_set(mode='OBJECT')
        unwrapped=temporary.data;temp_layer=unwrapped.uv_layers.active
        by_position={tuple(round(v,6) for v in unwrapped.vertices[loop.vertex_index].co):tuple(temp_layer.data[loop.index].uv) for loop in unwrapped.loops}
        for loop in mesh.loops:
            key=tuple(round(v,6) for v in mesh.vertices[loop.vertex_index].co)
            layer.data[loop.index].uv=by_position[key]
        temp_mesh=temporary.data;bpy.data.objects.remove(temporary,do_unlink=True);bpy.data.meshes.remove(temp_mesh)
        for loop,value in protected.items():layer.data[loop].uv=value
        shared={}
        for loop in mesh.loops:
            row,a=params[loop.vertex_index];shared[(row,round(a,8))]=tuple(layer.data[loop.index].uv)
        far=walls[(section,'far')];layer=far.data.uv_layers.active
        for loop in far.data.loops:
            row,a=WALL_PARAMS[far.name][loop.vertex_index]
            layer.data[loop.index].uv=shared[(row,round(a,8))]

def rubble_specs():
    rng=random.Random(952726);specs=[]
    groups=[(145.3,15.7),(151.6,16.2),(157.7,10.6),(158.5,19.4),(164.0,17.1),(168.0,25.2)]
    for gi,(a,row) in enumerate(groups):
        for i in range(22):
            large=i<4;degrees=clamp(rng.gauss(a,.65),START+2.5,END-2.5)
            r=clamp(rng.gauss(row,1.0),7.5,27)
            p=point_at(r,degrees);size=rng.uniform(2.0,3.8) if large else rng.uniform(.45,1.7)
            specs.append({'x':p[0],'z':p[2],'diameter':size,'height':rng.uniform(.55,.94),
                          'yaw':rng.random()*math.tau,'pitch':rng.uniform(-.35,.35),'roll':rng.uniform(-.3,.3),
                          'variant':rng.randrange(6),'large':large,'shade':rng.uniform(.82,1),
                          'section':min(2,int((degrees-START)/11))})
    return specs

def rubble_points(template,spec):
    rot=Euler((spec['pitch'],spec['roll'],spec['yaw']),'XYZ').to_matrix();points=[]
    for p in template['p']:
        q=to_world(rot@Vector(to_blender((p[0]*spec['diameter'],p[1]*spec['diameter']*spec['height'],p[2]*spec['diameter']))))
        points.append((q[0]+spec['x'],q[1],q[2]+spec['z']))
    low=min(p[1] for p in points);high=max(p[1] for p in points)
    support=sorted(surface_height(x,z)-y for x,y,z in points if y<low+(high-low)*.3)
    anchor=spec.setdefault('anchor',support[len(support)//3]-.13*spec['diameter'])
    return [(x,y+anchor,z) for x,y,z in points]

def hull_points(points):
    selected=[]
    for d in [(x,y,z) for x in [-1,0,1] for y in [-1,0,1] for z in [-1,0,1] if x or y or z]:
        p=max(points,key=lambda p:sum(p[k]*d[k] for k in range(3)))
        if p not in selected:selected.append(p)
    return [f32(v) for p in selected for v in p]

def main():
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/rocks-lod.glb'))
    originals=sorted([o for o in bpy.context.scene.objects if o.type=='MESH'],key=lambda o:o.name)
    templates={name:[CUT['simplified_template'](o,budget) for o in originals] for name,budget in [('large_near',680),('small_near',360),('large_far',180),('small_far',90)]}
    for o in originals:bpy.data.objects.remove(o,do_unlink=True)
    materials=[]
    for name in ['EXISTING_QUARRY_ROCK','EXISTING_SCAN_ATLAS']:
        mat=bpy.data.materials.new(name);mat.use_nodes=True
        color=mat.node_tree.nodes.new('ShaderNodeVertexColor');color.layer_name='Color'
        mat.node_tree.links.new(color.outputs['Color'],mat.node_tree.nodes.get('Principled BSDF').inputs['Base Color']);materials.append(mat)
    output=[];specs=rubble_specs();solids=[];collision_positions=[];collision_indices=[];wall_sections=[]
    walls={(section,level):wall_mesh(section,level,materials[0]) for section in range(3) for level in ['near','far']}
    finish_wall_uv(walls)
    finish_wall_shading(walls)
    for (section,level),wall in walls.items():
        if level!='near':continue
        wall.data.calc_loop_triangles()
        for tri in wall.data.loop_triangles:
            points=[to_world(wall.data.vertices[i].co) for i in tri.vertices];ti=len(SURFACE);SURFACE.append(points)
            for ix in range(math.floor(min(p[0] for p in points)/4),math.floor(max(p[0] for p in points)/4)+1):
                for iz in range(math.floor(min(p[2] for p in points)/4),math.floor(max(p[2] for p in points)/4)+1):CELLS.setdefault((ix,iz),[]).append(ti)
    for section in range(3):
        for level in ['near','far']:
            wall=walls[(section,level)];output.append(wall)
            if level=='near':
                start=len(collision_positions)//3;first=len(collision_indices)//3
                wall.data.calc_loop_triangles();collision_positions.extend(f32(v) for p in wall.data.vertices for v in to_world(p.co))
                for tri in wall.data.loop_triangles:collision_indices.extend(start+v for v in tri.vertices)
                wall_sections.append({'id':section,'startCell':BREAKS[section],'endCellExclusive':BREAKS[section+1],'firstTriangle':first,'triangleCount':len(collision_indices)//3-first})
            ps=[];uv=[];colors=[];faces=[]
            for i,spec in enumerate(specs):
                if spec['section']!=section:continue
                key=('large' if spec['large'] else 'small')+'_'+level;template=templates[key][spec['variant']]
                points=rubble_points(template,spec);offset=len(ps);ps.extend(points);uv.extend(template['uv'])
                shade=spec['shade'];colors.extend([(shade*.84,shade*.92,shade,1)]*len(points));faces.extend(tuple(offset+v for v in f) for f in template['faces'])
                if level=='near':solids.append({'id':f'extension-fragment-{i}','points':hull_points(points)})
            rubble=CUT['make_mesh'](f'ExtensionRubble_{section}_{level}',ps,faces,uv,colors,materials[1])
            bm=bmesh.new();bm.from_mesh(rubble.data);bmesh.ops.remove_doubles(bm,verts=list(bm.verts),dist=.00001);bm.to_mesh(rubble.data);bm.free();rubble.data.update();output.append(rubble)
    data={'version':1,'sector':{'startCell':START,'endCellExclusive':END},'positions':collision_positions,'indices':collision_indices,
          'wallTriangleCount':len(collision_indices)//3,'wallSections':wall_sections,'solids':solids}
    data_path=ROOT/'src/quarry-extension-collision.json';data_path.write_text(json.dumps(data,separators=(',',':')),newline='\n')
    for obj in output:obj.select_set(True)
    blend=ROOT/'source/models/quarry-extension.blend';bpy.ops.wm.save_as_mainfile(filepath=str(blend))
    glb=ROOT/'public/models/quarry-extension.glb';bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',use_selection=True,export_apply=True,export_materials='EXPORT',export_yup=True)
    report={'version':1,'generator':'tools/author-quarry-extension.py','base':'source/models/quarry-extension-base.json',
            'source':'Original authored quarry geometry and Poly Haven Rock Moss Set 01 CC0 fragments','source_url':'https://polyhaven.com/a/rock_moss_set_01',
            'runtime_maps':'Shared Rock Boulder Dry color/normal/roughness plus existing Rock Moss Set 01 atlas; no embedded textures',
            'sector':data['sector'],'preservedLowerRows':[0,6],'gullyDegrees':[155.0,161.75],'wallTriangleCount':data['wallTriangleCount'],'solidCount':len(solids),
            'meshes':[{'name':o.name,'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in output],
            'assets':[{'file':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in [glb,blend,data_path,ROOT/'source/models/quarry-extension-base.json']]}
    (ROOT/'source/models/quarry-extension-manifest.json').write_text(json.dumps(report,indent=2),newline='\n')
    print('EXTENSION_REPORT',json.dumps(report),flush=True)

if __name__=='__main__':main()
