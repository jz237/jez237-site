"""Detailed Lysmata amboinensis, authored mesh + exportable articulated skeleton.

Run with Blender 5.2 --background --python this_file.py [-- --render].
Coordinates below are aquarium coordinates: +X head, +Y up, +Z left.
Five pairs of pereiopods (ten legs); six visible sensory filaments comprise
two antennae and the four branches of paired biramous antennules.
"""
import bpy, math, json, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent/'assets'/'invertebrates'; OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
def xyz(p): return Vector((p[0],-p[2],p[1]))
V=[]; F=[]; C=[]; W=[]; bones={}
amber=(.72,.38,.115,1); pale=(.96,.75,.42,1); white=(.92,.95,1,1); red=(.76,.018,.022,1)
def bone(name,a,b,parent=None): bones[name]=(a,b,parent)
bone('body',(0,.23,0),(.25,.23,0))
def mesh(points,faces,colors,weights):
 offset=len(V); V.extend(xyz(p) for p in points); F.extend(tuple(offset+i for i in f) for f in faces)
 C.extend(colors); W.extend(weights)
def ellipsoid(center,radii,color,bn,nu=32,nv=16):
 pts=[];cols=[];faces=[]
 for i in range(nv+1):
  t=math.pi*i/nv
  for j in range(nu):
   a=math.tau*j/nu;pts.append(tuple(center[k]+radii[k]*q for k,q in enumerate((math.cos(t),math.sin(t)*math.cos(a),math.sin(t)*math.sin(a)))))
   cols.append(color)
 for i in range(nv):
  for j in range(nu):
   a=i*nu+j;b=i*nu+(j+1)%nu;faces.append((a,b,b+nu,a+nu))
 mesh(pts,faces,cols,[{bn:1}]*len(pts))
def tube(points,radii,color,bn,sides=8,weights=None):
 pts=[];cols=[];faces=[]
 for i,p in enumerate(points):
  tangent=Vector(points[min(i+1,len(points)-1)])-Vector(points[max(i-1,0)])
  tangent.normalize();side=tangent.cross(Vector((0,1,0)))
  if side.length<.01:side=tangent.cross(Vector((0,0,1)))
  side.normalize();up=side.cross(tangent).normalized()
  for j in range(sides):
   a=math.tau*j/sides;pts.append(Vector(p)+radii[i]*(math.cos(a)*side+math.sin(a)*up));cols.append(color)
  if i:
   for j in range(sides):
    a=(i-1)*sides+j;b=(i-1)*sides+(j+1)%sides;faces.append((a,b,b+sides,a+sides))
 faces.extend([tuple(range(sides-1,-1,-1)),tuple((len(points)-1)*sides+j for j in range(sides))])
 mesh(pts,faces,cols,[weights[i//sides] if weights else {bn:1} for i in range(len(pts))])
def shell(x0,x1,y0,y1,r0,r1,w0,w1,bn,segment=False):
 pts=[];cols=[];faces=[];nx=18;ns=64
 for i in range(nx+1):
  t=i/nx; x=x0+(x1-x0)*t;y=y0+(y1-y0)*t
  swell=math.sin(math.pi*t)*.012
  for j in range(ns):
   a=math.tau*j/ns;rr=r0+(r1-r0)*t+swell;ww=w0+(w1-w0)*t+swell*.6
   pts.append((x,y+rr*math.cos(a),ww*math.sin(a)))
   dorsal=abs(math.atan2(math.sin(a),math.cos(a)))
   col=white if dorsal<.19 else red if dorsal<1.2 else amber
   # Translucent-looking pale lateral shell, fine pigment flecks and a seam lip.
   shade=.97+.03*math.sin(i*17+j*23)
   if segment and i>nx-2:shade*=.80
   cols.append(tuple(c*shade for c in col[:3])+(1,))
 for i in range(nx):
  for j in range(ns):
   a=i*ns+j;b=i*ns+(j+1)%ns;faces.append((a,a+ns,b+ns,b))
 faces.extend([tuple(range(ns-1,-1,-1)),tuple(nx*ns+j for j in range(ns))])
 mesh(pts,faces,cols,[{bn:1}]*len(pts))
# A slender cephalothorax with a raised longitudinal white dorsal band.
shell(-.12,.34,.25,.23,.115,.079,.085,.065,'body')
abdomen=[(-.12,.25,.102,.082),(-.24,.245,.099,.078),(-.35,.225,.085,.071),(-.45,.19,.070,.060),(-.54,.145,.053,.048),(-.61,.12,.037,.036),(-.67,.12,.021,.025)]
for i in range(6):
 a,b=abdomen[i:i+2];bn=f'abdomen_{i}';bone(bn,a[:2]+(0,),b[:2]+(0,),'body' if i==0 else f'abdomen_{i-1}')
 shell(a[0],b[0],a[1],b[1],a[2],b[2],a[3],b[3],bn,True)
 # Overlapping pleural skirts along each segment, not detached beads.
 for s in [-1,1]:
  ellipsoid(((a[0]+b[0])*.5,(a[1]+b[1])*.5-.025,s*(a[3]+b[3])*.42),(.065,.056,.02),pale,bn,24,10)
# Serrated rostrum and its tiny dorsal teeth.
tube([(.30,.27,0),(.40,.275,0),(.51,.265,0)],[.019,.012,.0007],red,'body',10)
for i in range(8):
 x=.33+i*.021;tube([(x,.279,0),(x+.015,.303-i*.0015,0)],[.003,.0004],pale,'body',5)
for s in [-1,1]:
 bn=f'eye_{s}';p=(.32,.25,s*.062);bone(bn,p,(.35,.278,s*.098),'body')
 tube([p,(.35,.278,s*.098)],[.014,.012],amber,bn,12)
 ellipsoid((.355,.283,s*.104),(.023,.023,.021),(.004,.006,.008,1),bn,28,16)
 # A small cool reflection is modeled separately from the black cornea.
 ellipsoid((.362,.296,s*.109),(.005,.005,.005),(.42,.55,.62,1),bn,12,8)
# Ten jointed pereiopods. The two anterior pairs carry tiny chelae.
leg_meta=[]
for j in range(5):
 for side,s in enumerate([-1,1]):
  hip=(.265-j*.079,.188,s*.055)
  knee=(hip[0]+(.12-j*.035),.137,s*(.16+j*.003))
  ankle=(hip[0]+(.16-j*.065),.055,s*(.23+j*.006))
  foot=(hip[0]+(.20-j*.085),.005,s*(.265+j*.01))
  pts=[hip,knee,ankle,foot];names=[]
  for k in range(3):
   bn=f'leg_{j}_{side}_{k}';names.append(bn);bone(bn,pts[k],pts[k+1],'body' if k==0 else names[k-1])
   tube([pts[k],pts[k+1]],[.0105-k*.002,.008-k*.002],pale if j<2 else amber,bn,10)
   ellipsoid(pts[k],(.012-k*.002,)*3,pale,bn,12,8)
  if j<2:
   for fork in [-1,1]:
    tube([foot,(foot[0]+.035,foot[1]+.012,s*(abs(foot[2])+fork*.016)),(foot[0]+.049,foot[1]+.01,foot[2])],[.007,.004,.001],white,names[-1],7)
  else:
   tube([foot,(foot[0]-.015,.001,foot[2]+s*.015)],[.004,.0007],pale,names[-1],6)
  leg_meta.append({'bones':names,'points':pts,'pair':j,'side':side})
# White feeding maxillipeds, pleopods, and fine setae.
for side,s in enumerate([-1,1]):
 bn=f'maxilliped_{side}';p=(.29,.18,s*.024);bone(bn,p,(.41,.10,s*.06),'body')
 tube([p,(.36,.13,s*.045),(.42,.09,s*.062)],[.009,.007,.002],white,bn,9)
 for k in range(8):
  x=.35+k*.008;tube([(x,.128-k*.004,s*.05),(x+.014,.11-k*.004,s*.079)],[.0015,.0002],white,bn,5)
 for i in range(5):
  a=abdomen[i];bn=f'pleopod_{i}_{side}';p=(a[0]-.025,a[1]-.05,s*.036);bone(bn,p,(p[0]+.03,p[1]-.05,s*.066),f'abdomen_{i}')
  ellipsoid((p[0]+.015,p[1]-.029,s*.055),(.028,.033,.006),pale,bn,20,10)
  for k in range(7):
   x=p[0]-.014+k*.009;tube([(x,p[1]-.053,s*.055),(x-.008,p[1]-.07,s*.065)],[.0012,.0002],pale,bn,5)
# Five lobes form the tail fan: central telson and paired uropods.
for j in range(-2,3):
 bn=f'tail_{j}';p=(-.657,.12,0);tip=(-.82+abs(j)*.025,.115,j*.052);bone(bn,p,tip,'abdomen_5')
 pts=[];cols=[];faces=[]
 for i in range(17):
  t=i/16;center=Vector(p).lerp(Vector(tip),t);half=.026*math.sin(math.pi*t)**.55+.001
  for k in range(9):
   u=k/8*2-1;pts.append((center.x,center.y+.006*(1-u*u),center.z+half*u))
   cols.append(white if t>.67 and abs(u)<.85 else red)
  if i:
   for k in range(8):a=(i-1)*9+k;faces.append((a,a+9,a+10,a+1))
 mesh(pts,faces,cols,[{bn:1}]*len(pts))
 for k in range(7):
  z=tip[2]+(k-3)*.007;tube([(tip[0]+.008,.115,z),(tip[0]-.015,.115,z+(k-3)*.002)],[.0012,.00015],white,bn,5)
# Six tapering sensory filaments, each with an eight-bone flexible chain.
antenna_meta=[]
for a in range(6):
 s=-1 if a%2==0 else 1;kind=a//2;start=Vector((.355,.23+kind*.013,s*(.020+kind*.014)))
 length=[1.42,1.02,.76][kind];points=[]
 for k in range(65):
  t=k/64
  points.append(start+Vector((length*t*(.74 if kind==0 else .9),.15*t+.36*t*t+kind*.065*t,s*(.58+kind*.06)*t*t)))
 names=[]
 for b in range(8):
  bn=f'antenna_{a}_{b}';bone(bn,points[b*8],points[(b+1)*8],'body' if b==0 else names[-1]);names.append(bn)
 weights=[]
 for k in range(65):
  u=k/8;idx=min(7,int(u));t=u-idx
  weights.append({names[idx]:1} if idx==7 else {names[idx]:1-t,names[idx+1]:t})
 tube(points,[.0045*(1-k/64)**.7+.0004 for k in range(65)],white,'body',8,weights)
 antenna_meta.append({'bones':names,'length':length})
# Build one indexed, vertex-colored skin; the rig keeps per-animal timing cheap.
geo=bpy.data.meshes.new('Cleaner shrimp anatomy');geo.from_pydata(V,[],F);geo.update()
obj=bpy.data.objects.new('Lysmata_amboinensis',geo);scene.collection.objects.link(obj)
color=geo.color_attributes.new(name='Pigment',type='FLOAT_COLOR',domain='POINT')
for i,c in enumerate(C):color.data[i].color=c
for poly in geo.polygons:poly.use_smooth=True
mat=bpy.data.materials.new('Submerged amber shell and red-white pigment');mat.use_nodes=True
p=mat.node_tree.nodes.get('Principled BSDF');p.inputs['Roughness'].default_value=.38;p.inputs['IOR'].default_value=1.2
attr=mat.node_tree.nodes.new('ShaderNodeVertexColor');attr.layer_name='Pigment';mat.node_tree.links.new(attr.outputs['Color'],p.inputs['Base Color'])
obj.data.materials.append(mat)
arm=bpy.data.armatures.new('Cleaner shrimp articulated anatomy');rig=bpy.data.objects.new('Cleaner_shrimp_rig',arm);scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
for name,(a,b,parent) in bones.items():
 eb=arm.edit_bones.new(name);eb.head=xyz(a);eb.tail=xyz(b)
 if parent:eb.parent=arm.edit_bones[parent]
bpy.ops.object.mode_set(mode='OBJECT')
for name in bones:obj.vertex_groups.new(name=name)
for i,weights in enumerate(W):
 for name,w in weights.items():
  if w>0:obj.vertex_groups[name].add([i],w,'REPLACE')
modifier=obj.modifiers.new('Articulated anatomy','ARMATURE');modifier.object=rig;obj.parent=rig
bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);rig.select_set(True);bpy.context.view_layer.objects.active=obj
bpy.ops.export_scene.gltf(filepath=str(OUT/'cleaner-shrimp.glb'),export_format='GLB',use_selection=True,export_yup=True,export_animations=False,export_apply=False,export_materials='EXPORT')
metadata={'species':'Lysmata amboinensis','bodyLength':1.33,'walkingLegPairs':5,'visibleSensoryFilaments':6,'legs':leg_meta,'antennae':antenna_meta,'bones':list(bones),'vertices':len(V),'faces':len(F),'source':'Blender 5.2 procedural anatomical model; motion parameters are illustrative'}
(OUT/'cleaner-shrimp.json').write_text(json.dumps(metadata,indent=2)+'\n')
# Save an editable studio setup and render a detailed preview without external assets.
scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.render.resolution_x=1500;scene.render.resolution_y=1050;scene.render.resolution_percentage=100
scene.world.color=(.08,.12,.16);scene.view_settings.view_transform='AgX'
def aim(o,p):o.rotation_euler=(xyz(p)-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=xyz((1.75,1.5,2.35)));cam=bpy.context.object;cam.name='Macro anatomy view';aim(cam,(.40,.38,0));cam.data.type='ORTHO';cam.data.ortho_scale=3.2;scene.camera=cam
for name,loc,power,size,color in [('Softbox',(0,2,2),130,3,(.75,.88,1)),('Warm rim',(-1,1,-1),90,2,(1,.65,.4)),('Antenna rim',(1,2,-2),110,2,(.4,.65,1))]:
 bpy.ops.object.light_add(type='AREA',location=xyz(loc));light=bpy.context.object;light.name=name;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.data.color=color;aim(light,(0,.2,0))
bpy.ops.mesh.primitive_plane_add(size=200,location=xyz((0,-.006,0)));ground=bpy.context.object
gm=bpy.data.materials.new('Midnight studio');gm.diffuse_color=(.012,.025,.04,1);gm.use_nodes=True;gm.node_tree.nodes.get('Principled BSDF').inputs['Base Color'].default_value=(.012,.025,.04,1);gm.node_tree.nodes.get('Principled BSDF').inputs['Roughness'].default_value=.7;ground.data.materials.append(gm)
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'cleaner-shrimp.blend'))
if '--render' in sys.argv:
 scene.render.filepath=str(ROOT/'cleaner-shrimp-render.png');bpy.ops.render.render(write_still=True)
print(json.dumps({'vertices':len(V),'bones':len(bones),'output':str(OUT/'cleaner-shrimp.glb')}))
