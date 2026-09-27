"""Prepare CC-BY Car Concept into three panelized, dimensioned game variants.
Source credit: Unity Fan (original CC0), Khronos Group contributors (CC-BY 4.0).
Transforms, de-branding, silhouette variants, damage panel naming and wheel pivots by Quarry Impact.
"""
import bpy, pathlib, math
from mathutils import Vector, Matrix
ROOT=pathlib.Path(__file__).resolve().parents[1]
for kind,length,width,height,wheelbase in [('coupe',4.65,1.98,1.36,2.72),('sedan',4.95,1.92,1.48,2.98),('hatch',4.15,1.84,1.50,2.46)]:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 bpy.ops.import_scene.gltf(filepath=str(ROOT/'source/reference/CarConcept.glb'))
 bpy.context.view_layer.update()
 roots=[o for o in bpy.context.scene.objects if o.name in ['WheelFrontL','WheelFrontR','WheelRearL','WheelRearR']]
 memberships={};centers={}
 for root in roots:
  c=root.matrix_world.translation.copy();code=('F' if 'Front' in root.name else 'R')+('L' if c.x<0 else 'R');centers[code]=c
  for o in root.children_recursive:memberships[o.name]=code
 objects=[o for o in bpy.context.scene.objects if o.type=='MESH']
 allpoints=[o.matrix_world@Vector(v) for o in objects for v in o.bound_box]
 mins=Vector([min(p[i] for p in allpoints) for i in range(3)]);maxs=Vector([max(p[i] for p in allpoints) for i in range(3)])
 print('BOUNDS',kind,tuple(mins),tuple(maxs),flush=True)
 ycenter=(centers['FL'].y+centers['RL'].y)/2
 sx=(width/2-.04)/abs(centers['FL'].x);sy=wheelbase/(centers['RL'].y-centers['FL'].y);sz=height/(maxs.z-mins.z)
 for o in objects:
  name=o.name;world=o.matrix_world.copy();o.parent=None;o.matrix_world=Matrix.Identity(4);o.data.transform(world)
  code=memberships.get(name)
  if code and code.startswith('F'):
   c=centers[code];rot=Matrix.Rotation(math.radians(30),4,'Z')
   for v in o.data.vertices:v.co=c+rot@(v.co-c)
  for v in o.data.vertices:
   x,y,z=v.co;v.co=Vector((x*sx,(y-ycenter)*sy,(z-mins.z)*sz))
   if not code and z> .86 and y>-.2:
    weight=min(1,(z-.86)/.5)
    if kind=='sedan':v.co.y+=.18*weight*max(0,1-abs(y-.45)/1.6)
    if kind=='hatch':v.co.y+=.30*weight*max(0,1-abs(y-.65)/1.6)
  # The steering wheel emblem and plate logo are not part of our fictional brand.
  if 'Emblem' in name or name=='License Plate':
   for m in o.data.materials:
    if not m:continue
    m=m.copy();m.name='unbranded';m.node_tree.nodes.clear();p=m.node_tree.nodes.new('ShaderNodeBsdfPrincipled');p.inputs['Base Color'].default_value=(.09,.11,.10,1);p.inputs['Metallic'].default_value=.7;out=m.node_tree.nodes.new('ShaderNodeOutputMaterial');m.node_tree.links.new(p.outputs['BSDF'],out.inputs['Surface']);o.data.materials.clear();o.data.materials.append(m);break
  if name.startswith('Body') and not any(s in name for s in ['Window','Windshield','Headlights','Taillights','Turnsignals','Gasket','Wipers']):
   suffix='hood' if name=='BodyHood' else 'mirror' if 'MirrorColor1' in name else 'bumper_rear' if name=='BodyRearPanelsColor1' else name
   o.name='panel_'+suffix
  elif 'Window' in name or name=='BodyWindshield':o.name='glass_'+name
  if code:
   c=centers[code];center=Vector((c.x*sx,(c.y-ycenter)*sy,(c.z-mins.z)*sz))
   o.data.transform(Matrix.Translation(-center));o.location=center
  for m in o.data.materials:
   if m and m.name.startswith('Paint'):m.name='paint_'+m.name
 # Normalize each wheel parent to world axes; mesh positions remain local to center.
 for root in roots:bpy.data.objects.remove(root,do_unlink=True)
 for code,c in centers.items():
  center=Vector((c.x*sx,(c.y-ycenter)*sy,(c.z-mins.z)*sz));root=bpy.data.objects.new('wheel_'+code,None);bpy.context.collection.objects.link(root);root.location=center
  for o in objects:
   if memberships.get(o.name)==code: # Most wheel mesh names are unchanged.
    o.parent=root;o.location=(0,0,0)
 # Remove unused transform empties, keeping wheel groups only.
 for o in list(bpy.context.scene.objects):
  if o.type=='EMPTY' and not o.name.startswith('wheel_'):bpy.data.objects.remove(o,do_unlink=True)
 bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'source/models'/f'{kind}.blend'))
 bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/models'/f'{kind}.glb'),export_format='GLB',export_apply=True,export_yup=True)
 print('PREPARED',kind,flush=True)
