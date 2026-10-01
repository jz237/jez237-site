"""Original wheel-center machining detail for the existing three licensed cars.
Metres, game X axle. One shared silver mesh per wheel, no topology/physics edits.
"""
import bpy,ast,pathlib,math,json,hashlib
from mathutils import Vector,Matrix
ROOT=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
GROUP='wheel_machining';ITEMS={};MATERIALS={}
tree=ast.parse((ROOT/'tools/author-workyard.py').read_text())
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['world','mat','register','mesh','rod']],type_ignores=[]),'fabrication-helpers','exec'))
metal=mat('Machined wheel hardware',(.36,.39,.4),.32,.88)
# Center-bore lip, beveled cap, five recessed hexagonal nuts and concentric
# washers. A very small molded ring reads independently from tire/plastic.
rod((.126,0,0),(.16,0,0),.042,metal,32,r2=.036)
rod((.159,0,0),(.164,0,0),.035,metal,32,r2=.032)
for i in range(5):
    a=i*math.tau/5;y=math.sin(a)*.077;z=math.cos(a)*.077
    rod((.130,y,z),(.144,y,z),.014,metal,16,r2=.013)
    rod((.143,y,z),(.159,y,z),.0105,metal,6,r2=.010)
    rod((.158,y,z),(.162,y,z),.008,metal,6,r2=.006)
parts=list(bpy.context.scene.objects);bpy.ops.object.select_all(action='SELECT');bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();parts[0].name='WheelMachining'
o=parts[0];uv=o.data.uv_layers.new(name='MachiningUV')
for poly in o.data.polygons:
    for li in poly.loop_indices:
        v=o.data.vertices[o.data.loops[li].vertex_index].co;uv.data[li].uv=(v.y*4,v.z*4)
blend=ROOT/'source/models/wheel-machining.blend';bpy.ops.wm.save_as_mainfile(filepath=str(blend))
glb=ROOT/'public/models/wheel-machining.glb';bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',export_yup=True)
manifest={'method':'Original Blender machined hub lip, cap, washers and hexagonal lug nuts. Existing licensed car shapes and destruction topology unchanged. One shared mesh per wheel, at most four draws per car.','license':'CC0 original authoring','script':'tools/author-wheel-machining.py','assetSha256':hashlib.sha256(glb.read_bytes()).hexdigest(),'blendSha256':hashlib.sha256(blend.read_bytes()).hexdigest(),'vertices':len(o.data.vertices),'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)}
(ROOT/'source/models/wheel-machining-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');print(json.dumps(manifest))
