"""Original panelized performance cars, built in Blender; meters, Z up, nose -Y."""
import bpy, math, pathlib
from mathutils import Vector
ROOT=pathlib.Path(__file__).resolve().parents[1];OUT=ROOT/'public/models';OUT.mkdir(parents=True,exist_ok=True)
(ROOT/'source/models').mkdir(parents=True,exist_ok=True)
def mat(name,color,metal=0,rough=.4):
 m=bpy.data.materials.new(name);m.diffuse_color=(*color,1);m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 if name=='paint':p.inputs['Coat Weight'].default_value=.8;p.inputs['Coat Roughness'].default_value=.16
 return m
def mesh(name,verts,faces,m,bevel=0):
 data=bpy.data.meshes.new(name);data.from_pydata(verts,[],faces);data.update();o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);o.data.materials.append(m)
 for p in data.polygons:p.use_smooth=True
 if bevel:
  mod=o.modifiers.new('Edge radii','BEVEL');mod.width=bevel;mod.segments=3
  mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o
def box(name,loc,scale,m,bevel=.02):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.scale=scale;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(m)
 if bevel:
  mod=o.modifiers.new('Formed edges','BEVEL');mod.width=bevel;mod.segments=3
  mod=o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return o
def cyl(name,loc,r,depth,m,axis='X',vertices=32):
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=r,depth=depth,location=loc,rotation=(0,math.pi/2,0) if axis=='X' else (math.pi/2,0,0));o=bpy.context.object;o.name=name;o.data.materials.append(m)
 for p in o.data.polygons:p.use_smooth=True
 return o
def torus(name,loc,major,minor,m):
 bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=48,minor_segments=12,location=loc,rotation=(0,math.pi/2,0));o=bpy.context.object;o.name=name;o.data.materials.append(m)
 for p in o.data.polygons:p.use_smooth=True
 return o
def beam(name,a,b,r,m):
 d=Vector(b)-Vector(a);bpy.ops.mesh.primitive_cylinder_add(vertices=10,radius=r,depth=d.length,location=(Vector(a)+Vector(b))/2);o=bpy.context.object;o.name=name;o.rotation_mode='QUATERNION';o.rotation_quaternion=d.to_track_quat('Z','Y');o.data.materials.append(m);return o
for kind in ['coupe','sedan','hatch']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 paint=mat('paint',(.24,.32,.29),.72,.26);black=mat('carbon',(.022,.026,.03),.25,.34);rubber=mat('rubber',(.015,.017,.019),0,.84);silver=mat('alloy',(.44,.48,.51),.94,.23);brake=mat('brakes',(.22,.24,.25),.85,.45);red=mat('caliper',(.65,.06,.025),.4,.3);glass=mat('glass',(.10,.17,.2),.42,.11);interior=mat('interior',(.025,.026,.027),0,.9);white=mat('headlight',(.87,.95,1),.1,.18);tail=mat('taillight',(.45,.005,.008),.3,.2)
 for m,col,power in [(white,(.85,.93,1),3),(tail,(1,.012,.006),2)]:
  p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Emission Color'].default_value=(*col,1);p.inputs['Emission Strength'].default_value=power
 length={'coupe':4.65,'sedan':4.95,'hatch':4.15}[kind];L=length/2;W={'coupe':.99,'sedan':.96,'hatch':.92}[kind];rear={'coupe':1.36,'sedan':1.49,'hatch':1.23}[kind];front=-rear
 roofheight={'coupe':1.35,'sedan':1.48,'hatch':1.50}[kind];roofback={'coupe':.57,'sedan':.76,'hatch':1.10}[kind]
 def width(y):return W*(.92+.08*math.sin(math.pi*(y+L)/length))
 def top(y):return .94+.09*math.cos(y/length*math.pi)+(.035 if kind=='sedan' else 0)
 # Segmented sheet metal surfaces, with enough topology for localized dents.
 for name,ya,yb in [('hood',-L+.06,-.72),('deck',roofback+.15,L-.06)]:
  verts=[];faces=[];nx=18;ny=22
  for j in range(ny+1):
   y=ya+(yb-ya)*j/ny
   for i in range(nx+1):
    u=i/nx*2-1;verts.append((u*width(y),y,top(y)-.075*abs(u)**3+.022*math.cos(u*math.pi/2)))
  for j in range(ny):
   for i in range(nx):
    a=j*(nx+1)+i;faces.append((a,a+1,a+nx+2,a+nx+1))
  mesh('panel_'+name,verts,faces,paint)
 for side in [-1,1]:
  for name,ya,yb in [('front_fender',-L,-.66),('door',-.65,.8),('rear_fender',.81,L)]:
   verts=[];faces=[];nx=34;ny=8
   for i in range(nx+1):
    y=ya+(yb-ya)*i/nx;bottom=.37
    for wy in [front,rear]:
     d=abs(y-wy)
     if d<.415:bottom=max(bottom,.39+math.sqrt(max(0,.415**2-d*d)))
    for j in range(ny+1):
     t=j/ny;z=bottom+(top(y)-.075-bottom)*t;verts.append((side*(width(y)-.032*math.sin(t*math.pi)),y,z))
   for i in range(nx):
    for j in range(ny):
     a=i*(ny+1)+j;faces.append((a,a+ny+1,a+ny+2,a+1) if side>0 else (a+1,a+ny+2,a+ny+1,a))
   mesh('panel_'+name+str(side),verts,faces,paint)
  box('side_skirt',(side*(W-.025),.08,.36),(.12,1.95,.12),black)
  box('door_handle',(side*(W+.012),.55,.88),(.035,.21,.035),silver,.012)
  beam('mirror_arm',(side*.81,-.61,1.11),(side*1.07,-.66,1.1),.025,black)
  box('panel_mirror'+str(side),(side*1.1,-.67,1.12),(.22,.23,.12),paint,.055)
 # Cabin: actual glazing, roof, pillars, trim, interior visible through windshield.
 fl=(-.80,-.78,1.0);fr=(.80,-.78,1.0);tl=(-.67,-.19,roofheight);tr=(.67,-.19,roofheight);bl=(-.67,roofback,roofheight-.02);br=(.67,roofback,roofheight-.02);rl=(-.80,roofback+.48,1.0);rr=(.80,roofback+.48,1.0)
 mesh('glass_windshield',[fl,fr,tr,tl],[(0,1,2,3)],glass)
 mesh('glass_rear',[rl,rr,br,bl],[(0,3,2,1)],glass)
 box('panel_roof',(0,(roofback-.19)/2,roofheight+.01),(1.38,roofback+.23,.065),paint,.08)
 for side in [-1,1]:
  A=(side*.80,-.73,1.0);B=(side*.67,-.15,roofheight-.02);C=(side*.67,roofback-.02,roofheight-.04);D=(side*.80,roofback+.4,1.0)
  mesh('glass_side'+str(side),[A,B,C,D],[(0,1,2,3)],glass)
  for a,b in [(A,B),(B,C),(C,D),(D,A)]:beam('window_trim',a,b,.023,black)
  for a,b in [(fl,tl),(fr,tr),(bl,rl),(br,rr)]:beam('pillar',a,b,.035,paint)
  beam('B_pillar',(side*.78,.31,1.0),(side*.67,.31,roofheight),.045,black)
  for y in ([0,.68] if kind=='sedan' else [0]):
   box('seat',(side*.4,y,.67),(.5,.48,.18),interior,.08);o=box('seat_back',(side*.4,y+.22,.93),(.48,.15,.56),interior,.07);o.rotation_euler.x=.12
  box('headrest',(side*.4,.26,1.2),(.25,.15,.17),interior,.06)
 box('dashboard',(0,-.67,.94),(1.55,.34,.14),black,.04);box('center_console',(0,-.04,.69),(.22,.9,.15),black)
 # steering wheel and spokes
 o=torus('steering',(-.4,-.5,1.03),.14,.014,black);o.rotation_euler=(math.pi/2-.3,0,0)
 box('undertray',(0,0,.32),(1.64,length-.18,.16),black,.06)
 for end in [-1,1]:
  y=end*(L-.07)
  box('panel_bumper'+str(end),(0,y,.62),(W*1.96,.19,.39),paint,.10)
  box('diffuser' if end==1 else 'splitter',(0,y+end*.07,.38),(W*1.98,.25,.065),black,.025)
  box('grille',(0,y+end*.105,.61),(1.3,.025,.18),black,.04)
  for n in range(18):box('grille_slat',(-.62+n*.073,y+end*.12,.61),(.012,.025,.145),silver,.002)
  for side in [-1,1]:
   box('lamp_housing',(side*.68,y+end*.08,.86),(.46,.09,.12),black,.025)
   box('light_strip',(side*.68,y+end*.133,.87),(.42,.016,.028),white if end==-1 else tail,.009)
  box('license_plate',(0,y+end*.14,.69),(.36,.02,.085),silver,.008)
 for side in [-1,1]:
  cyl('exhaust',(side*.67,L+.04,.44),.07,.19,black,'Y');cyl('exhaust_rim',(side*.67,L+.145,.44),.075,.02,silver,'Y')
 # Wheels have independent roots for suspension/steering/spin.
 for side in [-1,1]:
  for pos,wy in [('F',front),('R',rear)]:
   before=set(bpy.context.scene.objects);x=side*(W-.04);z=.38
   torus('tire',(x,wy,z),.278,.097,rubber)
   for dx in [-.075,-.027,.027,.075]:torus('tread_groove',(x+dx,wy,z),.37,.006,black)
   for n in range(40):
    a=n*math.tau/40;o=box('tread',(x,wy+math.sin(a)*.371,z+math.cos(a)*.371),(.17,.016,.009),rubber,.002);o.rotation_euler.x=-a
   cyl('rim',(x,wy,z),.265,.19,black)
   torus('rim_lip',(x+side*.107,wy,z),.253,.014,silver)
   cyl('brake_disc',(x+side*.07,wy,z),.21,.02,brake)
   box('brake_caliper',(x+side*.087,wy+.14,z),(.045,.085,.17),red,.025)
   for n in range(10):
    a=n*math.tau/10;beam('wheel_spoke',(x+side*.113,wy+math.sin(a)*.045,z+math.cos(a)*.045),(x+side*.113,wy+math.sin(a+.13)*.239,z+math.cos(a+.13)*.239),.013,silver)
   cyl('hub',(x+side*.125,wy,z),.05,.025,silver)
   parts=set(bpy.context.scene.objects)-before
   root=bpy.data.objects.new('wheel_'+pos+('L' if side<0 else 'R'),None);bpy.context.collection.objects.link(root);root.location=(x,wy,z)
   for o in parts:o.parent=root;o.matrix_parent_inverse=root.matrix_world.inverted();o.location-=Vector((x,wy,z)) if False else Vector((0,0,0))
   # Set parent preserving current world transform (depsgraph must be updated first).
   bpy.context.view_layer.update()
   for o in parts:o.matrix_parent_inverse=root.matrix_world.inverted()
 bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'source/models'/f'{kind}.blend'))
 bpy.ops.export_scene.gltf(filepath=str(OUT/f'{kind}.glb'),export_format='GLB',export_apply=True,export_yup=True)
 print('EXPORTED',kind,flush=True)
