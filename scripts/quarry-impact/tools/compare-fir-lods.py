import bpy,pathlib,math
from mathutils import Vector
root=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(root/'source/reference/fir_sapling_medium/fir_sapling_medium_2k.gltf'))
original=next(o for o in bpy.context.scene.objects if o.type=='MESH' and '_a_' in o.name)
for o in list(bpy.context.scene.objects):
 if o!=original:bpy.data.objects.remove(o,do_unlink=True)
width=max(original.dimensions.x,original.dimensions.y);height=original.dimensions.z
original.location.x=-width*1.4
for i,budget in [(0,150000),(1,40000)]:
 o=original.copy();o.data=original.data.copy();bpy.context.collection.objects.link(o);o.location.x=i*width*1.4
 triangles=sum(len(p.vertices)-2 for p in o.data.polygons)
 mod=o.modifiers.new('Comparison LOD','DECIMATE');mod.ratio=budget/triangles;mod.use_collapse_triangulate=True
 bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=mod.name)
scene=bpy.context.scene;scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=1800;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.world.color=(.22,.26,.31)
bpy.ops.object.light_add(type='SUN',location=(-10,-12,18));sun=bpy.context.object;sun.data.energy=2.5;sun.rotation_euler=(.42,-.55,-.4);sun.data.angle=.06
bpy.ops.mesh.primitive_plane_add(size=40);plane=bpy.context.object;plane.location.z=-.03
mat=bpy.data.materials.new('Neutral stage');mat.diffuse_color=(.19,.21,.17,1);plane.data.materials.append(mat)
bpy.ops.object.camera_add(location=(0,-height*4.5,height*.8));camera=bpy.context.object;direction=Vector((0,0,height*.46))-camera.location;camera.rotation_euler=direction.to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=max(width*4.6,height*2.4);scene.camera=camera
scene.render.filepath=str(root/'outputs/visual/fir-LOD-comparison.png');bpy.ops.render.render(write_still=True)
print('Comparison: left original, center150k, right40k; originaldimensions',width,height)
