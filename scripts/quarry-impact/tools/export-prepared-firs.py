import bpy,pathlib,json,hashlib
root=pathlib.Path(__file__).resolve().parents[1]
for source,output,asset in [('fir-saplings','fir-saplings-lod','fir_sapling')]:
 bpy.ops.wm.open_mainfile(filepath=str(root/'source/models'/f'{source}.blend'))
 for image in bpy.data.images:
  if image.source=='FILE' and ('arm' in image.name or 'rough' in image.name):image.scale(1024,1024);image.file_format='JPEG';image.pack()
  if image.source=='FILE' and 'diff' in image.name:image.pixels[0]=image.pixels[0]
 bpy.ops.wm.save_as_mainfile(filepath=str(root/'source/models'/f'{source}.blend'))
 target=root/'public/models'/f'{output}.glb'
 bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',export_apply=True,export_image_format='JPEG',export_jpeg_quality=90)
 report=[{'name':o.name,'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in bpy.context.scene.objects if o.type=='MESH']
 (root/'source/models'/f'{output}.json').write_text(json.dumps({'source':'https://polyhaven.com/a/'+asset,'license':'CC0-1.0','modifications':'Gameplay LODs; normalized root X; normal/ARM maps at1k, diffuse maps at2k, JPEG quality90.','meshes':report,'runtime_file':'public/models/'+target.name,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()},indent=2))
 print('EXPORT_RESULT',target.name,target.stat().st_size,report)

import runpy
runpy.run_path(str(root/'tools/split-fir-medium.py'),run_name='__main__')
