"""Original Tideline R-01 watercraft. Run with Blender --background --python this_file.
Editable bevelled geometry is saved to .blend; glTF and compact game meshes are derived.
Design coordinates use the game's X/right, Y/up, Z/bow; Blender uses Z/up.
"""
import bpy, math, json, struct
from pathlib import Path
from mathutils import Vector

ROOT=Path(__file__).resolve().parents[2]
ASSETS=(ROOT/'dist' if (ROOT/'dist').exists() else ROOT)/'assets'
ASSETS.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def xyz(p):return Vector((p[0],-p[2],p[1]))
def game(p):return (p.x,p.z,-p.y)
materials={}; specs={}
def material(name,color,metal=0,rough=.4,coat=0):
 m=bpy.data.materials.new(name);m.diffuse_color=(*tuple(int(color[i:i+2],16)/255 for i in (0,2,4)),1);m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF')
 # Blender shader values are linear, matching the browser material's colour conversion.
 rgb=tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in m.diffuse_color[:3])
 bs.inputs['Base Color'].default_value=(*rgb,1);bs.inputs['Metallic'].default_value=metal;bs.inputs['Roughness'].default_value=rough
 bs.inputs['Coat Weight'].default_value=coat;bs.inputs['Coat Roughness'].default_value=.16
 materials[name]=m;specs[name]={'color':int(color,16),'metalness':metal,'roughness':rough,'clearcoat':coat,'clearcoatRoughness':.16}
 return m
material('Pearl ceramic','39474d',.32,.27,1)
material('Rider livery','d95b24',.28,.27,1)
material('Graphite composite','152027',.35,.25,.9)
material('Carbon fibre','202a30',.32,.34,.85)
material('Soft saddle','202a30',0,.76)
material('Traction rubber','10181d',0,.87)
material('Brushed titanium','83949b',.84,.3)
material('Dark anodized metal','253941',.78,.28)
material('Warm accent','b9cdcb',.35,.33)
material('Lettering','dce8e8',.15,.36)
material('Lens','122d3b',.6,.12,1)
material('Display light','6ecbca',.15,.25)
specs['Display light'].update(emissive=0x348a91,emissiveIntensity=.45)

def finish(o,name,mat,group='chassis',smooth=True):
 o.name=name;o['game_group']=group;o.data.materials.append(materials[mat])
 if o.type=='MESH':
  for f in o.data.polygons:f.use_smooth=smooth
 return o
def bevel(o,amount=.03,segments=3):
 m=o.modifiers.new('Machined edge radius','BEVEL');m.width=amount;m.segments=segments
 m=o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');m.keep_sharp=True
 return o
def box(name,p,size,mat,r=.03,group='chassis'):
 bpy.ops.mesh.primitive_cube_add(size=1,location=xyz(p));o=bpy.context.object;o.scale=(size[0],size[2],size[1]);bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 finish(o,name,mat,group);return bevel(o,r)
def rod(name,a,b,r,mat,group='chassis',r2=None):
 a,b=xyz(a),xyz(b);d=b-a
 bpy.ops.mesh.primitive_cone_add(vertices=20,radius1=r,radius2=r if r2 is None else r2,depth=d.length,location=(a+b)/2)
 o=bpy.context.object;o.rotation_euler=d.to_track_quat('Z','Y').to_euler();finish(o,name,mat,group);return bevel(o,min(r*.2,.006),2)
def tube(name,points,r,mat,group='chassis'):
 c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=8;c.bevel_depth=r;c.bevel_resolution=2
 sp=c.splines.new('BEZIER');sp.bezier_points.add(len(points)-1)
 for b,p in zip(sp.bezier_points,points):b.co=xyz(p);b.handle_left_type='AUTO';b.handle_right_type='AUTO'
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);finish(o,name,mat,group);return o
def ellipsoid(name,p,size,mat,group='chassis'):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,location=xyz(p));o=bpy.context.object;o.scale=(size[0],size[2],size[1]);finish(o,name,mat,group);return o
def mesh(name,verts,faces,mat,group='chassis',sub=0):
 m=bpy.data.meshes.new(name);m.from_pydata([xyz(v) for v in verts],[],faces);m.update();o=bpy.data.objects.new(name,m);bpy.context.collection.objects.link(o);finish(o,name,mat,group)
 if sub:mod=o.modifiers.new('Continuous surface','SUBSURF');mod.levels=sub
 return o
def loft(name,sections,mat,profile=None,sub=2):
 # Closed hard-chine sections: top, bevelled shoulder, chine, V-keel, mirrored side.
 profile=profile or [(-1,.88),(-.99,.65),(-.82,.24),(-.42,.055),(0,0),(.42,.055),(.82,.24),(.99,.65),(1,.88),(.75,1), (0,1.04),(-.75,1)]
 vs=[];n=len(profile)
 for z,w,top,bottom in sections:
  vs.extend((w*x,bottom+(top-bottom)*y,z) for x,y in profile)
 faces=[]
 for i in range(len(sections)-1):
  for j in range(n):faces.append((i*n+j,i*n+(j+1)%n,(i+1)*n+(j+1)%n,(i+1)*n+j))
 faces.extend([tuple(reversed(range(n))),tuple((len(sections)-1)*n+j for j in range(n))])
 return mesh(name,vs,faces,mat,sub=sub)
def panel(name,outline,mat,thickness=.012):
 o=mesh(name,outline,[tuple(range(len(outline)))],mat)
 m=o.modifiers.new('Panel thickness','SOLIDIFY');m.thickness=thickness
 return bevel(o,.012,3)
def text(name,content,p,size,mat,side=0):
 c=bpy.data.curves.new(name,'FONT');c.body=content;c.size=size;c.extrude=.0007;c.bevel_depth=.00025;c.align_x='CENTER';c.align_y='CENTER'
 o=bpy.data.objects.new(name,c);bpy.context.collection.objects.link(o);o.location=xyz(p)
 # Font lies in local XY; arrange it along the hull with local Y pointing up.
 from mathutils import Matrix
 if side:
  right=xyz((0,0,-side));up=xyz((0,1,0));normal=right.cross(up)
 else:right=xyz((1,0,0));up=xyz((0,1,0));normal=right.cross(up)
 o.rotation_euler=Matrix((right,up,normal)).transposed().to_euler();finish(o,name,mat);return o

# Hull: narrow wave-cutting bow, V bottom, broad stable transom.
loft('01 / Deep V composite hull',[
 (-1.92,.42,.17,-.12),(-1.9,.56,.2,-.22),(-1.7,.65,.24,-.34),(-1.0,.73,.26,-.44),
 (-.2,.75,.29,-.46),(.65,.65,.35,-.34),(1.25,.47,.41,-.15),(1.78,.2,.45,.17),(2.04,.012,.39,.36)],'Graphite composite')
loft('02 / Pearl upper deck',[
 (-1.87,.44,.28,.17),(-1.75,.62,.32,.22),(-1.12,.7,.35,.25),(-.3,.72,.39,.28),(.5,.66,.45,.33),
 (1.1,.52,.53,.38),(1.68,.28,.51,.4),(2.035,.008,.405,.37)],'Pearl ceramic')
loft('03 / Sculpted livery hood',[
 (.05,.21,.55,.4),(.16,.34,.64,.41),(.48,.37,.79,.45),(.88,.35,.8,.46),(1.25,.29,.67,.44),(1.66,.13,.52,.43),(1.88,.008,.45,.43)],'Rider livery')
loft('04 / Recessed center bonnet',[
 (.6,.12,.809,.773),(.69,.17,.821,.78),(.97,.16,.79,.75),(1.35,.095,.654,.62),(1.58,.004,.552,.53)],'Carbon fibre',sub=2)
for side in [-1,1]:
 tube('Continuous rub rail',[(side*.52,.23,-1.87),(side*.72,.27,-1.1),(side*.745,.32,-.1),(side*.66,.37,.7),(side*.46,.42,1.3),(side*.2,.45,1.79),(0,.4,2.04)],.025,'Traction rubber')
 tube('Lower spray chine',[(side*.5,-.13,-1.81),(side*.64,-.12,-1.15),(side*.66,-.06,-.2),(side*.53,.06,.65),(side*.3,.2,1.4)],.016,'Warm accent')
 panel('Livery side spear',[(side*.725,.27,-1.2),(side*.747,.29,-.2),(side*.665,.39,.66),(side*.606,.43,.9),(side*.68,.32,.58),(side*.746,.19,-.4),(side*.71,.18,-1.3)],'Rider livery')
 panel('Rear quarter satin insert',[(side*.68,.27,-1.65),(side*.728,.28,-.9),(side*.735,.20,-.8),(side*.64,.13,-1.7)],'Dark anodized metal')
 # Recessed footwells and molded diamond/rib traction.
 box('Footwell basin',(side*.5,.365,-.47),(.30,.045,1.76),'Traction rubber',.04)
 for k in range(22):
  o=box('Molded traction rib',(side*.5,.392,-1.23+k*.069),(.245,.012,.018),'Soft saddle',.005)
  o.rotation_euler.z=side*.12
 tube('Outer footwell coaming',[(side*.64,.38,-1.35),(side*.67,.42,-.6),(side*.625,.48,.2)],.023,'Graphite composite')
 box('Rear tracking sponson',(side*.674,-.005,-1.38),(.095,.14,.76),'Graphite composite',.024)
 for z in [-1.57,-1.15]:rod('Sponson hex fastener',(side*.726,.018,z),(side*.733,.018,z),.023,'Brushed titanium')
 # Forward cooling grilles, recessed into black fairing.
 panel('Intake recess',[(side*.375,.56,.37),(side*.44,.49,.69),(side*.38,.54,1.05),(side*.305,.67,.83)],'Traction rubber')
 for k in range(6):tube('Intake louver',[(side*(.37-k*.005),.56+k*.016,.45+k*.071),(side*(.421-k*.009),.51+k*.021,.62+k*.065)],.009,'Dark anodized metal')
 text('Hull nameplate','T I D E L I N E',(side*.751,.281,-.48),.071,'Lettering',side)
 text('Rear series','R—01',(side*.689,.265,-1.5),.095,'Lettering',side)
 # Split composite fairings, inset access fasteners and rescue tow hardpoints.
 panel('Composite rear shoulder',[(side*.47,.346,-1.63),(side*.624,.365,-1.18),(side*.642,.397,-.46),(side*.66,.37,-.34),(side*.684,.33,-1.27)],'Carbon fibre')
 tube('Deck moulding seam',[(side*.57,.36,-1.43),(side*.66,.4,-.52),(side*.61,.465,.3),(side*.48,.56,.92)],.004,'Traction rubber')
 for z in [-1.54,-.86,-.2]:
  rod('Recessed deck screw',(side*.621,.356,z),(side*.621,.366,z),.013,'Dark anodized metal')
  box('Screwdriver slot',(side*.621,.368,z),(.013,.002,.002),'Traction rubber',.001)
 tube('Rear race accent',[(side*.52,.325,-1.75),(side*.595,.348,-1.32),(side*.63,.365,-.9)],.012,'Rider livery')

# Ergonomic stepped saddle with piping and visible upholstered ribs.
loft('05 / Saddle support',[
 (-1.48,.19,.53,.34),(-1.36,.29,.57,.36),(-.86,.32,.56,.36),(-.33,.28,.53,.37),(.15,.21,.60,.4),(.35,.07,.63,.47)],'Graphite composite')
loft('06 / Stepped touring saddle',[
 (-1.46,.15,.69,.49),(-1.35,.26,.74,.48),(-.94,.30,.745,.46),(-.63,.29,.70,.46),(-.34,.25,.63,.46),
 (-.02,.23,.65,.48),(.2,.17,.72,.54),(.32,.04,.72,.6)],'Soft saddle')
for side in [-1,1]:
 tube('Saddle double stitching',[(side*.19,.667,-1.38),(side*.255,.696,-1.1),(side*.259,.649,-.72),(side*.218,.602,-.3),(side*.18,.639,.06),(side*.1,.698,.24)],.003,'Warm accent')
for k in range(9):
 z=-1.27+k*.063
 tube('Passenger saddle pleat',[(-.21,.713,z),(-.11,.741,z+.006),(0,.75,z+.009),(.11,.741,z+.006),(.21,.713,z)],.004,'Graphite composite')
box('Rear boarding platform',(0,.255,-1.82),(1.10,.085,.34),'Graphite composite',.035)
box('Boarding traction pad',(0,.304,-1.83),(.92,.024,.25),'Traction rubber',.025)
for k in range(12):box('Platform traction',(k*.071-.39,.32,-1.83),(.024,.008,.20),'Soft saddle',.003)
tube('Passenger grab handle',[(-.36,.48,-1.34),(-.43,.56,-1.52),(-.31,.61,-1.66),(.31,.61,-1.66),(.43,.56,-1.52),(.36,.48,-1.34)],.028,'Graphite composite')
for side in [-1,1]:
 box('Transom service hatch',(side*.34,.231,-1.971),(.23,.105,.016),'Carbon fibre',.012)
 rod('Tow eye mounting',(side*.48,.197,-1.951),(side*.48,.197,-1.978),.033,'Brushed titanium')
 tube('Stainless tow eye',[(side*.458,.197,-1.975),(side*.458,.198,-2.025),(side*.505,.198,-2.025),(side*.505,.197,-1.975)],.007,'Brushed titanium')
for side in [-1,1]:rod('Boarding step hinge',(side*.44,.13,-1.88),(side*.44,.03,-2.0),.025,'Brushed titanium')
tube('Fold down boarding step',[(-.44,.04,-2.0),(-.34,-.005,-2.04),(.34,-.005,-2.04),(.44,.04,-2.0)],.026,'Traction rubber')
rod('Fuel filler neck',(0,.79,.93),(0,.816,.93),.065,'Dark anodized metal')
rod('Fuel filler cap',(0,.816,.93),(0,.828,.93),.052,'Brushed titanium')
box('Fuel cap latch',(0,.833,.93),(.052,.009,.012),'Graphite composite',.004)

# Steering assembly; this group is exported relative to the existing game pivot.
loft('07 / Steering console',[(.44,.12,.76,.59),(.56,.20,.94,.65),(.71,.19,.95,.66),(.79,.10,.84,.67)],'Graphite composite')
rod('Steering column',(0,.85,.66),(0,1.075,.66),.058,'Dark anodized metal')
box('Handlebar clamp',(0,1.082,.66),(.13,.075,.10),'Graphite composite',.014,'bars')
for side in [-1,1]:rod('Clamp bolt',(side*.04,1.118,.66),(side*.04,1.129,.66),.012,'Brushed titanium','bars')
tube('Handlebar sweep',[(-.5,1.11,.73),(-.27,1.14,.63),(0,1.08,.66),(.27,1.14,.63),(.5,1.11,.73)],.029,'Brushed titanium','bars')
for side in [-1,1]:
 a=(side*.34,1.123,.673);b=(side*.515,1.108,.738)
 rod('Textured handle grip',a,b,.046,'Traction rubber','bars')
 for k in range(9):
  t=k/9;p=tuple(a[j]+(b[j]-a[j])*t for j in range(3));q=tuple(a[j]+(b[j]-a[j])*(t+.025) for j in range(3));rod('Grip molded ring',p,q,.048,'Soft saddle','bars')
 box('Thumb switch housing',(side*.30,1.124,.66),(.071,.072,.068),'Graphite composite',.016,'bars')
 rod('Red kill switch',(side*.3,1.16,.66),(side*.3,1.17,.66),.016,'Rider livery','bars')
 tube('Brake lever',[(side*.32,1.10,.715),(side*.4,1.08,.79),(side*.5,1.08,.795)],.009,'Brushed titanium','bars')
 tube('Mirror support',[(side*.26,1.02,.78),(side*.42,1.08,.89),(side*.48,1.12,.94)],.016,'Graphite composite','bars')
 ellipsoid('Mirror aerodynamic housing',(side*.49,1.15,.94),(.122,.055,.047),'Graphite composite','bars')
 ellipsoid('Mirror glass',(side*.49,1.151,.903),(.099,.039,.009),'Lens','bars')
box('Instrument binnacle',(0,1.16,.65),(.286,.065,.21),'Graphite composite',.025,'bars')
box('Instrument glass',(0,1.196,.635),(.233,.006,.148),'Lens',.014,'bars')
for side in [-1,1]:rod('Instrument mount bolt',(side*.122,1.191,.655),(side*.122,1.20,.655),.009,'Brushed titanium','bars')
tube('Safety lanyard',[(-.27,1.1,.61),(-.28,.96,.48),(-.14,.88,.45),(-.04,.93,.42)],.005,'Rider livery')

# Pump and directional nozzle, hollow concentric rings plus actuator hardware.
def ring(name,p,radius,minor,mat,group='nozzle'):
 bpy.ops.mesh.primitive_torus_add(major_radius=radius,minor_radius=minor,major_segments=40,minor_segments=10,location=xyz(p),rotation=(math.pi/2,0,0))
 o=bpy.context.object;finish(o,name,mat,group);return o
ring('Jet pump mounting flange',(0,-.10,-1.8),.151,.029,'Dark anodized metal')
ring('Nozzle exit lip',(0,-.10,-1.99),.115,.014,'Brushed titanium')
for i in range(6):
 a=i*math.pi/3;x=math.sin(a);y=math.cos(a)
 rod('Nozzle barrel rail',(x*.145,-.10+y*.145,-1.8),(x*.12,-.10+y*.12,-1.99),.012,'Dark anodized metal','nozzle')
 rod('Flange fastener',(x*.167,-.10+y*.167,-1.795),(x*.167,-.10+y*.167,-1.826),.015,'Brushed titanium','nozzle')
rod('Black pump interior',(0,-.1,-1.84),(0,-.1,-1.87),.112,'Traction rubber','nozzle')
tube('Reverse bucket guard',[(-.17,-.13,-1.94),(-.13,.075,-1.96),(0,.10,-1.97),(.13,.075,-1.96),(.17,-.13,-1.94)],.018,'Graphite composite','nozzle')
for side in [-1,1]:rod('Steering actuator',(side*.18,-.04,-1.78),(side*.15,-.04,-1.95),.014,'Brushed titanium','nozzle')

# Export evaluated meshes, merged by material and articulated group for few draw calls.
bpy.context.view_layer.update();deps=bpy.context.evaluated_depsgraph_get();batches={}
pivots={'chassis':(0,0,0),'bars':(0,1.08,.66),'nozzle':(0,-.1,-1.87)}
model_objects=[o for o in bpy.context.scene.objects if 'game_group' in o]
for obj in model_objects:
 ev=obj.evaluated_get(deps);m=ev.to_mesh();m.calc_loop_triangles();normal_matrix=obj.matrix_world.to_3x3().inverted().transposed()
 group=obj['game_group'];pivot=pivots[group]
 for tri in m.loop_triangles:
  mat=m.materials[tri.material_index].name;out=batches.setdefault((group,mat),[])
  for vi,li in zip(tri.vertices,tri.loops):
   p=game(obj.matrix_world@m.vertices[vi].co);n=game((normal_matrix@m.corner_normals[li].vector).normalized())
   out.extend((p[0]-pivot[0],p[1]-pivot[1],p[2]-pivot[2],*n))
 ev.to_mesh_clear()
meta={'version':1,'source':'Tideline R-01.blend','materials':specs,'groups':pivots,'meshes':[]};offset=0
with (ASSETS/'tideline-r01.bin').open('wb') as f:
 for (group,mat),values in batches.items():
  f.write(struct.pack('<'+'f'*len(values),*values));meta['meshes'].append({'group':group,'material':mat,'offset':offset,'vertices':len(values)//6});offset+=len(values)*4
(ASSETS/'tideline-r01.json').write_text(json.dumps(meta,separators=(',',':')),encoding='utf-8')
print('GAME EXPORT:',sum(x['vertices'] for x in meta['meshes'])//3,'triangles;',len(batches),'draw batches;',offset,'bytes',flush=True)

# Standard interchange export alongside the compact runtime asset.
bpy.ops.object.select_all(action='DESELECT')
for o in model_objects:o.select_set(True)
bpy.context.view_layer.objects.active=model_objects[0]
bpy.ops.export_scene.gltf(filepath=str(ASSETS/'Tideline R-01.glb'),use_selection=True,export_apply=True)

# Neutral studio for an inspectable Blender source and two product renders.
bpy.ops.mesh.primitive_plane_add(size=200,location=(0,0,-.55));floor=bpy.context.object;floor.name='Studio / floor';floor.data.materials.append(material('Studio slate','263941',.1,.48))
world=bpy.context.scene.world;world.use_nodes=True;world.node_tree.nodes['Background'].inputs[0].default_value=(.23,.29,.34,1);world.node_tree.nodes['Background'].inputs[1].default_value=.45
def area(name,p,power,size,color):
 bpy.ops.object.light_add(type='AREA',location=p);o=bpy.context.object;o.name=name;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.data.color=color;o.rotation_euler=(Vector((0,0,.2))-o.location).to_track_quat('-Z','Y').to_euler()
area('Studio / key',(2,-3,6),1300,5,(.86,.94,1));area('Studio / rim',(-3,2,4),1600,4,(.7,.88,1));area('Studio / warm fill',(4,4,2),1000,3,(1,.79,.57))
bpy.ops.object.camera_add(location=(5,6,4));cam=bpy.context.object;cam.name='Studio / camera';cam.data.type='ORTHO';cam.data.ortho_scale=5.3;cam.rotation_euler=(Vector((0,0,.15))-cam.location).to_track_quat('-Z','Y').to_euler()
scene=bpy.context.scene;scene.camera=cam;scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True;scene.render.resolution_x=1440;scene.render.resolution_y=1080;scene.render.resolution_percentage=100
scene.view_settings.view_transform='AgX';scene.render.image_settings.file_format='PNG';scene.render.film_transparent=False
scene['Design']='Original Tideline R-01 coastal sport jet ski; game X right, Y up, Z bow.'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'source'/'blender'/'Tideline R-01.blend'))
scene.render.filepath=str(ROOT/'source'/'blender'/'Tideline R-01 rear.png');bpy.ops.render.render(write_still=True)
cam.location=(4,-6,3.4);cam.rotation_euler=(Vector((0,0,.2))-cam.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(ROOT/'source'/'blender'/'Tideline R-01 front.png');bpy.ops.render.render(write_still=True)
