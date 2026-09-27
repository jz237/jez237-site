"""Refine licensed Car Concept derivatives for close inspection and wrecks.

Run after prepare_concept.py. Keeps the source artist's silhouette and credit,
adds real sheet-metal edges, split crash panels and an exposed engine bay.
The untouched first preparation remains in source/models/; refined editable
files are saved separately. Dimensions below use Blender Z-up coordinates.
"""
import bpy, pathlib, math, json, struct, hashlib
from mathutils import Vector
ROOT = pathlib.Path(__file__).resolve().parents[1]

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

for kind in ['coupe','sedan','hatch']:
    bpy.ops.wm.open_mainfile(filepath=str(ROOT/'source/models'/f'{kind}.blend'))
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
    for o in list(bpy.context.scene.objects):
        if o.type!='MESH' or not o.name.startswith('panel_'):continue
        if not any(m and m.name.startswith('paint') for m in o.data.materials):continue
        if not any(s in o.name for s in ['hood','bumper','Color1','RoofPanel','fender','quarter']):continue
        sheet_shell(o)
    # Permanent parts are batched by material in the browser. They remain visible
    # through detached bodywork and during rollover inspection.
    steel=material('Structure galvanized steel',(.21,.24,.25),.83,.38)
    iron=material('Structure cast alloy',(.15,.17,.18),.7,.46)
    rubber=material('Structure hoses',(.014,.018,.020),.05,.84)
    heat=material('Structure heat shield',(.46,.44,.38),.84,.33)
    for side in [-1,1]:
        box('Structure crash rail',(side*.57,-1.46,.51),(.12,.94,.14),steel)
        box('Structure inner wheelhouse',(side*.79,-1.36,.73),(.1,.58,.4),iron)
        tube('Structure strut brace',(side*.75,-1.21,.84),(0,-.85,.87),.028,steel)
        tube('Structure exhaust',(side*.29,.0,.28),(side*.29,1.73,.31),.047,heat)
    box('Structure bumper beam',(0,-1.91,.61),(1.35,.095,.12),steel)
    box('Structure radiator',(0,-1.86,.73),(1.15,.045,.27),iron)
    for i in range(25):box('Structure radiator cooling fin',(-.54+i*.045,-1.887,.73),(.012,.018,.25),steel,.002)
    box('Structure engine block',(0,-1.47,.67),(.76,.56,.30),iron)
    box('Structure engine cover',(0,-1.48,.85),(.68,.52,.055),rubber)
    for side in [-1,1]:
        for i in range(4):tube('Structure intake runner',(side*.11,-1.66+i*.12,.82),(side*.46,-1.66+i*.12,.73),.036,iron)
    for i in range(5):box('Structure cover rib',(-.22+i*.11,-1.48,.884),(.025,.39,.012),steel,.004)
    box('Structure battery',(.62,-1.83,.71),(.22,.23,.22),rubber)
    box('Structure coolant reservoir',(-.62,-1.77,.76),(.19,.24,.18),heat)
    tube('Structure upper cooling hose',(-.33,-1.55,.82),(-.58,-1.95,.85),.04,rubber)
    # Apply object transforms once so shader wear and deformation share coordinates.
    for o in list(bpy.context.scene.objects):
        if o.type=='MESH' and o.name.startswith('Structure'):
            bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.context.view_layer.objects.active=o
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    out=ROOT/'source/models-refined';out.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/f'{kind}.blend'))
    bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models'/f'{kind}.glb'),export_format='GLB',export_apply=True,export_yup=True)
    print('REFINED',kind,flush=True)

record={
    'source':'KhronosGroup/glTF-Sample-Assets CarConcept, CC-BY-4.0; see public/licenses/CarConcept-LICENSE.md',
    'prepared_by':'tools/refine_cars.py after tools/prepare_concept.py',
    'editable_files':'source/models-refined/*.blend',
    'changes':[
        'Split hood, fenders, front and rear bumpers and rear quarters into independently damageable panels',
        'Add 1.2mm inner sheet and boundary rims while preserving original exterior corner normals and UVs',
        'Add engine bay, radiator fins, hoses, crash rails, strut braces and underfloor exhaust',
        'Reduce hidden wiper, rim, brake-pad and seat-frame density',
        'Repair window gasket and rear-glass classification'
    ],'files':[]
}
for kind in ['coupe','sedan','hatch']:
    path=ROOT/'public/models'/f'{kind}.glb';data=path.read_bytes();length=struct.unpack_from('<I',data,12)[0];gltf=json.loads(data[20:20+length])
    record['files'].append({'path':f'public/models/{kind}.glb','sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),
      'triangles':sum(gltf['accessors'][p['indices']]['count']//3 for mesh in gltf['meshes'] for p in mesh['primitives'])})
(ROOT/'source/vehicle-refinement-manifest.json').write_text(json.dumps(record,indent=2))
