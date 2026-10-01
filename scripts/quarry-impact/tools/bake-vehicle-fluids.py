"""Offline Mantaflow fire/smoke bake and transparent 8x8 runtime flipbooks.

Run with Blender 5.2: blender --background --threads 8 --python this-file.
The simulation cache and intermediate renders stay in ignored outputs/.
No network, service credentials or paid assets are used.
"""
from pathlib import Path
import hashlib
import json
import math
import time
import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'outputs/structural-realism/fluid-bake'
PUBLIC = ROOT / 'public/assets/fx'
SOURCE = ROOT / 'source/fx'
for directory in [OUT, PUBLIC, SOURCE]:
    directory.mkdir(parents=True, exist_ok=True)
started = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end = 112
scene.render.fps = 24
scene.render.engine = 'BLENDER_EEVEE'
scene.render.resolution_x = scene.render.resolution_y = 256
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'
scene.view_settings.exposure = -2.5

# Two irregular fuel patches, with fluctuating flow and a small sideways draft.
flows = []
for i, (x, y, radius, fuel) in enumerate([(-.17, 0, .19, 1.15), (.18, .09, .12, .7)]):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=radius, location=(x, y, .12))
    flow = bpy.context.object
    flow.name = f'engine_fuel_patch_{i}'
    flow.scale.z = .38
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    mod = flow.modifiers.new('Fuel source', 'FLUID')
    mod.fluid_type = 'FLOW'
    settings = mod.flow_settings
    settings.flow_type = 'BOTH'
    settings.flow_behavior = 'INFLOW'
    settings.density = .38
    settings.fuel_amount = fuel
    settings.temperature = 1.1
    settings.use_initial_velocity = True
    settings.velocity_coord = (.13, -.04, .45)
    settings.velocity_random = .22
    for frame in range(1, 113, 8):
        settings.fuel_amount = fuel * (.8 + .2 * math.sin(frame * .57 + i * 2.7))
        settings.keyframe_insert(data_path='fuel_amount', frame=frame)
    flow.hide_render = True
    flows.append(flow)

bpy.ops.mesh.primitive_cube_add(size=1, location=(.12, 0, 1.7))
domain = bpy.context.object
domain.name = 'vehicle_fire_mantaflow_domain'
domain.dimensions = (2.0, 1.8, 3.4)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
modifier = domain.modifiers.new('Mantaflow gas', 'FLUID')
modifier.fluid_type = 'DOMAIN'
ds = modifier.domain_settings
ds.domain_type = 'GAS'
ds.resolution_max = 112
ds.cache_type = 'MODULAR'
ds.cache_directory = str(OUT / 'cache')
ds.cache_frame_start = 1
ds.cache_frame_end = 112
ds.use_noise = False
ds.vorticity = .7
ds.flame_vorticity = .8
ds.burning_rate = 1.25
ds.flame_smoke = .65
ds.use_dissolve_smoke = True
ds.dissolve_speed = 32
ds.use_adaptive_domain = True
ds.adapt_margin = 8

material = bpy.data.materials.new('Baked fuel and soot volume')
material.use_nodes = True
domain.data.materials.append(material)
nodes, links = material.node_tree.nodes, material.node_tree.links
nodes.clear()
output = nodes.new('ShaderNodeOutputMaterial')
volume = nodes.new('ShaderNodeVolumePrincipled')
info = nodes.new('ShaderNodeAttribute')
info.attribute_name='density'
fire_info=nodes.new('ShaderNodeAttribute')
fire_info.attribute_name='flame'
density = nodes.new('ShaderNodeMath')
density.operation = 'MULTIPLY'
density.inputs[1].default_value = 3.0
links.new(info.outputs['Fac'], density.inputs[0])
links.new(density.outputs[0], volume.inputs['Density'])
volume.inputs['Density Attribute'].default_value=''
volume.inputs['Color'].default_value = (.13, .145, .16, 1)
volume.inputs['Anisotropy'].default_value = .25
flame = nodes.new('ShaderNodeMath')
flame.operation = 'MULTIPLY'
flame.inputs[1].default_value = 3
links.new(fire_info.outputs['Fac'], flame.inputs[0])
links.new(flame.outputs[0], volume.inputs['Emission Strength'])
temperature = nodes.new('ShaderNodeValToRGB')
temperature.color_ramp.elements[0].position = .08
temperature.color_ramp.elements[0].color = (1, .035, .001, 1)
temperature.color_ramp.elements[1].position = .8
temperature.color_ramp.elements[1].color = (1, .72, .18, 1)
temperature.color_ramp.elements.new(.38).color = (1, .27, .015, 1)
links.new(fire_info.outputs['Fac'], temperature.inputs[0])
links.new(temperature.outputs[0], volume.inputs['Emission Color'])
links.new(volume.outputs[0], output.inputs['Volume'])

bpy.ops.object.camera_add(location=(0, -7, 2.0))
camera = bpy.context.object
camera.name = 'transparent_fx_bake_camera'
camera.data.type = 'ORTHO'
scene.camera = camera
bpy.ops.object.light_add(type='AREA', location=(-3, -4, 5))
sun = bpy.context.object
sun.data.energy = 900
sun.data.shape = 'DISK'
sun.data.size = 4
sun.rotation_euler = (Vector((0, 0, 1.6)) - sun.location).to_track_quat('-Z', 'Y').to_euler()
scene.world = bpy.data.worlds.new('Soft daylight')
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs[0].default_value = (.45, .55, .65, 1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value = .2

bpy.context.view_layer.objects.active = domain
domain.select_set(True)
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / 'vehicle-fluids.blend'))
print('BAKE_DATA_START', flush=True)
assert bpy.ops.fluid.bake_data() == {'FINISHED'}
print('FLUID_BAKE_COMPLETE', flush=True)
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE / 'vehicle-fluids.blend'))

frames = list(range(40, 104))
assets = []
for kind in ['fire', 'smoke']:
    if kind == 'fire':
        density.inputs[1].default_value = .45
        flame.inputs[1].default_value = 3
        camera.location = (0, -7, .88)
        target = Vector((.03, 0, .88))
        camera.data.ortho_scale = 1.7
    else:
        density.inputs[1].default_value = 3
        flame.inputs[1].default_value = 0
        camera.location = (.12, -7, 1.75)
        target = Vector((.12, 0, 1.75))
        camera.data.ortho_scale = 3.5
    camera.rotation_euler = (target - camera.location).to_track_quat('-Z', 'Y').to_euler()
    render_dir = OUT / kind
    render_dir.mkdir(exist_ok=True)
    for frame in frames:
        scene.frame_set(frame)
        scene.render.filepath = str(render_dir / f'{frame:04d}.png')
        bpy.ops.render.render(write_still=True)
        print('FX_RENDER', kind, frame, flush=True)
    assets.append({'kind': kind, 'frames': frames, 'tilePixels': 256, 'columns': 8, 'rows': 8, 'fps': 24, 'file': f'assets/fx/vehicle-{kind}-baked.png'})

manifest = {'producer': 'Blender ' + bpy.app.version_string, 'method': 'Mantaflow gas/fuel simulation, 112-cell modular OpenVDB data bake, Eevee named density/flame attributes and transparent volume render', 'resolution': 112, 'noiseScale': 1, 'simulationFrames': [1,112], 'assets': assets, 'license': 'CC0-1.0; original Quarry Impact procedural authoring', 'durationSeconds': time.time() - started, 'authoringScriptSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest()}
(OUT / 'render-manifest.json').write_bytes((json.dumps(manifest, indent=2) + '\n').encode())
print('FX_RENDER_COMPLETE', manifest['durationSeconds'], flush=True)
