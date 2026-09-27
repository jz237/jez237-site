import bpy,pathlib,json,hashlib,tempfile
root=pathlib.Path(__file__).resolve().parents[1]
(root/'outputs/blender-temp').mkdir(parents=True,exist_ok=True)
tempfile.tempdir=str(root/'outputs/blender-temp')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(root/'source/reference/fir_sapling_medium/fir_sapling_medium_2k.gltf'))
report=[]
for obj in list(bpy.context.scene.objects):
 if obj.type!='MESH':continue
 original_name=obj.name.replace('_LOD0','');obj.location.x=0
 source_triangles=sum(len(p.vertices)-2 for p in obj.data.polygons)
 far=obj.copy();far.data=obj.data.copy();bpy.context.collection.objects.link(far)
 for tree,budget,level in [(obj,150000,'NEAR'),(far,40000,'FAR')]:
  tree.name=original_name+'_'+level
  mod=tree.modifiers.new('Gameplay '+level,'DECIMATE');mod.ratio=min(1,budget/max(1,source_triangles));mod.use_collapse_triangulate=True
  bpy.context.view_layer.objects.active=tree;bpy.ops.object.modifier_apply(modifier=mod.name)
  report.append({'name':tree.name,'source_triangles':source_triangles,'triangles':sum(len(p.vertices)-2 for p in tree.data.polygons)})
for image in bpy.data.images:
 if image.source=='FILE' and ('nor_gl' in image.name or ('arm' in image.name or 'rough' in image.name)):
  image.scale(1024,1024);image.file_format='JPEG';image.pack()
for image in bpy.data.images:
 if image.source=='FILE' and 'diff' in image.name:image.pixels[0]=image.pixels[0]
bpy.ops.wm.save_as_mainfile(filepath=str(root/'source/models/fir-medium.blend'))
import runpy
runpy.run_path(str(root/'tools/split-fir-medium.py'),run_name='__main__')
