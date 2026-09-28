"""Bake unlit multiview fir attributes from the accepted decoded runtime GLBs.

Run the standard local Draco decoder first, then Blender --background --python
this file. This creates new intermediate frames only; accepted models and blends
are never opened for writing. Package frames with pack-north-backdrop.py.
"""
import bpy
import hashlib
import json
import math
import sys
from pathlib import Path

import numpy as np
from mathutils import Vector
from bpy_extras.object_utils import world_to_camera_view

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'outputs/north-backdrop/bake'
OUT.mkdir(parents=True, exist_ok=True)
CENTER = np.array([0., .5, 0.])
ELEVATIONS = [-10., 25.]
FRAME_WIDTH, FRAME_HEIGHT = .55, 1.10
TILE_WIDTH, TILE_HEIGHT, GUTTER = 256, 512, 8
SOURCE_DIR = ROOT / 'outputs/forest-edge/authoring/decoded'
MEDIUM = OUT / 'textures'
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
only_variant = int(args[args.index('--variant') + 1]) if '--variant' in args else None
only_view = int(args[args.index('--view') + 1]) if '--view' in args else None


def gltf_to_blender(v):
    return Vector((float(v[0]), -float(v[2]), float(v[1])))


def image_node(nodes, path, color):
    node = nodes.new('ShaderNodeTexImage')
    node.image = bpy.data.images.load(str(path), check_existing=True)
    node.image.colorspace_settings.name = 'sRGB' if color else 'Non-Color'
    node.extension = 'REPEAT'
    return node


def attribute_material(part, variant, mode, direction, depth_min, depth_max):
    mat = bpy.data.materials.new(f'Bake {part} {mode}')
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    links.new(emission.outputs[0], output.inputs['Surface'])
    uv = nodes.new('ShaderNodeTexCoord').outputs['UV']
    branch = part == 'Wood' or (part == 'Trunk' and variant == 2)
    if branch:
        mapping = nodes.new('ShaderNodeMapping')
        # Blender import flips glTF V. The original glTF repeat/offset becomes
        # (u * 1.2, BlenderV * .1); never project the accepted scanned bark again.
        mapping.inputs['Scale'].default_value = (1.2000000476837158, .09999993443489075, 1)
        links.new(uv, mapping.inputs['Vector'])
        uv = mapping.outputs['Vector']
    if branch:
        color = MEDIUM / 'fir_sapling_medium_branches_diff_2k.jpg'
        normal = MEDIUM / 'fir_sapling_medium_branches_nor_gl_2k.jpg'
    elif part == 'Needles':
        color = ROOT / 'public/assets/north_fir_twig_diff.jpg'
        normal = MEDIUM / 'fir_sapling_medium_twigs_nor_gl_2k.jpg'
    else:
        color = ROOT / f'public/assets/north_fir_trunk_{"ab"[variant]}_diff.jpg'
        normal = ROOT / f'public/assets/north_fir_trunk_{"ab"[variant]}_nor_gl.jpg'
    if mode == 'albedo':
        texture = image_node(nodes, color, True)
        links.new(uv, texture.inputs['Vector'])
        links.new(texture.outputs['Color'], emission.inputs['Color'])
    elif mode == 'normal':
        texture = image_node(nodes, normal, False)
        links.new(uv, texture.inputs['Vector'])
        normal_map = nodes.new('ShaderNodeNormalMap')
        normal_map.inputs['Strength'].default_value = 1
        links.new(texture.outputs['Color'], normal_map.inputs['Color'])
        split = nodes.new('ShaderNodeSeparateXYZ')
        links.new(normal_map.outputs['Normal'], split.inputs[0])
        combine = nodes.new('ShaderNodeCombineXYZ')
        # Blender world (x,y,z) -> normalized glTF object (x,z,-y).
        for channel, source, scale in [('X', 'X', .5), ('Y', 'Z', .5), ('Z', 'Y', -.5)]:
            value = nodes.new('ShaderNodeMath'); value.operation = 'MULTIPLY_ADD'
            links.new(split.outputs[source], value.inputs[0])
            value.inputs[1].default_value = scale; value.inputs[2].default_value = .5
            links.new(value.outputs[0], combine.inputs[channel])
        links.new(combine.outputs[0], emission.inputs['Color'])
    else:
        geom = nodes.new('ShaderNodeNewGeometry')
        dot = nodes.new('ShaderNodeVectorMath'); dot.operation = 'DOT_PRODUCT'
        links.new(geom.outputs['Position'], dot.inputs[0])
        dot.inputs[1].default_value = gltf_to_blender(direction)
        value = nodes.new('ShaderNodeMath'); value.operation = 'MULTIPLY_ADD'
        links.new(dot.outputs['Value'], value.inputs[0])
        value.inputs[1].default_value = 1 / (depth_max - depth_min)
        value.inputs[2].default_value = (-float(CENTER @ direction) - depth_min) / (depth_max - depth_min)
        links.new(value.outputs[0], emission.inputs['Color'])
    return mat


views = []
for elevation_index, elevation_degrees in enumerate(ELEVATIONS):
    elevation = math.radians(elevation_degrees)
    for azimuth_index in range(8):
        azimuth = azimuth_index * math.tau / 8
        direction = np.array([math.sin(azimuth) * math.cos(elevation), math.sin(elevation), math.cos(azimuth) * math.cos(elevation)])
        right = np.array([math.cos(azimuth), 0., -math.sin(azimuth)])
        up = np.cross(direction, right)
        index = elevation_index * 8 + azimuth_index
        column, row = index % 4, index // 4
        views.append({'index': index, 'azimuthRadians': azimuth, 'elevationRadians': elevation,
            'direction': direction.tolist(), 'right': right.tolist(), 'up': up.tolist(),
            'tile': [column, row], 'innerRectPixels': [column * TILE_WIDTH + GUTTER, row * TILE_HEIGHT + GUTTER,
                TILE_WIDTH - GUTTER * 2, TILE_HEIGHT - GUTTER * 2]})

specification = {
    'version': 1, 'normalization': 'Accepted runtime glTF Y up, root Y=0, source height=1',
    'center': CENTER.tolist(), 'frameWidth': FRAME_WIDTH, 'frameHeight': FRAME_HEIGHT,
    'azimuthCount': 8, 'elevationsRadians': [math.radians(e) for e in ELEVATIONS],
    'atlasSize': [1024, 2048], 'tileSize': [TILE_WIDTH, TILE_HEIGHT], 'gutter': GUTTER,
    'maxSafeMip': 3, 'pixelRowOrigin': 'top', 'textureFlipY': False,
    'albedo': 'straight sRGB RGB; linear fractional coverage in A; no sun, AO, fog or instance tint',
    'normalDepth': 'linear RGB=(object normal+1)/2; A=(dot(P-center,direction)-depthMin)/(depthMax-depthMin)',
    'projection': 'imageU=dot(P-center,right)/frameWidth+.5; imageV=.5-dot(P-center,up)/frameHeight',
    'views': views, 'variants': [],
}

for variant in range(3):
    if only_variant is not None and variant != only_variant:
        continue
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    decoded = SOURCE_DIR / f'quarry-north-fir-{variant}.glb'
    shipped = ROOT / f'public/models/quarry-north-fir-{variant}.glb'
    bpy.ops.import_scene.gltf(filepath=str(decoded))
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH' and f'NorthFir_{variant}_near_' in o.name]
    for obj in list(bpy.context.scene.objects):
        if obj.type == 'MESH' and obj not in meshes:
            bpy.data.objects.remove(obj, do_unlink=True)
    points = []
    for obj in meshes:
        positions = np.empty(len(obj.data.vertices) * 3, dtype=np.float32)
        obj.data.vertices.foreach_get('co', positions)
        positions = positions.reshape(-1, 3)
        # Imported objects have identity transforms; require rather than infer it.
        if np.max(np.abs(np.array(obj.matrix_world) - np.eye(4))) > 1e-7:
            raise RuntimeError('Unexpected imported model transform: ' + obj.name)
        points.append(positions[:, [0, 2, 1]] * [1, 1, -1])
    points = np.concatenate(points)
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x = 512; scene.render.resolution_y = 1024
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'OPEN_EXR'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.image_settings.color_depth = '32'
    scene.render.image_settings.exr_codec = 'ZIP'
    scene.view_settings.view_transform = 'Raw'
    scene.view_settings.look = 'None'
    scene.view_settings.exposure = 0; scene.view_settings.gamma = 1
    scene.world.color = (0, 0, 0)
    bpy.ops.object.camera_add()
    camera = bpy.context.object; camera.data.type = 'ORTHO'
    camera.data.sensor_fit = 'VERTICAL'; camera.data.ortho_scale = FRAME_HEIGHT
    camera.data.clip_start = .01; camera.data.clip_end = 10
    scene.camera = camera
    entry = {'variant': variant, 'sourceFile': str(shipped.relative_to(ROOT)).replace('\\', '/'),
        'sourceSha256': hashlib.sha256(shipped.read_bytes()).hexdigest(),
        'decodedSha256': hashlib.sha256(decoded.read_bytes()).hexdigest(), 'views': []}
    for view in views:
        direction, right, up = [np.asarray(view[key]) for key in ['direction', 'right', 'up']]
        depth = (points - CENTER) @ direction
        depth_min, depth_max = float(depth.min() - .01), float(depth.max() + .01)
        entry['views'].append({'index': view['index'], 'depthMin': depth_min, 'depthMax': depth_max})
        if only_view is not None and view['index'] != only_view:
            continue
        camera.location = gltf_to_blender(CENTER + direction * 3)
        camera.rotation_euler = (-gltf_to_blender(direction)).to_track_quat('-Z', 'Y').to_euler()
        bpy.context.view_layer.update()
        check_right = world_to_camera_view(scene, camera, gltf_to_blender(CENTER + right * FRAME_WIDTH / 2))
        check_up = world_to_camera_view(scene, camera, gltf_to_blender(CENTER + up * FRAME_HEIGHT / 2))
        if abs(check_right.x - 1) > 1e-5 or abs(check_up.y - 1) > 1e-5:
            raise RuntimeError(f'Camera projection differs from manifest: {check_right}, {check_up}')
        frame = {}
        for mode in ['albedo', 'normal', 'depth']:
            for obj in meshes:
                obj.data.materials.clear()
                obj.data.materials.append(attribute_material(obj.name.rsplit('_', 1)[-1], variant, mode, direction, depth_min, depth_max))
            path = OUT / f'fir-{variant}-view-{view["index"]:02d}-{mode}.exr'
            scene.render.filepath = str(path)
            bpy.ops.render.render(write_still=True)
            saved = bpy.data.images.load(str(path), check_existing=False)
            pixels = np.empty(512 * 1024 * 4, dtype=np.float32)
            saved.pixels.foreach_get(pixels)
            frame[mode] = pixels.reshape(1024, 512, 4)[::-1].copy()
            bpy.data.images.remove(saved)
        np.savez_compressed(OUT / f'fir-{variant}-view-{view["index"]:02d}.npz', **frame)
        print('NORTH_BACKDROP_VIEW', variant, view['index'], flush=True)
    specification['variants'].append(entry)
    (OUT / f'fir-{variant}-bake.json').write_text(json.dumps(entry, indent=2) + '\n', encoding='utf-8', newline='\n')
    for image in list(bpy.data.images):
        if image.users == 0: bpy.data.images.remove(image)

(OUT / 'bake-settings.json').write_text(json.dumps(specification, indent=2) + '\n', encoding='utf-8', newline='\n')
print('NORTH_BACKDROP_BAKE_COMPLETE', flush=True)
