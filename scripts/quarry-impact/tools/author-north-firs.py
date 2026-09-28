"""Blender export for complete-needle mature-fir LODs.

Run prepare-north-fir-geometry.py first. No source image is embedded in runtime
GLBs; the loader shares existing maps and the explicitly listed new bark maps.
"""
import bpy
import hashlib
import json
import shutil
from pathlib import Path
import numpy as np
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'outputs/forest-edge/authoring'
reports = json.loads((DATA / 'preparation.json').read_text())
manifest = {'source': 'https://polyhaven.com/a/fir_tree_01', 'license': 'CC0-1.0',
    'generator': 'tools/prepare-north-fir-geometry.py + tools/author-north-firs.py',
    'convention': 'glTF Y up; root baseline0; source height normalized1; original glTF UV/flipY=false',
    'modifications': 'Complete needle sampling with documented cross-section compensation; woody simplification; original A/B trunk maps and repeating UVs retained. Official C trunk has no UV attribute, so only C receives documented cylindrical bark coordinates. No whole-tree billboard replacement.',
    'compression': {'format': 'KHR_draco_mesh_compression', 'positionBits': 18, 'normalBits': 10, 'uvBits': 14,
        'cpuDecoder': 'tools/decode-north-draco.mjs', 'proxyPreparation': 'tools/fit-north-fir-proxies.py'},
    'variants': [], 'runtimeFiles': [], 'optionalRuntimeFiles': [], 'authoringFiles': []}

def mesh_object(name, points, normals, uv, material):
    # Weld only positions; loop UVs and custom split normals preserve every
    # original source seam while allowing woody topology to simplify coherently.
    points = np.asarray(points, dtype=np.float32)
    unique, index = np.unique(points, axis=0, return_inverse=True)
    vertex = unique[:, [0, 2, 1]].copy(); vertex[:, 1] *= -1
    loop_normals = normals[:, [0, 2, 1]].copy(); loop_normals[:, 1] *= -1
    mesh = bpy.data.meshes.new(name)
    mesh.vertices.add(len(vertex)); mesh.vertices.foreach_set('co', vertex.ravel())
    mesh.loops.add(len(index)); mesh.loops.foreach_set('vertex_index', index.astype(np.int32))
    mesh.polygons.add(len(index) // 3)
    mesh.polygons.foreach_set('loop_start', np.arange(len(index) // 3, dtype=np.int32) * 3)
    mesh.polygons.foreach_set('loop_total', np.full(len(index) // 3, 3, dtype=np.int32))
    mesh.polygons.foreach_set('use_smooth', np.ones(len(index) // 3, dtype=bool))
    layer = mesh.uv_layers.new(name='UVMap'); values = uv.copy(); values[:, 1] = 1 - values[:, 1]
    layer.data.foreach_set('uv', values.ravel())
    mesh.update(); mesh.normals_split_custom_set(loop_normals.tolist())
    obj = bpy.data.objects.new(name, mesh); bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    return obj

def simplify(obj, budget, preserve_stem=False):
    triangles = len(obj.data.polygons)
    if triangles <= budget: return
    modifier = obj.modifiers.new('Simplify woody structure only', 'DECIMATE')
    modifier.ratio = budget / triangles; modifier.use_collapse_triangulate = True
    if preserve_stem:
        group = obj.vertex_groups.new(name='Protect lower photographed stem')
        ids = [v.index for v in obj.data.vertices if v.co.z < .16]
        group.add(ids, 1, 'REPLACE'); modifier.vertex_group = group.name
        modifier.vertex_group_factor = 1000
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=modifier.name)

def placeholder(name):
    mat = bpy.data.materials.new(name); mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (.25, .3, .18, 1)
    bsdf.inputs['Roughness'].default_value = .95
    return mat

def preview_material(name, color, normal, arm, transform=False):
    mat = placeholder(name); nodes = mat.node_tree.nodes; links = mat.node_tree.links
    bsdf = nodes.get('Principled BSDF'); coords = nodes.new('ShaderNodeTexCoord')
    source = coords.outputs['UV']
    if transform:
        mapping = nodes.new('ShaderNodeMapping'); mapping.inputs['Scale'].default_value = (1.2000000476837158, .09999993443489075, 1)
        # Blender's V is the inverse of source glTF V.
        mapping.inputs['Location'].default_value = (0, 0, 0)
        links.new(source, mapping.inputs['Vector']); source = mapping.outputs['Vector']
    color_node = nodes.new('ShaderNodeTexImage'); color_node.image = bpy.data.images.load(str(color), check_existing=True)
    links.new(source, color_node.inputs['Vector']); links.new(color_node.outputs['Color'], bsdf.inputs['Base Color'])
    normal_node = nodes.new('ShaderNodeTexImage'); normal_node.image = bpy.data.images.load(str(normal), check_existing=True)
    normal_node.image.colorspace_settings.name = 'Non-Color'
    normal_map = nodes.new('ShaderNodeNormalMap'); normal_map.inputs['Strength'].default_value = .6
    links.new(source, normal_node.inputs['Vector']); links.new(normal_node.outputs['Color'], normal_map.inputs['Color']); links.new(normal_map.outputs['Normal'], bsdf.inputs['Normal'])
    bsdf.inputs['Roughness'].default_value = .92
    return mat

for variant in range(3):
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    materials = [placeholder('NorthWood'), placeholder('NorthNeedles'), placeholder('NorthTrunk')]
    wood = np.load(DATA / f'fir-{variant}-wood.npz')
    groups = []
    lod_stats = []
    for level in ['near', 'far']:
        parent = bpy.data.objects.new(f'NorthFir_{variant}_{level}', None); bpy.context.collection.objects.link(parent)
        parts = []
        # Retain the same small branch-cylinder topology in both levels.
        # Stronger collapse flattened narrow dead branches into broad wedges.
        for part, material_index, near_budget, far_budget in [('Wood', 0, 100000, 100000), ('Twigs', 1, 15000, 4500), ('Trunk', 2, 100000, 24000)]:
            selection = wood['material'] == material_index
            obj = mesh_object(f'NorthFir_{variant}_{level}_{part}', wood['p'][selection], wood['n'][selection], wood['uv'][selection], materials[material_index])
            simplify(obj, near_budget if level == 'near' else far_budget, part == 'Trunk')
            parts.append(obj)
        needles = np.load(DATA / f'fir-{variant}-{level}.npz')
        leaves = mesh_object(f'NorthFir_{variant}_{level}_Needles', needles['p'], needles['n'], needles['uv'], materials[1])
        bpy.ops.object.select_all(action='DESELECT'); leaves.select_set(True); parts[1].select_set(True)
        bpy.context.view_layer.objects.active = leaves; bpy.ops.object.join()
        parts = [parts[0], leaves, parts[2]]
        for obj in parts: obj.parent = parent
        groups.append(parent)
        coords = np.concatenate([np.array([tuple(v.co) for v in obj.data.vertices])[:, [0, 2, 1]] * [1, 1, -1] for obj in parts])
        lod_stats.append({'level': level, 'triangles': sum(len(o.data.polygons) for o in parts),
            'bounds': [coords.min(axis=0).tolist(), coords.max(axis=0).tolist()], 'meshes': [o.name for o in parts]})
    output = ROOT / f'public/models/quarry-north-fir-{variant}.glb'
    bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB', export_apply=False,
        export_materials='EXPORT', export_extras=True, export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=6, export_draco_position_quantization=18,
        export_draco_normal_quantization=10, export_draco_texcoord_quantization=14)
    manifest['runtimeFiles'].append({'file': 'models/' + output.name, 'bytes': output.stat().st_size,
        'sha256': hashlib.sha256(output.read_bytes()).hexdigest()})
    entry = {**reports[variant], 'runtimeFile': 'models/' + output.name, 'geometry': lod_stats}
    entry['authoringVertexBandRadiusEstimate'] = entry.pop('normalizedStemRadius')
    entry['proxySource'] = 'source/models/quarry-north-fir-proxies.json; fitted after export from actual Trunk sections'
    manifest['variants'].append(entry)
    source = ROOT / 'source/reference/fir_sapling_medium/textures'
    wood_preview = preview_material('Preview wood', source / 'fir_sapling_medium_branches_diff_2k.jpg', source / 'fir_sapling_medium_branches_nor_gl_2k.jpg', None, True)
    leaf_preview = preview_material('Preview foliage', ROOT / 'public/assets/north_fir_twig_diff.jpg', source / 'fir_sapling_medium_twigs_nor_gl_2k.jpg', None)
    trunk_preview = wood_preview if variant == 2 else preview_material('Preview photographed trunk', ROOT / f'public/assets/north_fir_trunk_{"ab"[variant]}_diff.jpg', ROOT / f'public/assets/north_fir_trunk_{"ab"[variant]}_nor_gl.jpg', None)
    for obj in [c for g in groups for c in g.children]:
        name = obj.data.materials[0].name
        obj.data.materials[0] = leaf_preview if name.startswith('NorthNeedles') else trunk_preview if name.startswith('NorthTrunk') else wood_preview
    source_path = ROOT / f'source/models/quarry-north-fir-{variant}.blend'
    for image in bpy.data.images:
        if image.filepath:
            image.filepath = bpy.path.relpath(image.filepath, start=str(source_path.parent))
    bpy.ops.wm.save_as_mainfile(filepath=str(source_path), compress=True)
    manifest['authoringFiles'].append({'file': str(source_path.relative_to(ROOT)).replace('\\', '/'),
        'bytes': source_path.stat().st_size, 'sha256': hashlib.sha256(source_path.read_bytes()).hexdigest(),
        'distribution': 'Local editable source, omitted from static delivery because it exceeds25MiB; reproducible with tracked tools and restored CC0 source'})
    scene = bpy.context.scene; scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 1600; scene.render.resolution_y = 1000; scene.render.resolution_percentage = 100
    scene.world.use_nodes = True; scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (.4, .45, .5, 1)
    scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = .35
    groups[0].location.x = -.6; groups[1].location.x = .6
    bpy.ops.object.light_add(type='SUN', location=(-2, -3, 4)); sun = bpy.context.object
    sun.data.energy = 2.2; sun.rotation_euler = Vector((2, 3, -4)).to_track_quat('-Z', 'Y').to_euler()
    bpy.ops.mesh.primitive_plane_add(size=8, location=(0, 0, -.004))
    ground = placeholder('Preview ground'); ground.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (.16, .17, .14, 1)
    bpy.context.object.data.materials.append(ground)
    bpy.ops.object.camera_add(location=(0, -3, .57)); camera = bpy.context.object
    camera.rotation_euler = (Vector((0, 0, .55)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    camera.data.type = 'ORTHO'; camera.data.ortho_scale = 2.0; scene.camera = camera
    scene.render.filepath = str(DATA / f'fir-{variant}-comparison.png')
    bpy.ops.render.render(write_still=True)
    sample = reports[variant]['lods'][0]
    shutil.copyfile(scene.render.filepath, DATA / f'fir-{variant}-{sample["completeNeedles"]}-needles-{sample["crossSectionScale"]}x.png')
    print('NORTH_FIR_VARIANT', variant, json.dumps(entry), flush=True)

for file in ['north_fir_twig_diff.jpg'] + [f'north_fir_trunk_{v}_{kind}.jpg' for v in ['a', 'b'] for kind in ['diff', 'nor_gl', 'arm']]:
    path = ROOT / 'public/assets' / file
    manifest['runtimeFiles'].append({'file': 'assets/' + file, 'bytes': path.stat().st_size,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
for file in ['fir-medium-a.glb', 'fir-medium-b.glb', 'fir-medium-c.glb', 'fir-saplings-lod.glb']:
    path = ROOT / 'public/models' / file
    manifest['runtimeFiles'].append({'file': 'models/' + file, 'bytes': path.stat().st_size,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
        'role': 'Existing embedded branch/twig PBR maps and understory geometry reused without duplication'})
for file in ['draco_wasm_wrapper.js', 'draco_decoder.wasm', 'draco_decoder.js', 'LICENSE']:
    path = ROOT / 'public/models/draco' / file
    category = 'runtimeFiles' if file in ['draco_wasm_wrapper.js', 'draco_decoder.wasm'] else 'optionalRuntimeFiles'
    manifest[category].append({'file': 'models/draco/' + file, 'bytes': path.stat().st_size,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'license': 'Apache-2.0',
        'source': 'https://github.com/google/draco', 'role': 'Locally bundled standard Draco decoder from installed Three.js'})
(ROOT / 'source/models/quarry-north-firs-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8', newline='\n')
print('NORTH_FIRS_EXPORTED', json.dumps(manifest['runtimeFiles']), flush=True)
