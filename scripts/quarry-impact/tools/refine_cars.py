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

for kind in ['coupe','sedan','hatch']:
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
    for o in list(bpy.context.scene.objects):
        if o.type!='MESH' or not o.name.startswith('panel_'):continue
        if not any(m and m.name.startswith('paint') for m in o.data.materials):continue
        if not any(s in o.name for s in ['hood','bumper','Color1','RoofPanel','fender','quarter']):continue
        sheet_shell(o)
    # Permanent parts are batched into the same four material groups at runtime.
    front_structure(kind)
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
        'Replace inherited Engine cuboid with recessed engine bay, thin radiator core and fins, bowed bumper beam, hollow crash rails, mounting plates and fasteners',
        'Route continuous cooling hoses, intake runners and wiring; add battery connections, coolant cap, strut braces and underfloor exhaust',
        'Scale original crash assembly for each prepared wheelbase, width and height; reuse the same four material groups without new textures',
        'Reduce hidden wiper, rim, brake-pad and seat-frame density',
        'Repair window gasket and rear-glass classification'
    ],'files':[]
}
for kind in ['coupe','sedan','hatch']:
    path=ROOT/'public/models'/f'{kind}.glb';data=path.read_bytes();length=struct.unpack_from('<I',data,12)[0];gltf=json.loads(data[20:20+length])
    record['files'].append({'path':f'public/models/{kind}.glb','sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),
      'triangles':sum(gltf['accessors'][p['indices']]['count']//3 for mesh in gltf['meshes'] for p in mesh['primitives'])})
(ROOT/'source/vehicle-refinement-manifest.json').write_text(json.dumps(record,indent=2))
# Keep the shared model inventory current without touching scenery provenance.
inventory_path=ROOT/'source/model-manifest.json'
if inventory_path.exists():
    inventory=json.loads(inventory_path.read_text());by_path={r['path']:r for r in record['files']}
    for item in inventory:
        if item['file'] in by_path:
            current=by_path[item['file']];item['bytes']=current['bytes'];item['sha256']=current['sha256']
    inventory_path.write_text(json.dumps(inventory,indent=2)+'\n')
