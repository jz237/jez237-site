"""Refine licensed Car Concept derivatives for close inspection and wrecks.

Run after prepare_concept.py. Keeps the source artist's silhouette and credit,
adds real sheet-metal edges, split crash panels and an exposed engine bay.
The untouched first preparation remains in source/models/; refined editable
files are saved separately. Dimensions below use Blender Z-up coordinates.

To regenerate only one car:
  blender --background --python tools/refine_cars.py -- --kind coupe
"""
import bpy, pathlib, math, json, struct, hashlib, argparse, sys
from mathutils import Vector
from mathutils.bvhtree import BVHTree
ROOT = pathlib.Path(__file__).resolve().parents[1]
CAR_KINDS = ('coupe', 'sedan', 'hatch')
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--kind', choices=(*CAR_KINDS, 'all'), default='all',
                    help='Export only this derivative; default preserves the all-car workflow.')
args = parser.parse_args(sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else [])
selected_kinds = CAR_KINDS if args.kind == 'all' else (args.kind,)
# A focused export must not silently rewrite another car's editable or runtime
# derivative. Keep the existing shared manifest entries, but verify these files.
preserved_hashes = {}
for other in CAR_KINDS:
    if other in selected_kinds:continue
    for relative in [f'public/models/{other}.glb', f'source/models-refined/{other}.blend']:
        path = ROOT/relative
        if path.exists():preserved_hashes[relative] = hashlib.sha256(path.read_bytes()).hexdigest()

def material(name, color, metallic, roughness):
    m = bpy.data.materials.new(name); m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = roughness
    return m

def box(name, pos, scale, mat, bevel=.015):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    o = bpy.context.object; o.name = name; o.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(mat)
    if bevel:
        b=o.modifiers.new('Machined edge radius','BEVEL'); b.width=bevel;b.segments=2
        bpy.ops.object.modifier_apply(modifier=b.name)
        for p in o.data.polygons:p.use_smooth=True
    return o

def tube(name, a, b, radius, mat, vertices=12):
    a,b=Vector(a),Vector(b);d=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=d.length, location=(a+b)*.5)
    o=bpy.context.object;o.name=name;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();o.data.materials.append(mat)
    for p in o.data.polygons:p.use_smooth=True
    return o

def routed_tube(name, points, radius, mat, sides=8):
    """One continuous bent hose; no overlapping capped cylinders at elbows."""
    points=[Vector(p) for p in points];verts=[];faces=[]
    for i,p in enumerate(points):
        tangent=(points[min(i+1,len(points)-1)]-points[max(0,i-1)]).normalized()
        axis=tangent.cross(Vector((0,0,1)))
        if axis.length<.01:axis=tangent.cross(Vector((0,1,0)))
        axis.normalize();up=tangent.cross(axis).normalized()
        for j in range(sides):
            a=j*math.tau/sides;verts.append(p+radius*(axis*math.cos(a)+up*math.sin(a)))
    for i in range(len(points)-1):
        for j in range(sides):
            a=i*sides+j;b=i*sides+(j+1)%sides;faces.append((a,b,b+sides,a+sides))
    faces.extend([tuple(reversed(range(sides))),tuple(range((len(points)-1)*sides,len(points)*sides))])
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);mesh.materials.append(mat)
    for p in mesh.polygons:p.use_smooth=len(p.vertices)==4
    return o

def channel_rail(name, x, front, back, bottom, width, height, mat):
    """Open-ended boxed crash rail with actual thin metal walls and a folded lip."""
    wall=.008;verts=[];faces=[]
    for y in [front,back]:
        for inset in [0,wall]:
            verts.extend([(x-width/2+inset,y,bottom+inset),(x+width/2-inset,y,bottom+inset),
                          (x+width/2-inset,y,bottom+height-inset),(x-width/2+inset,y,bottom+height-inset)])
    for j in range(4):
        k=(j+1)%4
        faces.extend([(j,k,k+8,j+8),(j+4,j+12,k+12,k+4),
                      (j,j+4,k+4,k),(j+8,k+8,k+12,j+12)])
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],[tuple(reversed(f)) for f in faces]);mesh.update()
    o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);mesh.materials.append(mat)
    return o

def crash_beam(mat):
    # A shallow bowed aluminium extrusion, recessed behind the intact fascia.
    verts=[];faces=[]
    for x in [-.65,-.4,0,.4,.65]:
        y=-1.915+abs(x)*.105
        verts.extend([(x,y-.034,.535),(x,y+.034,.535),(x,y+.034,.625),(x,y-.034,.625)])
    for i in range(4):
        for j in range(4):faces.append((i*4+j,i*4+(j+1)%4,(i+1)*4+(j+1)%4,(i+1)*4+j))
    faces.extend([(3,2,1,0),(16,17,18,19)])
    mesh=bpy.data.meshes.new('Structure bowed bumper beam');mesh.from_pydata(verts,[],faces);mesh.update()
    o=bpy.data.objects.new(mesh.name,mesh);bpy.context.collection.objects.link(o);mesh.materials.append(mat)
    return o

def front_structure(kind):
    """Original low-poly engine bay, kept behind the licensed exterior panels."""
    steel=material('Structure galvanized steel',(.21,.24,.25),.83,.38)
    iron=material('Structure cast alloy',(.15,.17,.18),.7,.46)
    rubber=material('Structure hoses',(.014,.018,.020),.05,.84)
    heat=material('Structure heat shield',(.46,.44,.38),.84,.33)
    for side in [-1,1]:
        channel_rail('Structure hollow crash rail',side*.55,-1.88,-.98,.43,.115,.135,steel)
        box('Structure inner wheelhouse',(side*.77,-1.29,.69),(.07,.61,.31),iron,.007)
        tube('Structure strut brace',(side*.7,-1.13,.83),(0,-.87,.84),.022,steel,10)
        tube('Structure exhaust',(side*.29,.0,.28),(side*.29,1.73,.31),.047,heat)
        # Stamped mounting plates and visible fasteners sit behind the beam.
        box('Structure beam mounting plate',(side*.55,-1.875,.585),(.20,.015,.17),steel,.003)
        for dx in [-.066,.066]:
            for z in [.537,.634]:
                tube('Structure mounting bolt',(side*.55+dx,-1.892,z),(side*.55+dx,-1.906,z),.012,iron,6)
        for y in [-1.64,-1.43]:
            box('Structure rail crush rib',(side*.55,y,.57),(.12,.028,.012),steel,.002)
    crash_beam(steel)
    # Thin cooling core, end tanks and top support; simple un-bevelled horizontal
    # slats replace 2,700 triangles of oversized individual machined fins.
    box('Structure radiator core',(0,-1.80,.70),(.99,.035,.295),rubber,.002)
    for i in range(20):
        box('Structure radiator cooling fin',(0,-1.824,.565+i*.014),(.955,.009,.004),iron,0)
    for side in [-1,1]:
        box('Structure radiator end tank',(side*.535,-1.792,.70),(.065,.065,.325),iron,.007)
        box('Structure radiator bracket',(side*.555,-1.79,.865),(.11,.075,.016),steel,.002)
        tube('Structure radiator bracket bolt',(side*.555,-1.79,.874),(side*.555,-1.79,.886),.012,iron,6)
    box('Structure radiator upper support',(0,-1.78,.87),(1.18,.055,.032),steel,.006)
    box('Structure lower radiator support',(0,-1.77,.526),(1.13,.045,.022),steel,.004)
    # Compact longitudinal engine behind the cooler instead of the inherited
    # normal-mapped cuboid that previously filled the entire front opening.
    box('Structure engine sump',(0,-1.25,.475),(.46,.61,.135),iron,.025)
    box('Structure engine block',(0,-1.28,.66),(.66,.63,.265),iron,.022)
    box('Structure engine cover',(0,-1.29,.817),(.56,.53,.045),rubber,.025)
    for x in [-.19,0,.19]:box('Structure cover rib',(x,-1.29,.844),(.025,.39,.009),iron,.002)
    for side in [-1,1]:
        for i in range(3):
            y=-1.47+i*.16
            routed_tube('Structure intake runner',[(side*.12,y,.82),(side*.23,y,.805),(side*.37,y,.75),(side*.39,y,.67)],.03,iron)
        routed_tube('Structure wiring loom',[(side*.37,-.97,.80),(side*.40,-1.15,.78),(side*.42,-1.43,.70),(side*.52,-1.53,.62)],.012,rubber)
    box('Structure battery',(.62,-1.47,.685),(.19,.27,.23),rubber,.008)
    box('Structure battery strap',(.62,-1.47,.807),(.022,.29,.012),steel,.002)
    for x in [.565,.675]:tube('Structure battery terminal',(x,-1.405,.80),(x,-1.405,.821),.015,heat,8)
    box('Structure coolant reservoir',(-.62,-1.47,.715),(.17,.23,.18),heat,.018)
    tube('Structure coolant cap',(-.62,-1.46,.808),(-.62,-1.46,.829),.033,rubber,10)
    routed_tube('Structure upper cooling hose',[(-.30,-1.47,.75),(-.40,-1.56,.78),(-.45,-1.68,.80),(-.48,-1.78,.77)],.035,rubber,10)
    routed_tube('Structure lower cooling hose',[(.31,-1.52,.56),(.4,-1.63,.53),(.46,-1.73,.55),(.49,-1.79,.60)],.029,rubber,10)
    # Match the preparation's wheelbase/height variants so parts stay concealed
    # on the shorter hatch as well as on the coupe and longer sedan.
    sx,sy,sz={'coupe':(1,1,1),'sedan':(1.92/1.98,2.98/2.72,1.48/1.36),'hatch':(1.84/1.98,2.46/2.72,1.50/1.36)}[kind]
    for o in list(bpy.context.scene.objects):
        if o.type=='MESH' and o.name.startswith('Structure'):
            bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
            bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
            for v in o.data.vertices:v.co.x*=sx;v.co.y*=sy;v.co.z*=sz
            # Runtime material batching requires matching attributes even though
            # these four materials use no texture maps.
            if not o.data.uv_layers:
                uv=o.data.uv_layers.new(name='UVMap')
                for loop in o.data.loops:
                    p=o.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(p.x,p.y+p.z)

def partition(obj, classify):
    # Preserve the artist's custom corner normals and UVs. Passing imported
    # glTF through bmesh would discard those normals, creating rippled seams.
    source=obj.data; groups={}
    for poly in source.polygons:
        center=sum((source.vertices[i].co for i in poly.vertices),Vector())/len(poly.vertices)
        groups.setdefault(classify(center),[]).append(poly.index)
    for name, faces in groups.items():
        polygons=[source.polygons[i] for i in faces]
        used=sorted(set(v for p in polygons for v in p.vertices));remap={v:i for i,v in enumerate(used)}
        mesh=bpy.data.meshes.new(name);mesh.from_pydata([source.vertices[i].co[:] for i in used],[],[[remap[v] for v in p.vertices] for p in polygons]);mesh.update()
        for m in source.materials:mesh.materials.append(m)
        for p,old in zip(mesh.polygons,polygons):p.material_index=old.material_index;p.use_smooth=old.use_smooth
        loops=[i for p in polygons for i in p.loop_indices]
        for layer in source.uv_layers:
            uv=mesh.uv_layers.new(name=layer.name)
            for i,old in enumerate(loops):uv.data[i].uv=layer.data[old].uv
        mesh.normals_split_custom_set([source.corner_normals[i].vector[:] for i in loops])
        o=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(o);o.matrix_world=obj.matrix_world
    bpy.data.objects.remove(obj,do_unlink=True)

def sheet_shell(obj, thickness=.0012):
    """Add an inside sheet and rim without changing any exterior shading normal."""
    source=obj.data
    vertices=[v.co.copy() for v in source.vertices];count=len(vertices)
    normal_sums=[Vector() for v in vertices]
    for p in source.polygons:
        for li in p.loop_indices:normal_sums[source.loops[li].vertex_index]+=source.corner_normals[li].vector
    inner=[v-n.normalized()*thickness for v,n in zip(vertices,normal_sums)]
    outer_faces=[list(p.vertices) for p in source.polygons]
    inner_faces=[[i+count for i in reversed(p)] for p in outer_faces]
    normals=[source.corner_normals[i].vector.copy() for p in source.polygons for i in p.loop_indices]
    normals += [-source.corner_normals[i].vector for p in source.polygons for i in reversed(p.loop_indices)]
    edges={}
    def key(v):return tuple(round(x,5) for x in vertices[v])
    for face in outer_faces:
        for a,b in zip(face,face[1:]+face[:1]):edges.setdefault(tuple(sorted((key(a),key(b)))),[]).append((a,b))
    rims=[]
    for occurrences in edges.values():
        if len(occurrences)!=1:continue
        a,b=occurrences[0];rims.append([b,a,a+count,b+count])
        normal=(vertices[a]-vertices[b]).cross(inner[a]-vertices[b]).normalized()
        normals.extend([normal]*4)
    mesh=bpy.data.meshes.new(source.name+'_sheet');mesh.from_pydata(vertices+inner,[],outer_faces+inner_faces+rims);mesh.update()
    for m in source.materials:mesh.materials.append(m)
    for p in mesh.polygons:p.use_smooth=True
    loops=[i for p in source.polygons for i in p.loop_indices]
    reverse_loops=[i for p in source.polygons for i in reversed(p.loop_indices)]
    for layer in source.uv_layers:
        uv=mesh.uv_layers.new(name=layer.name)
        for i,old in enumerate(loops+reverse_loops):uv.data[i].uv=layer.data[old].uv
    mesh.normals_split_custom_set(normals)
    obj.data=mesh


def inset_plate_pocket(obj, contour, floor):
    """Clip an exact opening, then construct deliberate bevel/floor edge loops.

    Original vertices keep their identities; this is important for the inward
    sheet's corner-normal averages at distant UV seams. No analytic bump normals.
    """
    source=obj.data;layers=list(source.uv_layers)
    vertices=[v.co.copy() for v in source.vertices];faces=[];normals=[];uv_values=[[] for _ in layers];mats=[]
    cut_cache={};border={}
    def cross(a,b,p):return (b[0]-a[0])*(p.z-a[1])-(b[1]-a[1])*(p.x-a[0])
    def key(p):return tuple(round(v,7) for v in p)
    def interpolate(a,b,t):
        return (a[0].lerp(b[0],t),a[1].lerp(b[1],t).normalized(),[u.lerp(v,t) for u,v in zip(a[2],b[2])],None)
    def split(poly,a,b):
        inside=[];outside=[]
        if not poly:return inside,outside
        prev=poly[-1];dp=cross(a,b,prev[0])
        for cur in poly:
            dc=cross(a,b,cur[0])
            if (dp>=0)!=(dc>=0):
                hit=interpolate(prev,cur,dp/(dp-dc));inside.append(hit);outside.append(hit)
            (inside if dc>=0 else outside).append(cur);prev=cur;dp=dc
        return inside,outside
    def index(record):
        p,n,u,old=record
        if old is not None:return old
        k=key(p)
        if k not in cut_cache:cut_cache[k]=len(vertices);vertices.append(p)
        return cut_cache[k]
    def add(poly,material):
        if len(poly)<3:return
        for j in range(1,len(poly)-1):
            tri=[poly[0],poly[j],poly[j+1]]
            if (tri[1][0]-tri[0][0]).cross(tri[2][0]-tri[0][0]).length_squared<1e-20:continue
            faces.append([index(r) for r in tri]);mats.append(material)
            for p,n,u,old in tri:
                normals.append(n)
                for values,uv in zip(uv_values,u):values.append(uv)
    for poly in source.polygons:
        records=[(source.vertices[source.loops[i].vertex_index].co.copy(),source.corner_normals[i].vector.copy(),
                  [layer.data[i].uv.copy() for layer in layers],source.loops[i].vertex_index) for i in poly.loop_indices]
        ps=[r[0] for r in records]
        if max(p.y for p in ps)<1.65 or min(p.x for p in ps)>.33 or max(p.x for p in ps)<-.33 or min(p.z for p in ps)>1.102 or max(p.z for p in ps)<.872:
            add(records,poly.material_index);continue
        remainder=records;outside=[]
        for a,b in zip(contour,contour[1:]+contour[:1]):
            remainder,piece=split(remainder,a,b)
            if piece:outside.append(piece)
            if not remainder:break
        for piece in outside:add(piece,poly.material_index)
        # Only the actual rounded opening, not the quarter's centre split, is
        # bevelled. The two half-pockets meet on the original symmetry plane.
        for record in remainder:
            p=record[0]
            if any(abs(cross(a,b,p))<1e-7 and min(a[0],b[0])-1e-6<=p.x<=max(a[0],b[0])+1e-6 and min(a[1],b[1])-1e-6<=p.z<=max(a[1],b[1])+1e-6 for a,b in zip(contour,contour[1:]+contour[:1])):
                border[key(p)]=record
    left=obj.name.endswith('_L')
    def angle(record):
        p=record[0];a=math.atan2(p.z-.987,p.x)
        return a+math.tau if left and a<0 else a
    boundary=sorted(border.values(),key=angle)
    if len(boundary)<10:raise RuntimeError(f'Incomplete pocket opening on {obj.name}')
    # Five tightly controlled profile loops. Outer custom normals are untouched;
    # inner bevel normals below come from these actual faces, not a height field.
    loops=[]
    for inset,depth in [(0,0),(.004,.002),(.011,.012),(.020,None),(.027,None)]:
        loop=[]
        for record in boundary:
            p,n,u,old=record
            gx=max(abs(p.x)-(.314-.027),0)*(1 if p.x>=0 else -1)
            gz=max(abs(p.z-.987)-(.109-.027),0)*(1 if p.z>=.987 else -1)
            outward=Vector((gx,0,gz))
            if outward.length<1e-8:
                outward=Vector((1 if p.x>=0 else -1,0,0)) if abs(p.x)/.314>abs(p.z-.987)/.109 else Vector((0,0,1 if p.z>=.987 else -1))
            outward.normalize();q=p-outward*inset
            # Centre endpoints must meet the other panel exactly.
            if abs(p.x)<.0001:q.x=p.x
            q.y=p.y-depth if depth is not None else floor+(.004 if inset==.020 else 0)
            ri=record if inset==0 else (q,n.copy(),[v.copy() for v in u],None)
            loop.append(index(ri))
        loops.append(loop)
    generated=[]
    for k in range(len(loops)-1):
        for j in range(len(boundary)-1):
            face=[loops[k][j],loops[k][j+1],loops[k+1][j+1],loops[k+1][j]]
            # +Y is the rear-facing side in Blender.
            if (vertices[face[1]]-vertices[face[0]]).cross(vertices[face[2]]-vertices[face[0]]).y<0:face.reverse()
            generated.append(face)
    centre=len(vertices);vertices.append(Vector((0,floor,.987)))
    for j in range(len(boundary)-1):
        face=[loops[-1][j],loops[-1][j+1],centre]
        if (vertices[face[1]]-vertices[face[0]]).cross(vertices[face[2]]-vertices[face[0]]).y<0:face.reverse()
        generated.append(face)
    averaged={}
    for face in generated:
        n=(vertices[face[1]]-vertices[face[0]]).cross(vertices[face[2]]-vertices[face[0]])
        for vi in face:averaged.setdefault(vi,Vector());averaged[vi]+=n
    original_border={index(record):record for record in boundary}
    for face in generated:
        records=[]
        for vi in face:
            p=vertices[vi]
            if vi in original_border:records.append(original_border[vi])
            else:
                normal=averaged[vi].normalized()
                records.append((p,normal,[Vector((p.x,p.z)) for _ in layers],vi))
        add(records,0)
    mesh=bpy.data.meshes.new(source.name+'_plate_pocket');mesh.from_pydata(vertices,[],faces);mesh.update()
    for material in source.materials:mesh.materials.append(material)
    for poly,mi in zip(mesh.polygons,mats):poly.use_smooth=True;poly.material_index=mi
    for layer,values in zip(layers,uv_values):
        uv=mesh.uv_layers.new(name=layer.name)
        for value,datum in zip(values,uv.data):datum.uv=value
    mesh.normals_split_custom_set(normals);obj.data=mesh


def coupe_rear_bodywork():
    """A manufactured plate pocket, with the existing outer silhouette retained."""
    panels=[o for o in bpy.context.scene.objects if o.type=='MESH' and
            (o.name.startswith('panel_rear_quarter_') or o.name.startswith('panel_bumper_rear'))]
    ps=[];faces=[]
    for obj in panels:
        at=len(ps);ps.extend([v.co.copy() for v in obj.data.vertices])
        faces.extend([tuple(at+i for i in poly.vertices) for poly in obj.data.polygons])
    bvh=BVHTree.FromPolygons(ps,faces)
    def surface(x,z):
        hit=bvh.ray_cast(Vector((x,3,z)),Vector((0,-1,0)),3)[0]
        if hit is None:raise RuntimeError(f'Rear surface missing at {x},{z}')
        return hit.y
    floor=surface(0,.987)-.058
    contour=[]
    for cx,cz,start in [(.287,.082,0),(-.287,.082,90),(-.287,-.082,180),(.287,-.082,270)]:
        for i in range(9):
            a=math.radians(start+i*90/8);contour.append((cx+.027*math.cos(a),.987+cz+.027*math.sin(a)))
    for obj in panels:
        if obj.name.startswith('panel_rear_quarter_'):inset_plate_pocket(obj,contour,floor)
    # The plate is fixed to the rear closure, above the detachable lower bumper.
    # Its bracket/backplate is real geometry added below, so a wreck cannot leave
    # a suspended plaque where the bumper used to be.
    plate=bpy.data.objects.get('License Plate')
    if plate is None:raise RuntimeError('Expected prepared unbranded license plate')
    bounds=[(min(v.co[i] for v in plate.data.vertices),max(v.co[i] for v in plate.data.vertices)) for i in range(3)]
    for v in plate.data.vertices:
        v.co.x=(v.co.x-(bounds[0][0]+bounds[0][1])*.5)*(.52/(bounds[0][1]-bounds[0][0]))
        v.co.y=floor+.009+(v.co.y-bounds[1][1])*.18
        v.co.z=.986+(v.co.z-(bounds[2][0]+bounds[2][1])*.5)*(.112/(bounds[2][1]-bounds[2][0]))
    return floor


def coupe_rear_hardware(plate_floor):
    """Fixed body mounts and exhaust remain behind the removable painted shell."""
    steel=bpy.data.materials['Structure galvanized steel'];iron=bpy.data.materials['Structure cast alloy']
    rubber=bpy.data.materials['Structure hoses'];heat=bpy.data.materials['Structure heat shield']
    for name in ['Structure exhaust','Structure exhaust.001']:
        for vertex in bpy.data.objects[name].data.vertices:
            vertex.co.y=min(vertex.co.y,1.43)
    # Backplate, two stamped reinforcement channels and plate mount fill the
    # former empty rear cavity without putting structure through intact paint.
    box('Structure rear closure backplate',(0,1.70,.87),(1.54,.025,.42),iron,.008)
    box('Structure rear bumper beam',(0,1.78,.64),(1.65,.075,.105),steel,.014)
    for side in [-1,1]:
        box('Structure rear crash mount',(side*.59,1.58,.63),(.13,.37,.12),steel,.010)
        box('Structure rear beam bracket',(side*.59,1.82,.64),(.21,.019,.155),iron,.004)
        for x in [side*.59-.071,side*.59+.071]:
            tube('Structure rear beam fastener',(x,1.833,.64),(x,1.847,.64),.012,steel,6)
        box('Structure rear closure vertical rib',(side*.48,1.723,.88),(.046,.028,.36),steel,.004)
    box('Structure plate mounting tray',(0,plate_floor-.008,.986),(.555,.021,.146),rubber,.012)
    for side in [-1,1]:
        box('Structure plate body bracket',(side*.20,(1.728+plate_floor)*.5,.986),(.03,plate_floor-1.728,.065),steel,.003)
        tube('Structure plate fastener',(side*.226,plate_floor+.010,1.022),(side*.226,plate_floor+.014,1.022),.005,steel,8)
    # Hollow rolled stainless outlets, placed below the existing valance so they
    # remain part of the fixed exhaust after the cosmetic bumper is lost.
    for side in [-1,1]:
        cx=side*.57;cz=.338;front=1.96;back=1.70;radius=.056;wall=.004
        verts=[];faces=[];n=24
        for y,r in [(back,radius),(front,radius),(front,radius-wall),(back,radius-wall)]:
            for j in range(n):
                a=j*math.tau/n;verts.append((cx+math.cos(a)*r,y,cz+math.sin(a)*r*.79))
        for row in range(3):
            for j in range(n):faces.append((row*n+j,row*n+(j+1)%n,(row+1)*n+(j+1)%n,(row+1)*n+j))
        mesh=bpy.data.meshes.new('Structure rolled exhaust outlet');mesh.from_pydata(verts,[],faces);mesh.update();mesh.materials.append(heat)
        obj=bpy.data.objects.new(mesh.name,mesh);bpy.context.collection.objects.link(obj)
        for p in mesh.polygons:p.use_smooth=True
        tube('Structure exhaust outlet dark throat',(cx,back,cz),(cx,back+.008,cz),radius-wall,rubber,24)
        routed_tube('Structure rear exhaust connection',[(side*.29,1.43,.29),(side*.40,1.57,.31),(cx,1.70,cz)],.042,heat,10)
    # Small optical separators are set into the existing lamp lens. They reuse
    # the concealed rubber material; lamp emission and original housings remain.
    lights=bpy.data.objects['BodyTaillights'];p=[v.co for v in lights.data.vertices]
    lamp=BVHTree.FromPolygons(p,[tuple(poly.vertices) for poly in lights.data.polygons])
    for side in [-1,1]:
        for i in range(7):
            x=side*(.292+i*.042);hits=[]
            for j in range(22):
                z=1.145+j*.002
                hit=lamp.ray_cast(Vector((x,2,z)),Vector((0,-1,0)),1)[0]
                if hit is not None:hits.append(hit)
            if len(hits)<5:continue
            a,b=hits[1],hits[-2]
            a.y+=.0015;b.y+=.0015
            tube('Structure taillamp optical separator',a,b,.0018,rubber,6)
    # Geometry-only plate lettering uses an existing alloy, so no image/material
    # or draw group is added. Readable from the rear (+Blender Y).
    bpy.ops.object.text_add(location=(0,plate_floor+.013,.986),rotation=(math.pi/2,0,math.pi))
    text=bpy.context.object;text.name='Structure fictional plate lettering';text.data.body='QI 237'
    text.data.align_x='CENTER';text.data.align_y='CENTER';text.data.size=.061;text.data.extrude=.0003;text.data.bevel_depth=0
    text.data.materials.append(steel);bpy.ops.object.convert(target='MESH')
    # Ensure every new fixed mesh matches the attributes expected by batching.
    for o in list(bpy.context.scene.objects):
        if o.type!='MESH' or not o.name.startswith('Structure'):continue
        bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
        bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
        if not o.data.uv_layers:
            uv=o.data.uv_layers.new(name='UVMap')
            for loop in o.data.loops:
                p=o.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(p.x,p.y+p.z)

for kind in selected_kinds:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'source/models'/f'{kind}.blend'))
    obsolete_engine=bpy.data.objects.get('Engine')
    if obsolete_engine is None:raise RuntimeError('Prepared source no longer contains expected obsolete Engine mesh')
    bpy.data.objects.remove(obsolete_engine,do_unlink=True)
    for o in list(bpy.context.scene.objects):
        if o.type!='MESH':continue
        if 'Gasket' in o.name and o.name.startswith('glass_'):o.name=o.name.replace('glass_','seal_')
        if o.name=='panel_BodyRearwindow':o.name='glass_BodyRearwindow'
        ratio=.07 if 'Wipers' in o.name and 'Base' not in o.name else .36 if 'Rim' in o.name else .22 if 'BrakePad' in o.name else .5 if 'SeatsFrame' in o.name else 1
        if ratio<1:
            bpy.context.view_layer.objects.active=o
            dec=o.modifiers.new('Remove subpixel detail','DECIMATE');dec.ratio=ratio
            bpy.ops.object.modifier_apply(modifier=dec.name)
    hood=bpy.data.objects.get('panel_hood')
    partition(hood,lambda c:'panel_bumper_front' if c.z<.66 else 'panel_hood' if abs(c.x)<.72 else 'panel_front_fender_'+('L' if c.x<0 else 'R'))
    rear=bpy.data.objects.get('panel_bumper_rear')
    partition(rear,lambda c:'panel_bumper_rear' if c.z<.83 else 'panel_rear_quarter_'+('L' if c.x<0 else 'R'))
    rear_plate_floor=coupe_rear_bodywork() if kind=='coupe' else None
    for o in list(bpy.context.scene.objects):
        if o.type!='MESH' or not o.name.startswith('panel_'):continue
        if not any(m and m.name.startswith('paint') for m in o.data.materials):continue
        if not any(s in o.name for s in ['hood','bumper','Color1','RoofPanel','fender','quarter']):continue
        sheet_shell(o)
    # Permanent parts are batched into the same four material groups at runtime.
    front_structure(kind)
    if kind=='coupe':coupe_rear_hardware(rear_plate_floor)
    out=ROOT/'source/models-refined';out.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/f'{kind}.blend'))
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models'/f'{kind}.glb'),export_format='GLB',export_apply=True,export_yup=True)
    print('REFINED',kind,flush=True)

for relative, expected in preserved_hashes.items():
    if hashlib.sha256((ROOT/relative).read_bytes()).hexdigest() != expected:
        raise RuntimeError(f'Unselected car was unexpectedly modified: {relative}')

record={
    'source':'KhronosGroup/glTF-Sample-Assets CarConcept, CC-BY-4.0; see public/licenses/CarConcept-LICENSE.md',
    'prepared_by':'tools/refine_cars.py after tools/prepare_concept.py',
    'focused_export':'blender --background --python tools/refine_cars.py -- --kind coupe; unselected GLB and refined Blender hashes are verified unchanged',
    'editable_files':'source/models-refined/*.blend',
    'changes':[
        'Split hood, fenders, front and rear bumpers and rear quarters into independently damageable panels',
        'Add 1.2mm inner sheet and boundary rims while preserving original exterior corner normals and UVs',
        'Replace inherited Engine cuboid with recessed engine bay, thin radiator core and fins, bowed bumper beam, hollow crash rails, mounting plates and fasteners',
        'Route continuous cooling hoses, intake runners and wiring; add battery connections, coolant cap, strut braces and underfloor exhaust',
        'Scale original crash assembly for each prepared wheelbase, width and height; reuse the same four material groups without new textures',
        'Reduce hidden wiper, rim, brake-pad and seat-frame density',
        'Repair window gasket and rear-glass classification'
    ],
    'coupe_only_changes':[
        'Construct a rounded rear license-plate recess with explicit clipped opening, bevel loops and flat pocket floor; retain untouched exterior normals and vertex identities',
        'Raise and widen the existing unbranded plate into the pocket with body-mounted tray, brackets, fasteners and geometry-only fictional lettering',
        'Add concealed rear closure backplate, reinforcement ribs, bumper beam and crash mounts',
        'Add hollow rolled exhaust outlets with routed connections, shortening inherited exhaust ends to eliminate duplicate visible stubs',
        'Add small optical separators inside the existing rear lamps; reuse existing Structure materials and all embedded images',
        'Preserve original lower bumper and its detach ID, wheel pivots, glass and forward panel geometry; no global normal or UV changes'
    ],'files':[], 'editable_file_records':[]
}
for kind in CAR_KINDS:
    path=ROOT/'public/models'/f'{kind}.glb';data=path.read_bytes();length=struct.unpack_from('<I',data,12)[0];gltf=json.loads(data[20:20+length])
    record['files'].append({'path':f'public/models/{kind}.glb','sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),
      'triangles':sum(gltf['accessors'][p['indices']]['count']//3 for mesh in gltf['meshes'] for p in mesh['primitives'])})
    editable=ROOT/'source/models-refined'/f'{kind}.blend';editable_data=editable.read_bytes()
    record['editable_file_records'].append({'path':f'source/models-refined/{kind}.blend','sha256':hashlib.sha256(editable_data).hexdigest(),'bytes':len(editable_data)})
(ROOT/'source/vehicle-refinement-manifest.json').write_text(json.dumps(record,indent=2))
# Keep the shared model inventory current without touching scenery provenance.
inventory_path=ROOT/'source/model-manifest.json'
if inventory_path.exists():
    inventory=json.loads(inventory_path.read_text());by_path={r['path']:r for r in record['files']}
    for item in inventory:
        if item['file'] in by_path:
            current=by_path[item['file']];item['bytes']=current['bytes'];item['sha256']=current['sha256']
    inventory_path.write_text(json.dumps(inventory,indent=2)+'\n')
