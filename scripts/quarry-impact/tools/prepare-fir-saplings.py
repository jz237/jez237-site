import bpy,pathlib,json,hashlib,tempfile
root=pathlib.Path(__file__).resolve().parents[1]
(root/'outputs/blender-temp').mkdir(parents=True,exist_ok=True)
tempfile.tempdir=str(root/'outputs/blender-temp')
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(root/'source/reference/fir_sapling/fir_sapling_2k.gltf'))
report=[]
for obj in list(bpy.context.scene.objects):
 if obj.type!='MESH':continue
 obj.location.x=0
 tris=sum(len(p.vertices)-2 for p in obj.data.polygons)
 mod=obj.modifiers.new('Near forest gameplay LOD','DECIMATE');mod.ratio=min(1,14000/max(1,tris));mod.use_collapse_triangulate=True
 bpy.context.view_layer.objects.active=obj
 bpy.ops.object.modifier_apply(modifier=mod.name)
 report.append({'name':obj.name,'source_triangles':tris,'triangles':sum(len(p.vertices)-2 for p in obj.data.polygons)})
for image in bpy.data.images:
 if image.source=='FILE' and ('nor_gl' in image.name or ('arm' in image.name or 'rough' in image.name)):
  image.scale(1024,1024);image.file_format='JPEG';image.pack()
for image in bpy.data.images:
 if image.source=='FILE' and 'diff' in image.name:image.pixels[0]=image.pixels[0]
# Preserve physical-scale roots and the scan's original PBR materials.
bpy.ops.wm.save_as_mainfile(filepath=str(root/'source/models/fir-saplings.blend'))
bpy.ops.export_scene.gltf(filepath=str(root/'public/models/fir-saplings-lod.glb'),export_format='GLB',export_apply=True,export_image_format='JPEG',export_jpeg_quality=90)
(root/'source/models/fir-saplings-lod.json').write_text(json.dumps({'source':'https://polyhaven.com/a/fir_sapling','license':'CC0-1.0','modifications':'Decimated to roughly 14,000 triangles per variant; normalized root X translation; retained source physical dimensions; normal/ARM maps resized to1k, diffuse2k, JPEG quality90.','meshes':report,'runtime_file':'public/models/fir-saplings-lod.glb','sha256':hashlib.sha256((root/'public/models/fir-saplings-lod.glb').read_bytes()).hexdigest()},indent=2))
print('FIR_LOD_REPORT',json.dumps(report))
