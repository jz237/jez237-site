"""Original detailed event infrastructure. Uses the established Blender
fabrication helpers without executing/replacing previous authoring assets."""
import bpy, ast, pathlib, math, json, hashlib, random
from mathutils import Vector,Matrix
ROOT=pathlib.Path(__file__).resolve().parents[1]
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
GROUP='';ITEMS={};MATERIALS={};random.seed(93419)
tree=ast.parse((ROOT/'tools/author-workyard.py').read_text())
exec(compile(ast.Module(body=[n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name in ['world','mat','register','mesh','box','rod','beam','text']],type_ignores=[]),'workyard-helpers','exec'))
steel=mat('arena_steel',(.12,.16,.17),.56,.7)
chrome=mat('arena_alloy',(.50,.53,.55),.32,.87)
black=mat('arena_rubber',(.02,.026,.025),.9)
concrete=mat('arena_concrete',(.47,.44,.39),.92)
letter=mat('arena_lamps',(.82,.85,.78),.25)
yellow=mat('arena_yellow',(.72,.43,.075),.7,.07)
p=letter.node_tree.nodes.get('Principled BSDF');p.inputs['Emission Color'].default_value=(1,.89,.66,1);p.inputs['Emission Strength'].default_value=1.1
GROUP='floodlight'
# Footing, cast plinth, bolts, cable conduits and tapering octagonal mast.
box((0,.16,0),(.85,.32,.85),concrete,.04);box((0,.34,0),(.47,.08,.47),steel,.01)
for x in [-.17,.17]:
    for z in [-.17,.17]:rod((x,.32,z),(x,.47,z),.026,chrome,8)
rod((0,.36,0),(0,8.5,0),.095,steel,10,r2=.052)
rod((.1,.39,.10),(.1,6.6,.10),.019,black,7)
box((.16,1.30,.02),(.24,.43,.18),steel,.018)
beam((-1.18,8.38,0),(1.18,8.38,0),.095,.12,steel,.006)
for x in [-.83,-.27,.27,.83]:
    box((x,8.64,-.025),(.49,.36,.23),steel,.033)
    box((x,8.64,-.151),(.42,.28,.013),black,.017)
    for xx in [-.13,0,.13]:
        for yy in [-.065,.065]:box((x+xx,8.64+yy,-.165),(.096,.084,.013),letter,.007)
    for i in range(5):box((x-.18+i*.09,8.65,.102),(.025,.30,.066),chrome,.002)
    beam((x-.15,8.30,.10),(x-.15,8.64,.11),.025,.022,steel,.003)
GROUP='rail'
rod((-2.1,0,0),(2.1,0,0),.035,steel,8)
GROUP='cable'
rod((0,0,0),(0,1,0),.009,black,6)
GROUP='servicebox'
box((0,.85,0),(1.4,1.7,.9),steel,.045)
box((0,.13,0),(1.65,.26,1.12),concrete,.025)
box((0,.96,-.466),(1.25,1.36,.026),chrome,.016)
for i in range(11):box((.23,.46+i*.088,-.484),(.49,.018,.023),black,.002)
box((-.43,1,-.489),(.05,.2,.035),black,.008)
text('BQ / 237',(.55,1.51,-.489),(-1,0,0),size=.087)
# Merge by asset/material: small, predictable draw count per instance.
for group,objects in ITEMS.items():
    mats={}
    for o in objects:mats.setdefault(o.data.materials[0].name,[]).append(o)
    for name,parts in mats.items():
        bpy.ops.object.select_all(action='DESELECT')
        for o in parts:o.select_set(True)
        bpy.context.view_layer.objects.active=parts[0];bpy.ops.object.join();parts[0].name=group+'_'+name
        o=parts[0];uv=o.data.uv_layers.new(name='World metre UV')
        for poly in o.data.polygons:
            axis=max(range(3),key=lambda i:abs(poly.normal[i]))
            for li in poly.loop_indices:
                v=o.data.vertices[o.data.loops[li].vertex_index].co
                uv.data[li].uv=(v[1 if axis==0 else 0]/2.7,v[1 if axis==2 else 2]/2.7)
blend=ROOT/'source/models/arena-industrial.blend';bpy.ops.wm.save_as_mainfile(filepath=str(blend))
glb=ROOT/'public/models/arena-industrial.glb';bpy.ops.export_scene.gltf(filepath=str(glb),export_format='GLB',export_yup=True)
manifest={'method':'Original fabricated floodlights, conduits, cast mast bases, LED optics, electrical cabinet and tension rails authored in Blender 5.2','license':'CC0 original authoring; runtime concrete photograph retained from Poly Haven concrete_layers_02','script':'tools/author-arena-industrial.py','assetSha256':hashlib.sha256(glb.read_bytes()).hexdigest(),'blendSha256':hashlib.sha256(blend.read_bytes()).hexdigest(),'assetBytes':glb.stat().st_size,'meshCount':len([o for o in bpy.data.objects if o.type=='MESH'])}
(ROOT/'source/models/arena-industrial-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest))
