"""Original carp anatomy and original painted koi pigment/scale textures.
Blender 5.2: --background --python model-source/build_koi.py [-- --render].
No geometry, textures or source from the reference pond are used.
"""
import bpy, math, sys
import numpy as np
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parent;OUT=ROOT.parent/'public'/'models';OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
scene=bpy.context.scene
def xyz(p):return (p[0],-p[2],p[1])
def image(name,pixels):
 h,w,_=pixels.shape;im=bpy.data.images.new(name,width=w,height=h,alpha=True);im.pixels.foreach_set(pixels.astype(np.float32).flatten());im.filepath_raw=str(OUT/(name+'.png'));im.file_format='PNG';im.save();return im
w=2048;h=1024;u,v=np.meshgrid(np.linspace(0,1,w),np.linspace(0,1,h));angle=v*math.tau;dorsal=(np.cos(angle)+1)/2
organic=np.sin(u*43+np.cos(angle)*7)*.026+np.sin(u*79+np.sin(angle)*11)*.009
row=np.floor(v*24);sx=(u*37+(row%2)*.5)%1;sy=(v*24)%1
ridge=np.exp(-((np.sqrt(((sx-.5)*1.6)**2+((sy-.10)*.9)**2)-.62)/.04)**2)
scales=(u>.14)&(u<.77);bump=np.ones((h,w,4));bump[:,:,:3]=(.45+.24*ridge*scales)[:,:,None];image('koi-scales',bump)
palettes=['kohaku','sanke','showa','ogon','asagi','shiro','ochiba']
for variant,name in enumerate(palettes):
 col=np.zeros((h,w,4));col[:,:,:3]=[.91,.88,.78];col[:,:,3]=1
 red=np.zeros((h,w),bool);black=np.zeros((h,w),bool)
 for j,(cx,width,offset) in enumerate([(.23,.085,.4),(.43,.095,-.3),(.64,.11,.5),(.83,.075,-.2)]):
  red|=((u-cx+organic)**2/width**2+((np.cos(angle-offset)-1)/1.35)**2)<1
 for cx,aa,rr in [(.28,.9,.042),(.54,-.6,.04),(.63,1.0,.052),(.37,-.2,.043)]:
  black|=((u-cx+organic*.5)**2/rr**2+((np.cos(angle-aa)-1)/.68)**2)<1
 if name in ['kohaku','sanke','showa']:col[red,:3]=[.78,.12,.028]
 if name=='sanke':col[black,:3]=[.028,.035,.036]
 if name in ['showa','shiro']:
  bands=(np.sin(u*25+np.sin(angle)*2+organic*20)>.26)&(dorsal>.22)
  col[bands,:3]=[.024,.031,.033]
 if name=='ogon':col[:,:,:3]=[.91,.58,.12]
 if name=='asagi':
  col[dorsal>.42,:3]=[.28,.42,.48];col[(dorsal>.10)&(dorsal<.37),:3]=[.78,.22,.08]
 if name=='ochiba':col[:,:,:3]=[.48,.53,.50];col[red,:3]=[.46,.24,.105]
 # Fine reticulation and a pale ventral surface wrap continuously around the fish.
 shade=1-.12*ridge*scales if name!='asagi' else 1-.40*ridge*scales
 col[:,:,:3]*=shade[:,:,None]
 ventral=np.maximum(0,(.17-dorsal)/.17)*.43
 col[:,:,:3]=col[:,:,:3]*(1-ventral[:,:,None])+np.array([.93,.87,.70])*ventral[:,:,None]
 image(name,col)
def material(name,color,rough=.42):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough;p.inputs['IOR'].default_value=1.24;return m
skin=material('Koi skin',(.9,.87,.76));finmat=material('Fine fin membrane',(.83,.76,.58),.58);eye=material('Dark cornea',(.012,.018,.018),.18);iris=material('Muted golden iris',(.48,.38,.19),.4);lipmat=material('Living lips',(.69,.53,.4),.55)
tex=skin.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(str(OUT/'kohaku.png'));skin.node_tree.links.new(tex.outputs['Color'],skin.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])
def mesh(name,verts,faces,mat,uv=None):
 g=bpy.data.meshes.new(name);g.from_pydata([xyz(p) for p in verts],[],faces);g.update();o=bpy.data.objects.new(name,g);scene.collection.objects.link(o);g.materials.append(mat)
 for p in g.polygons:p.use_smooth=True
 if uv:
  layer=g.uv_layers.new(name='Anatomical coordinates')
  for face in g.polygons:
   for li in face.loop_indices:layer.data[li].uv=uv[g.loops[li].vertex_index]
 return o
profile=[(-.42,.0,.018,.018),(-.34,.004,.042,.033),(-.23,.01,.086,.064),(-.10,.011,.126,.09),(.06,.013,.151,.112),(.19,.01,.146,.110),(.29,.006,.119,.085),(.37,-.009,.077,.063),(.44,-.027,.043,.045),(.48,-.039,.024,.025)]
def interp(x,k):
 for i in range(1,len(profile)):
  if x<=profile[i][0]:
   a=profile[i-1];b=profile[i];l=profile[max(i-2,0)];r=profile[min(i+1,len(profile)-1)];t=(x-a[0])/(b[0]-a[0]);m0=(b[k]-l[k])/(b[0]-l[0]);m1=(r[k]-a[k])/(r[0]-a[0]);return (2*t**3-3*t*t+1)*a[k]+(t**3-2*t*t+t)*m0*(b[0]-a[0])+(-2*t**3+3*t*t)*b[k]+(t**3-t*t)*m1*(b[0]-a[0])
 return profile[-1][k]
pts=[];uv=[];faces=[];nx=120;ns=72
for i in range(nx+1):
 x=-.42+.90*i/nx
 for j in range(ns+1):
  a=j/ns*math.tau;pts.append((x,interp(x,1)+interp(x,2)*math.cos(a),interp(x,3)*math.sin(a)));uv.append(((x+.42)/.90,j/ns))
for i in range(nx):
 for j in range(ns):a=i*(ns+1)+j;faces.append((a,a+1,a+ns+2,a+ns+1))
faces.extend([tuple(range(ns+1)),tuple(nx*(ns+1)+j for j in range(ns,-1,-1))]);mesh('body',pts,faces,skin,uv)
def ellipsoid(name,p,s,mat):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=28,ring_count=16,location=xyz(p));o=bpy.context.object;o.name=name;o.scale=(s[0],s[2],s[1]);o.data.materials.append(mat)
 for f in o.data.polygons:f.use_smooth=True
 return o
def tube(name,points,radius,mat):
 cu=bpy.data.curves.new(name,'CURVE');cu.dimensions='3D';cu.resolution_u=12;cu.bevel_depth=radius;cu.bevel_resolution=3;sp=cu.splines.new('POLY');sp.points.add(len(points)-1)
 for q,p in zip(sp.points,points):q.co=(*xyz(p),1)
 o=bpy.data.objects.new(name,cu);scene.collection.objects.link(o);cu.materials.append(mat);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False);return o
for s in [-1,1]:
 ellipsoid('iris_'+str(s),(.339,.035,s*.066),(.015,.015,.007),iris)
 ellipsoid('eye_'+str(s),(.343,.037,s*.072),(.009,.009,.0035),eye)
 # Opercular seam lies flush against the cheek and ends ventrally.
 seam=[]
 for i in range(24):
  a=-.55+i/23*2.75;seam.append((.251-.014*math.cos(a),.008+.102*math.cos(a),s*.079*math.sin(a)))
 tube('gill_'+str(s),seam,.0018,lipmat)
 for k in range(2):
  start=(.45-k*.035,-.047,s*(.026+k*.014));points=[]
  for i in range(16):
   t=i/15;points.append((start[0]-.04*t,start[1]-.055*t+.012*t*t,start[2]+s*.029*t))
  tube('barbel_'+str(s)+'_'+str(k),points,.0015,lipmat)
# A real dark mouth opening with a small movable lip rim.
ellipsoid('oral_cavity',(.480,-.039,0),(.008,.016,.020),eye)
ring=[(.489,-.039+.018*math.cos(i*math.tau/48),.023*math.sin(i*math.tau/48)) for i in range(49)];tube('mouth',ring,.0036,lipmat)
def fin(name,root,edge):
 verts=[];faces=[];rows=len(root);nv=15
 for i in range(rows):
  for j in range(nv+1):
   t=j/nv;p=Vector(root[i]).lerp(Vector(edge[i]),t);p.z+=.003*math.sin(t*math.pi)*math.sin(i*1.4);verts.append(p)
 for i in range(rows-1):
  for j in range(nv):a=i*(nv+1)+j;faces.append((a,a+nv+1,a+nv+2,a+1))
 mesh(name,verts,faces,finmat)
 # Fin rays are fine geometry, distinct from broad opaque triangular fins.
 rayverts=[];rayfaces=[]
 for i in range(rows):
  a=Vector(root[i]);b=Vector(edge[i]);d=b-a;side=d.cross(Vector((1,0,0)))
  if side.length<.01:side=d.cross(Vector((0,1,0)))
  side.normalize();n=len(rayverts)
  for j in range(12):
   t=j/11;center=a.lerp(b,t);thick=.0012*(1-t)+.00035
   rayverts.extend([center-side*thick,center+side*thick])
   if j:rayfaces.append((n+(j-1)*2,n+j*2,n+j*2+1,n+(j-1)*2+1))
 mesh(name+'_rays',rayverts,rayfaces,lipmat)
root=[];edge=[]
for i in range(28):
 t=i/27;x=.20-.56*t;y=interp(x,1)+interp(x,2)*.96;root.append((x,y,0));edge.append((x-.035,y+.115*math.sin(math.pi*t)**.65*(1-.45*t),0))
fin('dorsal',root,edge)
root=[];edge=[]
for i in range(25):
 t=i/24;y=(t-.5)*.044;root.append((-.409,y,0));edge.append((-.62+.075*math.sin(math.pi*t)**.65,(t-.5)*.28,0))
fin('caudal',root,edge)
for s in [-1,1]:
 for name,x,y,z,length,width in [('pectoral',.22,-.055,.08,.16,.19),('pelvic',-.09,-.10,.048,.105,.10)]:
  root=[];edge=[]
  for i in range(20):
   t=i/19;a=.05+t*1.32;root.append((x-.013*t,y,s*z));edge.append((x-length*(.15+t),y-.022*math.sin(math.pi*t),s*(z+width*math.sin(math.pi*t)**.6)))
  fin(name+'_'+str(s),root,edge)
root=[];edge=[]
for i in range(16):
 t=i/15;x=-.21-.16*t;y=interp(x,1)-interp(x,2);root.append((x,y,0));edge.append((x-.026,y-.067*math.sin(math.pi*t),0))
fin('anal',root,edge)
bpy.ops.object.select_all(action='SELECT');bpy.ops.export_scene.gltf(filepath=str(OUT/'koi.glb'),export_format='GLB',use_selection=True,export_animations=False)
scene.render.engine='CYCLES';scene.cycles.samples=40;scene.cycles.use_denoising=True;scene.render.resolution_x=1400;scene.render.resolution_y=900;scene.render.resolution_percentage=100;scene.world.color=(.15,.18,.20)
def aim(o,p):o.rotation_euler=(Vector(xyz(p))-o.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add(location=xyz((1.4,1.7,2.3)));cam=bpy.context.object;cam.data.type='ORTHO';cam.data.ortho_scale=1.7;aim(cam,(-.05,0,0));scene.camera=cam
for pos,power,size in [((0,2,2),70,3),((-2,1,-1),40,2)]:
 bpy.ops.object.light_add(type='AREA',location=xyz(pos));o=bpy.context.object;o.data.energy=power;o.data.size=size;aim(o,(0,0,0))
bpy.ops.file.pack_all()
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'original-koi.blend'))
if '--render' in sys.argv:scene.render.filepath=str(ROOT/'koi-study.png');bpy.ops.render.render(write_still=True)
print('Original koi and seven original painted textures exported.')
