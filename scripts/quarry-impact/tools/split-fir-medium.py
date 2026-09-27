import bpy,pathlib,json,hashlib
root=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(root/'source/models/fir-medium.blend'))
report=[]
for variant in 'abc':
 bpy.ops.object.select_all(action='DESELECT')
 chosen=[o for o in bpy.context.scene.objects if o.type=='MESH' and f'medium_{variant}_' in o.name]
 for o in chosen:o.select_set(True)
 target=root/'public/models'/f'fir-medium-{variant}.glb'
 bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',export_apply=True,export_image_format='JPEG',export_jpeg_quality=90,use_selection=True)
 assert target.stat().st_size<25*1024*1024
 report.append({'variant':variant,'runtime_file':'public/models/'+target.name,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'meshes':[{'name':o.name,'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o in chosen]})
(root/'source/models/fir-medium-lod.json').write_text(json.dumps({'source':'https://polyhaven.com/a/fir_sapling_medium','license':'CC0-1.0','modifications':'Three variants at150k near/40k far triangles; root X normalized; normal andARM1k, diffuse2k. Split pervariant for static-host25MiB filelimit; runtime shares material textures acrossvariants.','files':report},indent=2))
print('SPLIT_FIR_REPORT',json.dumps(report))
