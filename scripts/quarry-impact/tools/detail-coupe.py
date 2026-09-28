"""Detail the retained CC-BY CarConcept derivative. Blender 5.2, no downloads.

Input: source/models-refined/coupe.blend. Output: models/coupe.glb and a separate
editable scene. The sedan/hatch and original refined coupe are never overwritten.
"""
import bpy, math, pathlib, json, hashlib, struct, ast
from mathutils import Vector
from mathutils.bvhtree import BVHTree

ROOT = pathlib.Path(__file__).resolve().parents[1]
source = ROOT/'source/models-refined/coupe.blend'
protected = [source, ROOT/'public/models/sedan.glb', ROOT/'public/models/hatch.glb']
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
before = {str(p.relative_to(ROOT)): sha(p) for p in protected}
bpy.ops.wm.open_mainfile(filepath=str(source))
original_objects=set(bpy.context.scene.objects)
# Reuse only the authoring helper definitions, never its top-level export loop.
tree = ast.parse((ROOT/'tools/refine_cars.py').read_text())
helpers = ast.Module(body=[n for n in tree.body if isinstance(n, ast.FunctionDef)
                          and n.name in ('box', 'tube', 'routed_tube', 'partition')], type_ignores=[])
exec(compile(helpers, 'refine_cars_helpers', 'exec'))
rubber = bpy.data.materials['Structure hoses']
alloy = bpy.data.materials['Structure galvanized steel']
iron = bpy.data.materials['Structure cast alloy']

def mesh_object(name, vertices, faces, mat):
    mesh = bpy.data.meshes.new(name); mesh.from_pydata(vertices, [], faces); mesh.update()
    mesh.materials.append(mat)
    obj = bpy.data.objects.new(name, mesh); bpy.context.collection.objects.link(obj)
    for p in mesh.polygons: p.use_smooth = True
    return obj

def bvh(obj):
    return BVHTree.FromPolygons([v.co for v in obj.data.vertices], [tuple(p.vertices) for p in obj.data.polygons])

def cut_intake(obj, contour):
    """Clip only the intake opening, interpolating existing UV/corner normals.

    This is a real opening through both skins. Unaffected triangles keep their
    corner data. The recessed surround and visible cooler sit behind it.
    """
    src=obj.data; layers=list(src.uv_layers); verts=[]; faces=[]; normals=[]; uvs=[[] for _ in layers]
    def side(a,b,p): return (b[0]-a[0])*(p.z-a[1])-(b[1]-a[1])*(p.x-a[0])
    def split(records,a,b):
        inside=[];outside=[]
        for prev,cur in zip(records[-1:]+records[:-1],records):
            d0,d1=side(a,b,prev[0]),side(a,b,cur[0])
            if (d0>=0)!=(d1>=0):
                t=d0/(d0-d1); hit=(prev[0].lerp(cur[0],t),prev[1].lerp(cur[1],t).normalized(),[u.lerp(v,t)for u,v in zip(prev[2],cur[2])])
                inside.append(hit);outside.append(hit)
            (inside if d1>=0 else outside).append(cur)
        return inside,outside
    def add(poly):
        for j in range(1,len(poly)-1):
            tri=[poly[0],poly[j],poly[j+1]]
            if (tri[1][0]-tri[0][0]).cross(tri[2][0]-tri[0][0]).length_squared<1e-20:continue
            faces.append(tuple(range(len(verts),len(verts)+3)))
            for p,n,uv in tri:
                verts.append(p);normals.append(n)
                for values,v in zip(uvs,uv):values.append(v)
    for poly in src.polygons:
        records=[(src.vertices[src.loops[i].vertex_index].co.copy(),src.corner_normals[i].vector.copy(),[layer.data[i].uv.copy()for layer in layers])for i in poly.loop_indices]
        if min(v[0].y for v in records)>-1.85: add(records);continue
        rest=records
        for a,b in zip(contour,contour[1:]+contour[:1]):
            if not rest:break
            rest,outside=split(rest,a,b);add(outside)
    mesh=bpy.data.meshes.new('Coupe intake clipped sheet');mesh.from_pydata(verts,[],faces);mesh.update()
    for m in src.materials:mesh.materials.append(m)
    for poly in mesh.polygons:poly.use_smooth=True
    for layer,values in zip(layers,uvs):
        uv=mesh.uv_layers.new(name=layer.name)
        for record,value in zip(uv.data,values):record.uv=value
    mesh.normals_split_custom_set(normals);obj.data=mesh

bumper=bpy.data.objects['panel_bumper_front']; surface=bvh(bumper)
contour=[(-.65,.49),(.65,.49),(.565,.65),(-.565,.65)]
outline=[]
for a,b in zip(contour,contour[1:]+contour[:1]):
    for j in range(12):
        t=j/12;x=a[0]*(1-t)+b[0]*t;z=a[1]*(1-t)+b[1]*t
        hit=surface.ray_cast(Vector((x,-4,z)),Vector((0,1,0)),4)[0]
        if hit is None:raise RuntimeError(f'Intake contour leaves original bumper at {x}, {z}')
        outline.append(hit)
intake_surface=surface
cut_intake(bumper,contour)
vertices=[];faces=[]
for depth,scale in [(0,1),(.013,.978),(.10,.93)]:
    for p in outline:vertices.append((p.x*scale,p.y+depth-.001,.57+(p.z-.57)*scale))
n=len(outline)
for row in range(2):
    for i in range(n):faces.append((row*n+i,row*n+(i+1)%n,(row+1)*n+(i+1)%n,(row+1)*n+i))
mesh_object('panel_bumper_intake_surround',vertices,faces,rubber)
# Recessed honeycomb with physical open cells; behind it are the existing cooling
# core and crash structure. Horizontal guards reduce grille density at distance.
grille_objects=set(bpy.context.scene.objects)
for row in range(3):
    for col in range(23):
        x=-.57+col*.051+(row%2)*.0255;z=.515+row*.050
        if abs(x)>.59-(z-.42)*.25:continue
        pts=[]
        for j in range(7):
            px=x+math.cos(j*math.tau/6)*.026;pz=z+math.sin(j*math.tau/6)*.026
            hit=intake_surface.ray_cast(Vector((px,-4,pz)),Vector((0,1,0)),4)[0]
            pts.append((px,hit.y+.038 if hit is not None else -2.22,pz))
        routed_tube('Structure intake honeycomb',pts,.0032,iron,4)
for x in [-.5,0,.5]:box('Structure intake mount',(x,-2.10,.57),(.012,.07,.12),iron,.002)
# The grille buckles and releases with the front assembly.
bpy.ops.object.select_all(action='DESELECT')
for obj in sorted(set(bpy.context.scene.objects)-grille_objects,key=lambda o:o.name):obj.select_set(True);bpy.context.view_layer.objects.active=obj
bpy.ops.object.join();bpy.context.object.name='panel_bumper_grille'

# Each light is now an independent damageable lens. Subdivision supplies enough
# vertices for a local strike rather than switching both lamps off together.
for name,role in [('BodyHeadlights','head'),('BodyTaillights','tail')]:
    partition(bpy.data.objects[name],lambda c:'panel_lamp_'+role+'_'+('L'if c.x<0 else'R'))
    for obj in [o for o in bpy.context.scene.objects if o.name.startswith('panel_lamp_'+role)]:
        bpy.context.view_layer.objects.active=obj
        mod=obj.modifiers.new('Local lens fracture support','SUBSURF');mod.subdivision_type='SIMPLE';mod.levels=2
        bpy.ops.object.modifier_apply(modifier=mod.name)

# Projector dividers, rubber end caps and a slim machined lower edge fitted to
# the original lamp surface; these do not turn the lamp into a glowing slab.
for obj in [o for o in bpy.context.scene.objects if o.name.startswith('panel_lamp_head')]:
    surf=bvh(obj);side=-1 if obj.name.endswith('L')else 1
    for j in range(9):
        x=side*(.37+j*.043);hits=[]
        for k in range(30):
            hit=surf.ray_cast(Vector((x,-3,.812+k*.0024)),Vector((0,1,0)),2)[0]
            if hit is not None:hits.append(hit)
        if len(hits)>5:
            a,b=hits[1],hits[-2];a.y-=.001;b.y-=.001
            tube('Structure headlamp optical divider',a,b,.0016,rubber,6)

# Brake hardware and embossed sidewall markings use the actual wheel pivots and
# are parented with their world transforms preserved. No suspension change.
for wheel in [o for o in bpy.context.scene.objects if o.name.startswith('wheel_')]:
    center=wheel.matrix_world.translation.copy();side=1 if center.x>0 else-1
    added=[]
    for j in range(5):
        a=j*math.tau/5; y=center.y+math.sin(a)*.062;z=center.z+math.cos(a)*.062
        added.append(tube('Detail wheel lug',(center.x+side*.115,y,z),(center.x+side*.121,y,z),.008,iron,6))
    # Two concentric molded ribs give the tire a manufactured shoulder.
    for radius in [.321,.350]:
        pts=[(center.x+side*.148,center.y+math.sin(j*math.tau/64)*radius,center.z+math.cos(j*math.tau/64)*radius)for j in range(65)]
        added.append(routed_tube('Detail tire molded rib',pts,.0016,rubber,4))
    for j in range(12):
        a=j*math.tau/12;radius=.181
        # Dark countersunk drill dimples on the disc, behind the spokes.
        y=center.y+math.sin(a)*radius;z=center.z+math.cos(a)*radius
        added.append(tube('Detail drilled brake disc',(center.x+side*.006,y,z),(center.x+side*.008,y,z),.007,rubber,8))
    for obj in added:
        matrix=obj.matrix_world.copy();obj.parent=wheel;obj.matrix_world=matrix

# Neutral stitched cabin details improve visibility through the clearer glazing.
for side in [-1,1]:
    routed_tube('Structure seat piping',[(side*.46,.08,.70),(side*.48,.17,1.06),(side*.45,.39,1.17)],.004,rubber,6)

# New geometry matches production batching attributes. Preserve all original
# custom normals and UV layers; only new meshes receive planar UVs.
for obj in list(bpy.context.scene.objects):
    if obj.type!='MESH' or obj.data.uv_layers or obj in original_objects:continue
    uv=obj.data.uv_layers.new(name='UVMap')
    for loop in obj.data.loops:
        p=obj.data.vertices[loop.vertex_index].co;uv.data[loop.index].uv=(p.x,p.y+p.z)
out=ROOT/'source/models-detailed';out.mkdir(exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out/'coupe.blend'))
glb=ROOT/'public/models/coupe.glb'
bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',export_apply=True,export_yup=True)
for p in protected:
    if sha(p)!=before[str(p.relative_to(ROOT))]:raise RuntimeError('Protected original changed')
data=glb.read_bytes();gltf=json.loads(data[20:20+struct.unpack_from('<I',data,12)[0]])
record={'source':'CarConcept CC-BY-4.0, original artist attribution retained in public/licenses/CarConcept-LICENSE.md',
        'generator':'tools/detail-coupe.py','input':before,'changes':['Real clipped lower intake, recessed surround and open honeycomb','Four separately deformable lamp lenses with fitted optical divisions','Wheel-attached lug bolts, molded tire ribs and drilled brake details','Cabin piping; original silhouette, wheel pivots and glass geometry retained'],
        'files':[{'path':str(p.relative_to(ROOT)).replace('\\','/'),'bytes':p.stat().st_size,'sha256':sha(p)}for p in [glb,out/'coupe.blend']],
        'triangles':sum(gltf['accessors'][p['indices']]['count']//3 for m in gltf['meshes']for p in m['primitives'])}
(ROOT/'source/coupe-detail-manifest.json').write_text(json.dumps(record,indent=2)+'\n')
for name,key in [('source/model-manifest.json','file'),('source/vehicle-refinement-manifest.json','path')]:
    path=ROOT/name;manifest=json.loads(path.read_text());items=manifest if isinstance(manifest,list)else manifest['files']
    for item in items:
        if item.get(key)=='public/models/coupe.glb':
            item.update(sha256=sha(glb),bytes=len(data))
            if 'triangles'in item:item['triangles']=record['triangles']
            item['detail_manifest']='source/coupe-detail-manifest.json'
    path.write_text(json.dumps(manifest,indent=2)+'\n')
print('COUPE_DETAILS',json.dumps(record),flush=True)
