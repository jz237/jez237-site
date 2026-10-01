"""Re-render an existing Mantaflow cache without repeating the simulation."""
from pathlib import Path
import bpy
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'outputs/structural-realism/fluid-bake'
bpy.ops.wm.open_mainfile(filepath=str(ROOT/'source/fx/vehicle-fluids.blend'))
scene=bpy.context.scene
domain=bpy.data.objects['vehicle_fire_mantaflow_domain']
ds=domain.modifiers[0].domain_settings
ds.cache_directory=str(OUT/'cache');ds.use_noise=False
nodes=domain.data.materials[0].node_tree.nodes
volume=next(n for n in nodes if n.bl_idname=='ShaderNodeVolumePrincipled')
density=volume.inputs['Density'].links[0].from_node
flame=volume.inputs['Emission Strength'].links[0].from_node
assert density.bl_idname==flame.bl_idname=='ShaderNodeMath'
assert density.inputs[0].links[0].from_node.attribute_name=='density'
assert flame.inputs[0].links[0].from_node.attribute_name=='flame'
for kind in ['fire','smoke']:
    height=.88 if kind=='fire' else 1.75
    density.inputs[1].default_value=.45 if kind=='fire' else 3
    flame.inputs[1].default_value=3 if kind=='fire' else 0
    scene.camera.location=(.12,-7,height)
    scene.camera.rotation_euler=(Vector((.03 if kind=='fire' else .12,0,height))-scene.camera.location).to_track_quat('-Z','Y').to_euler()
    scene.camera.data.ortho_scale=1.7 if kind=='fire' else 3.5
    folder=OUT/kind;folder.mkdir(parents=True,exist_ok=True)
    for frame in range(40,104):
        scene.frame_set(frame);scene.render.filepath=str(folder/f'{frame:04d}.png')
        bpy.ops.render.render(write_still=True)
