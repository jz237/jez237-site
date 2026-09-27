import bpy,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/rocks/rock_moss_set_01_2k.gltf'))
for obj in bpy.context.scene.objects:
 if obj.type!='MESH':continue
 tris=sum(len(p.vertices)-2 for p in obj.data.polygons)
 mod=obj.modifiers.new('Gameplay LOD','DECIMATE');mod.ratio=min(1,1500/max(1,tris))
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models/rocks-lod.glb'),export_format='GLB',export_apply=True)
