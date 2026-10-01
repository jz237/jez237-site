"""Imperial Star: a separately modelled 122 m concept tall ship.
blender -b --factory-startup --python build-imperial-star.py -- <repo> <outputs>
Uses the shared mesh primitives/export format from build-schooner.py.
X bow, Y starboard, Z up in Blender; browser swaps Y/Z.
"""
from pathlib import Path
base=Path(__file__).with_name('build-schooner.py').read_text().replace("if mat in ['ROPE','WOOD']:\n  layer=ob.data.uv_layers.new(name='Surface coordinates')","if mat in ['ROPE','WOOD'] and not cloth_uv:\n  layer=ob.data.uv_layers.new(name='Surface coordinates')")
exec(compile(base.split('def beam(x):')[0],str(Path(__file__).with_name('build-schooner.py')),'exec'))
import random
rng=random.Random(237)
materials['HULL'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.019,.019,.021,1)
materials['WOOD'].node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value=(.12,.047,.016,1)
# Timber and copper paint in the editable Blender source, matching the browser.
nt=materials['HULL'].node_tree;geo=nt.nodes.new('ShaderNodeNewGeometry');xyz=nt.nodes.new('ShaderNodeSeparateXYZ');nt.links.new(geo.outputs['Position'],xyz.inputs[0]);lt=nt.nodes.new('ShaderNodeMath');lt.operation='LESS_THAN';lt.inputs[1].default_value=-.12;nt.links.new(xyz.outputs['Z'],lt.inputs[0]);mix=nt.nodes.new('ShaderNodeMixRGB');mix.inputs[1].default_value=(.019,.019,.021,1);mix.inputs[2].default_value=(.15,.043,.018,1);nt.links.new(lt.outputs[0],mix.inputs[0]);nt.links.new(mix.outputs[0],nt.nodes.get('Principled BSDF').inputs['Base Color'])
SX,SY,SZ=105/47,7.5/3.15,18.5/9.3
def beam(x):
 q=x/SX
 return SZ*(4.65*max(0,1-(max(0,(q+2)/25.5))**2.1)**.7 if q>=-2 else 4.65*(1-.4*min(1,(-2-q)/21.5)**2.4))
def sheer(x):
 q=x/SX;return SY*(2.6+(.0018 if q>0 else .0007)*q*q)
def floor(x,y=0):
 t=clamp((-x-29)/6,0,1);return sheer(x)+.055*SY*(1-(y/max(beam(x)*.995,.01))**2)+3*t*t*(3-2*t)
def bottom(x):return -7.5*max(.05,1-(x/(25.5*SX))**2)**.5
def hull(x,v,side):
 q=x/SX;a=v*math.pi/2;r=2.7*SX*clamp((q-18.5)/5,0,1)**3*(1-v)
 return (x-r,side*beam(x)*math.sin(a)**.78,bottom(x)+(sheer(x)-bottom(x))*(1-math.cos(a)))
def curve(name,points,r,mat='ROPE',n=6,group='hull'):
 # Connected parallel-frame tubes with smooth bends, avoiding sphere joints.
 verts=[];faces=[];uv=[];travel=0;ring=n+1
 for i,p in enumerate(points):
  p=Vector(p);d=(Vector(points[min(i+1,len(points)-1)])-Vector(points[max(0,i-1)])).normalized()
  if i:travel+=(p-Vector(points[i-1])).length
  up=Vector((0,0,1)) if abs(d.z)<.95 else Vector((1,0,0));s=d.cross(up).normalized();t=d.cross(s)
  verts.extend(p+r*(s*math.cos(k*math.tau/n)+t*math.sin(k*math.tau/n)) for k in range(ring))
  uv.extend((travel/(.12 if mat=='ROPE' else 2.0),k/n*math.tau*r/(.10 if mat=='ROPE' else .16)) for k in range(ring))
  if i:
   a=(i-1)*ring;b=i*ring
   for k in range(n):faces.append((a+k,a+k+1,b+k+1,b+k))
 ob=mesh(name,verts,faces,mat,True,uv=uv,group=group);ob['tube_radius']=r
 return ob
def rope(name,a,b,r=.045,sag=.2,group=None):
 pts=[tuple(a[k]+(b[k]-a[k])*t-(sag*math.sin(math.pi*t) if k==2 else 0) for k in range(3)) for t in [j/8 for j in range(9)]]
 ob=curve(name,pts,r,'ROPE',5,group or ('rig' if r<.065 else 'hull'))
 if r<.065 and group is None:
  ob['browser_skip']=True
  for a,b in zip(pts,pts[1:]):rig.append([a[0],a[2],a[1],b[0],b[2],b[1],r,MAT['ROPE']])
 return ob
def rosette(name,c,scale,side=1,axis='y'):
 for petal in range(7):
  a=petal*math.tau/7
  pts=[]
  for j in range(17):
   t=j*math.tau/16;rr=scale*(.42+.32*math.cos(t));u=rr*math.cos(a)+scale*.22*math.cos(t+a);v=rr*math.sin(a)+scale*.22*math.sin(t+a)
   pts.append((c[0]+u,c[1]+side*.06*math.sin(t),c[2]+v) if axis=='y' else (c[0]+side*.06*math.sin(t),c[1]+u,c[2]+v))
  curve(name,pts,.023*scale,'BRASS',6)
def gold_scroll(c,length,side,axis='y'):
 pts=[]
 for j in range(40):
  t=j/39;a=t*math.tau*1.5;radius=length*.21*(1-t)+.04
  u=length*.33+radius*math.cos(a);v=radius*math.sin(a)
  pts.append((c[0]+u,c[1]+side*.065,c[2]+v) if axis=='y' else (c[0]+side*.065,c[1]+u,c[2]+v))
 curve('Carved acanthus scroll',pts,.028,'BRASS',6)
 for j in range(6):
  p=pts[5+j*5];ellipsoid('Gilded leaf',p,(.15,.035,.055) if axis=='y' else (.035,.15,.055),'BRASS',10,6)

# Full, round bilges and timber keel. No modern yacht fin or bulb.
for side in [-1,1]:grid('Black timber hull',lambda u,v:hull(-52.5+105*u,v,side),240,42,'HULL',flip=side==1)
grid('Rounded deep transom',lambda u,v:(-52.5,hull(-52.5,v,1)[1]*(u*2-1),hull(-52.5,v,1)[2]),32,30,'HULL',flip=True)
grid('Cambered weather deck',lambda u,v:(-52.5+105*u,(v*2-1)*beam(-52.5+105*u)*.995,floor(-52.5+105*u,(v*2-1)*beam(-52.5+105*u)*.995)),280,64,'TEAK')
for side in [-1,1]:
 grid('Closed raised quarterdeck side',lambda u,v:(-52.5+23.5*u,side*beam(-52.5+23.5*u),sheer(-52.5+23.5*u)+(floor(-52.5+23.5*u,beam(-52.5+23.5*u))-sheer(-52.5+23.5*u))*v),80,8,'HULL',flip=side==1)
grid('Raised quarterdeck transom',lambda u,v:(-52.5,beam(-52.5)*(u*2-1),sheer(-52.5)+(floor(-52.5,beam(-52.5)*(u*2-1))-sheer(-52.5))*v),32,8,'HULL',flip=True)
box('Long timber keel',(-3,0,-7.4),(62,.65,.45),'WOOD',.16)
for side in [-1,1]:grid('Broad stern rudder',lambda u,v:(-52.6-2.8*u,side*.24,-1.8-5.6*v),8,10,'WOOD',flip=side<0)
for h in [-6.4,-4.2,-2.0]:tube('Rudder bronze hinge',(-52.62,0,h-.17),(-52.62,0,h+.17),.31,'BRASS',n=12)

# Raised stern gallery, framed windows, gilded rails and individually carved panels.
deck_gun_x=[-25+k*6.4 for k in range(10)]
for side in [-1,1]:
 for k in range(180):
  x=-52.2+k*104.2/180;x1=x+104.2/180
  for offset,r,mat in [(.10,.075,'WOOD'),(.85,.05,'WOOD'),(1.22,.065,'WOOD'),(-.7,.06,'BRASS'),(-2.2,.055,'BRASS'),(-4,.045,'BRASS')]:
   if 0<offset<1 and any(abs((x+x1)/2-g)<.85 for g in deck_gun_x):continue
   def attached(station):
    if offset>0:return(station,side*beam(station)*.992,floor(station)+offset)
    z=sheer(station)+offset;v=math.acos(clamp(1-(z-bottom(station))/(sheer(station)-bottom(station)),0,1))*2/math.pi
    p=hull(station,v,side);return(p[0],p[1]+side*r*.45,p[2])
   tube('Moulded continuous wale',attached(x),attached(x1),r,mat,n=6)
 for k in range(88):
  x=-51.8+k*103/88;y=side*beam(x)*.994;h=floor(x)
  if any(abs(x-g)<.70 for g in deck_gun_x):continue
  tube('Turned bulwark baluster',(x,y,h+.1),(x,y,h+1.21),.064,'WOOD',r1=.045,n=8)
  ellipsoid('Baluster capital',(x,y,h+.94),(.10,.10,.10),'BRASS',10,6)
 # Two bands of framed gunports, forty visible bronze guns on working carriages.
 for row in [2.65,4.55]:
  for k in range(20):
   x=-45+k*4.5;z=row+.14*(x/45)**2;hv=math.acos(clamp(1-(z-bottom(x))/(sheer(x)-bottom(x)),0,1))*2/math.pi
   shell=hull(x,hv,side);x=shell[0];y=shell[1]+side*.04
   box('Deep dark gunport',(x,y,z),(1.06,.09,.74),'TRIM',.035)
   for dx in [-.55,.55]:box('Gunport gilt vertical frame',(x+dx,y+side*.065,z),(.045,.04,.84),'BRASS',.012)
   for dz in [-.41,.41]:box('Gunport gilt horizontal frame',(x,y+side*.065,z+dz),(1.14,.04,.04),'BRASS',.012)
   if row==2.65 and k%2==0:
    tube('Bronze cannon barrel',(x,y-side*.7,z-.08),(x,y+side*.75,z-.06),.155,'BRASS',r1=.125,n=16)
    tube('Cannon muzzle',(x,y+side*.72,z-.06),(x,y+side*.78,z-.06),.102,'TRIM',n=12)
    for t in [0,.32,.65]:torus('Cast barrel reinforcing ring',(x,y+side*t,z-.065),.148,.014,'BRASS','y',16,6)
   else:box('Upper gunport lid',(x,y+side*.10,z),(.96,.06,.65),'WOOD',.025)
 for k in range(23):
  x=-47+k*3.9;y=side*beam(x)*.997;h=sheer(x)-.32
  gold_scroll((x,y,h),1.35,side)
 # Stern quarter galleries follow the round hull rather than floating boxes.
 for row in [7.7,9.5]:
  for k in range(6):
   x=-50.5+k*1.55;y=side*(beam(x)+.15)
   box('Stern side window shadow',(x,y,row),(1.05,.1,1.20),'TRIM',.06)
   box('Stern side glass',(x,y+side*.055,row),(.91,.025,1.05),'GLASS',.02)
   for dz in [-.61,.61]:box('Gilded window cornice',(x,y+side*.11,row+dz),(1.16,.08,.075),'BRASS',.014)
   for dx in [-.53,0,.53]:box('Gilded window mullion',(x+dx,y+side*.1,row),(.045,.08,1.17),'BRASS',.01)
   box('Window transom bar',(x,y+side*.10,row),(.98,.07,.04),'BRASS',.01)

stern=-52.62
box('Gallery timber structure',(-48.1,0,7.7),(8.7,11.35,3.5),'WOOD',.18)
for h in [7.5,9.45,11.3]:
 box('Stern carved cornice',(stern,0,h),(.22,12.1,.18),'BRASS',.055)
 for k in range(8):
  z=-5.2+k*1.48
  if h<11:
   box('Stern window recess',(stern-.10,z,h+.7),(.08,1.13,1.28),'TRIM',.05)
   box('Stern glass pane',(stern-.15,z,h+.7),(.02,1.01,1.15),'GLASS',.015)
   for a in [-.53,0,.53]:box('Stern vertical gilded glazing bar',(stern-.20,z+a,h+.7),(.065,.045,1.23),'BRASS',.012)
   for a in [-.60,0,.60]:box('Stern horizontal gilded glazing bar',(stern-.20,z,h+.7+a),(.065,1.12,.045),'BRASS',.012)
for z in [-5.9,5.9]:
 curve('Carved gallery corner',[(stern-.08,z,6.1+j*.2) for j in range(34)],.14,'BRASS',10)
 for h in [7.1,10.8,12.1]:rosette('Stern carved rose',(stern-.26,z,h),.60,-1,'x')
for z in [-4.7,-2.1,.5,3.1]:gold_scroll((stern-.25,z,11.8),2.3,-1,'x')
curve('Stern crown arch',[(stern-.30,6.1*math.cos(math.pi*j/36),11.35+1.8*math.sin(math.pi*j/36)) for j in range(37)],.10,'BRASS',8)
for k in range(7):rosette('Crown rose',(stern-.38,-4.5+k*1.5,12.35+.40*(1-abs(k-3)/3)),.38,-1,'x')

def lettering(text,loc,size,normal):
 data=bpy.data.curves.new(text,'FONT');data.body=text;data.align_x='CENTER';data.size=size;data.extrude=.018;data.bevel_depth=.004;data.resolution_u=3
 ob=bpy.data.objects.new(text,data);bpy.context.collection.objects.link(ob);ob.location=loc;ob.rotation_euler=Vector(normal).to_track_quat('Z','Y').to_euler();ob.scale.x=-1;data.materials.append(materials['BRASS'])
 bpy.context.view_layer.objects.active=ob;ob.select_set(True);bpy.ops.object.convert(target='MESH');ob.select_set(False);groups['hull'].append(ob)
lettering('IMPERIAL STAR',(stern-.4,0,6.9),.64,(-1,0,0))

# Working weather-deck fittings: gratings, belaying pins, coils, capstans, bitts.
for x in [-21,0,22,39]:
 h=floor(x);box('Hatch timber coaming',(x,0,h+.22),(4.2,3.6,.44),'WOOD',.08)
 box('Dark space beneath grating',(x,0,h+.30),(3.8,3.2,.05),'TRIM',.01)
 for z in [-1.5+j*.20 for j in range(16)]:box('Hatch grating bars',(x,z,h+.48),(3.85,.065,.08),'WOOD',.015)
 for a in [-1.8+j*.22 for j in range(17)]:box('Hatch cross lattice',(x+a,0,h+.49),(.055,3.1,.075),'WOOD',.012)
 deck_nav['obstacles'].append({'type':'box','x':x,'z':0,'halfX':2.15,'halfZ':1.85,'name':'Timber hatch'})
for x in [-37,28]:
 h=floor(x);tube('Capstan barrel',(x,0,h),(x,0,h+1.2),.65,'WOOD',n=20);tube('Capstan bronze crown',(x,0,h+1.15),(x,0,h+1.27),.78,'BRASS',n=24)
 for k in range(8):
  a=k*math.tau/8;tube('Capstan working bar',(x,0,h+.94),(x+1.9*math.cos(a),1.9*math.sin(a),h+.94),.06,'WOOD',n=8)
 deck_nav['obstacles'].append({'type':'circle','x':x,'z':0,'radius':2,'name':'Capstan'})
for x in [-42,-12,9,32,46]:
 for side in [-1,1]:
  z=side*min(beam(x)-1.0,6.8);h=floor(x,z)
  box('Pin rail timber',(x,z,h+.82),(2.5,.23,.19),'WOOD',.03)
  deck_nav['obstacles'].append({'type':'box','x':x,'z':z,'halfX':1.3,'halfZ':.32,'name':'Belaying pin rail'})
  for dx in [-1.05,1.05]:tube('Pin rail leg',(x+dx,z,h),(x+dx,z,h+.90),.09,'WOOD',n=8)
  for j in range(7):
   xx=x-1+j/3;tube('Individual belaying pin',(xx,z,h+.57),(xx,z,h+1.03),.035,'WOOD',n=8)
   for ring in range(4):torus('Rope coil',(xx,z+.22*side,h+.08+ring*.055),.22,.032,'ROPE','z',20,5,stretch=1.3)
for side in [-1,1]:
 for x in deck_gun_x:
  z=side*(beam(x)-.9);h=floor(x,z)
  box('Deck gun carriage',(x,z,h+.35),(1.35,.95,.30),'WOOD',.065)
  deck_nav['obstacles'].append({'type':'box','x':x,'z':z,'halfX':.72,'halfZ':.65,'name':'Gun carriage'})
  for dx in [-.45,.45]:
   for dz in [-.5,.5]:tube('Gun truck wheel',(x+dx,z+dz-.045,h+.24),(x+dx,z+dz+.045,h+.24),.23,'WOOD',n=12)
  grid('Weather deck gun barrel',lambda u,v:(x+(.20-.06*v)*math.cos(u*math.tau),z+side*(-.5+1.6*v),h+.71+.07*v+(.20-.06*v)*math.sin(u*math.tau)),24,8,'TRIM',flip=side>0)
  grid('Gun muzzle annulus',lambda u,v:(x+(.102+.038*v)*math.cos(u*math.tau),z+side*1.1,h+.78+(.102+.038*v)*math.sin(u*math.tau)),24,3,'TRIM',flip=side<0)
  grid('Recessed gun bore',lambda u,v:(x+.102*math.cos(u*math.tau),z+side*(1.1-.30*v),h+.78+.102*math.sin(u*math.tau)),24,4,'TRIM',flip=side>0)
  grid('Gun bore dark back',lambda u,v:(x+.102*v*math.cos(u*math.tau),z+side*.80,h+.78+.102*v*math.sin(u*math.tau)),24,3,'TRIM',flip=side<0)
  torus('Gun bronze muzzle band',(x,z+side*1.05,h+.78),.148,.035,'BRASS','y',16,6)
  for dx in [-.88,.88]:
   yy=side*beam(x+dx)*.992;hh=floor(x+dx)
   tube('Gun opening side post',(x+dx,yy,hh+.1),(x+dx,yy,hh+1.21),.075,'WOOD',n=8)

# Helm: turned wooden spokes, brass hubs, binnacle and compass.
for side in [-1,1]:
 cx,cy=4,side*6.3;h=floor(cx,cy)+.25
 for inner in [False,True]:
  def launch(u,v,inner=inner):
   a=u*math.tau;b=v*math.pi/2;rr=math.sin(b);w=1.0 if not inner else .94
   return(cx+3.8*math.cos(a)*rr*w,cy+1.05*math.sin(a)*rr*w,h+1.1*(1-math.cos(b))+(0 if not inner else .10))
  grid('Clinker built ship launch',launch,56,14,'WOOD',flip=inner)
 curve('Launch gunwale',[(cx+3.8*math.cos(a*math.tau/64),cy+1.05*math.sin(a*math.tau/64),h+1.1) for a in range(65)],.065,'WOOD',8)
 for dx in [-2.6,-1.3,0,1.3,2.6]:box('Launch thwart',(cx+dx,cy,h+.85),(.22,1.65,.10),'TEAK',.025)
 for dx in [-3.3,3.3]:
  def underside(dy):return h+1.1*(1-math.sqrt(max(0,1-(dx/3.8)**2-(dy/1.05)**2)))
  foot=floor(cx+dx,cy)
  box('Launch cradle foot',(cx+dx,cy,foot+.15),(.34,1.65,.30),'WOOD',.035)
  for dy in [-.37,.37]:
   top=underside(dy)-.05
   box('Launch cradle upright',(cx+dx,cy+dy,(foot+.30+top)/2),(.30,.20,top-foot-.30),'WOOD',.025)
  curve('Conforming launch cradle',[(cx+dx,cy+dy,underside(dy)-.06) for dy in [-.49+j*.98/32 for j in range(33)]],.09,'WOOD',10)
 deck_nav['obstacles'].append({'type':'box','x':cx,'z':cy,'halfX':3.9,'halfZ':1.15,'name':'Ship launch'})
hx=-43;hh=floor(hx)
for z in [-.78,.78]:tube('Helm pedestal',(hx,z,hh),(hx,z,hh+1.0),.14,'WOOD',n=10)
torus('Great ship wheel',(hx,0,hh+1.15),.83,.052,'WOOD','x',48,8)
tube('Wheel axle',(hx-.18,0,hh+1.15),(hx+.18,0,hh+1.15),.14,'BRASS',n=16)
for k in range(10):
 a=k*math.tau/10;tube('Turned wheel spoke',(hx,0,hh+1.15),(hx,1.05*math.cos(a),hh+1.15+1.05*math.sin(a)),.04,'WOOD',n=8)
 ellipsoid('Spoke handgrip',(hx,1.05*math.cos(a),hh+1.15+1.05*math.sin(a)),(.065,.09,.09),'WOOD',12,8)
box('Brass binnacle',(-41.2,0,floor(-41.2)+.6),(.7,.7,1.2),'WOOD',.08)
ellipsoid('Compass brass hood',(-41.2,0,floor(-41.2)+1.27),(.45,.45,.29),'BRASS',24,14)
def dial(u,v):
 a=u*math.tau;r=v*.25;return(-41.35+r*math.cos(a),r*math.sin(a),floor(-41.2)+1.575)
ob=grid('Binnacle compass face',dial,48,8,'COMPASS',flip=True);layer=ob.data.uv_layers.active
for loop in ob.data.loops:
 p=ob.data.vertices[loop.vertex_index].co;layer.data[loop.index].uv=((p.x+41.35)/.50+.5,p.y/.50+.5)
torus('Compass viewing brass rim',(-41.35,0,floor(-41.2)+1.580),.263,.020,'BRASS','z',48,8)
deck_nav['obstacles'].extend([{'type':'circle','x':-43,'z':0,'radius':.4,'name':'Wheel hub'},{'type':'circle','x':-41.2,'z':0,'radius':.6,'name':'Binnacle'}])

# Long rising bowsprit, carved bow rails and gilt figurehead in flowing robes.
root=(44,0,8.4);tip=(69.5,0,16.6)
tube('Oak bowsprit',root,tip,.48,'WOOD',r1=.15,n=20)
for k in range(18):
 t=k/18;p=tuple(root[j]+(tip[j]-root[j])*t for j in range(3));tube('Bowsprit iron binding',p,tuple(p[j]+(tip[j]-root[j])*.004 for j in range(3)),.49*(1-t)+.17*t,'TRIM',n=16)
for side in [-1,1]:
 curve('Swept gilded bow rail',[(45+j*.55,side*(2.7*(1-j/28)),9.3+j*.12) for j in range(29)],.10,'BRASS',10)
 for k in range(8):
  x=41+k*1.45;y=side*max(.15,beam(x))
  gold_scroll((x,y+.05*side,6.5+.12*k),1.0,side)
 stem=hull(52.5,math.acos(clamp(1-(-.9-bottom(52.5))/(sheer(52.5)-bottom(52.5)),0,1))*2/math.pi,1)
 rope('Bowsprit bobstay',(stem[0],0,-.9),tip,.095,.4)
 ellipsoid('Bobstay bronze stem attachment',(stem[0]-.02,0,-.9),(.18,.23,.18),'BRASS',16,10)
 rope('Bowsprit side stay',(42,side*4,7),tip,.07,.4)
# Anatomical silhouette is a small carved statue, not a crew character.
curve('Figurehead flowing robe',[(53.2+1.8*t,0,8.7+3.1*t) for t in [j/30 for j in range(31)]],.34,'BRASS',14)
ellipsoid('Figurehead robed torso',(54.3,0,10.9),(.42,.29,.68),'BRASS',28,20)
ellipsoid('Figurehead neck',(54.65,0,11.48),(.14,.15,.27),'BRASS',16,10)
ellipsoid('Figurehead head',(54.88,0,11.84),(.23,.20,.30),'BRASS',24,18)
ellipsoid('Carved nose',(55.10,0,11.88),(.11,.065,.06),'BRASS',12,8)
for side in [-1,1]:
 curve('Figurehead arm',[(54.3,side*.27,11.20),(54.55,side*.43,10.98),(55.03,side*.35,11.16),(55.25,side*.24,11.40)],.10,'BRASS',12)
 ellipsoid('Figurehead hand',(55.25,side*.23,11.42),(.17,.06,.075),'BRASS',14,10)
 for k in range(8):curve('Carved hair locks',[(54.80-.21*math.sin(t*2),side*(.08+k*.015),12.06-.70*t) for t in [j/18 for j in range(19)]],.021,'BRASS',6)
for k in range(9):
 a=k*math.tau/9;curve('Robe folded hem',[(53.0+1.6*t,.24*math.sin(a)*(1-t)+.02*math.sin(t*10),8.6+2.6*t) for t in [j/24 for j in range(25)]],.035,'BRASS',6)

# Four square-rigged masts and an aft spanker mast, with separate cloth groups.
sail_specs=[];mast_specs=[(32,48,24),(13,57,29),(-8,54,28),(-28,43,22),(-44,31,15)]
for mi,(x,top,width) in enumerate(mast_specs):
 h=floor(x);tube('Oak lower mast',(x,0,h),(x,0,top),.48 if mi<4 else .32,'WOOD',r1=.12,n=16)
 tube('Mast partners',(x,0,h),(x,0,h+.5),.65,'WOOD',n=16)
 deck_nav['obstacles'].append({'type':'circle','x':x,'z':0,'radius':.7,'name':'Mast partners'})
 for a in [h+1,top*.50,top*.73]:tube('Iron mast hoop',(x,0,a),(x,0,a+.10),.51*(1-(a-h)/(top-h))+.12,'TRIM',n=16)
 platform=top*.52;torus('Fighting top rim',(x,0,platform),1.45,.065,'WOOD','z',32,6)
 grid('Fighting top platform',lambda u,v:(x+1.35*math.cos(u*math.tau)*v,1.35*math.sin(u*math.tau)*v,platform),24,5,'WOOD')
 for side in [-1,1]:
  for k in range(7):
   ax=x-2.4+k*.8;az=side*(beam(x)-.6);lower=(ax,az,floor(ax,az)+.2);upper=(x,side*.45,platform+1.5)
   rope('Standing shroud',lower,upper,.060,.05)
   tube('Deadeye chainplate',(ax,az,floor(ax,az)-.6),lower,.036,'TRIM',n=6)
   ellipsoid('Wooden deadeye',(ax,az,floor(ax,az)+.36),(.17,.12,.20),'WOOD',12,8)
   for j in range(1,35):
    t=j/35;z=lower[2]+(upper[2]-lower[2])*t;yy=lower[1]+(upper[1]-lower[1])*t
    if k<6:rope('Hand tied ratline',(ax+(x-ax)*t,yy,z),(ax+.8+(x-ax-.8)*t,yy,z),.017,.03)
  rope('Topmast backstay',(x-5,side*(beam(x)-.7),floor(x-5)),(x,0,top-.5),.048,.1)
 if mi<4:
  # Course, lower/upper topsails, topgallant and royal; taper each tier.
  levels=[h+3.2+(top-h-8.5)*j/4 for j in range(5)]
  for si,foot in enumerate(levels):
   head=(levels[si+1]-.9 if si<4 else top-1.2);wb=width*(1-.14*si);wt=wb*.92
   if head-foot<2:continue
   group='sail-'+str(len(sail_specs));yard='yard-'+str(len(sail_specs))
   S={'id':group,'boom':yard,'square':True,'tack':[x,foot,0],'head':[x,head,0],'clew':[x,foot,wb/2],'draft':1.8 if si<2 else .9,'roach':0,'angleScale':1,'phase':len(sail_specs)*1.618,'widthBottom':wb,'widthTop':wt}
   sail_specs.append(S)
   def cloth(u,v,x=x,foot=foot,head=head,wb=wb,wt=wt,draft=S['draft']):
    return (x+draft*math.sin(math.pi*u)*math.sin(math.pi*v), (u-.5)*(wb+(wt-wb)*v), foot+(head-foot)*v+1.05*math.sin(math.pi*u)*(1-v)**4)
   ob=grid('Canvas square sail',cloth,40,28,'SAIL',group)
   for edge in range(4):
    steps=32 if edge<2 else 16
    for j in range(steps):
     a,b=j/steps,(j+1)/steps
     A,B=((a,edge),(b,edge)) if edge<2 else ((edge-2,a),(edge-2,b))
     tube('Sewn square sail bolt rope',cloth(*A),cloth(*B),.018,'ROPE',n=5,group=group,cloth_uv=(A,B))
   tube('Tapered oak yard',(x,-wt*.54,head),(x,wt*.54,head),.13 if si<2 else .085,'WOOD',r1=.07,n=12,group=yard)
   for side in [-1,1]:
    # The yard end rotates with its brace; the other end lies on the mast's
    # rotation axis, so this whole lift stays connected in every wind trim.
    rope('Yard lift',(x,side*wt*.5,head),(x,0,min(top,head+7)),.029,.10,group=yard)
   # Reef points and reinforcement seams share the same UV cloth deformation.
   for u in [j/14 for j in range(1,14)]:
    for v in [.38,.72]:
     a=cloth(u,v);b=(a[0]-.08,a[1],a[2]-.35)
     tube('Canvas reef point',a,b,.012,'ROPE',n=4,group=group,cloth_uv=((u,v),(u,v-.025)))
 else:
  tack=[x,h+3.0,0];head=[x,top-1,0];clew=[-51.3,h+3.9,0]
  S={'id':'sail-'+str(len(sail_specs)),'boom':None,'tack':tack,'head':head,'clew':clew,'draft':.8,'roach':.25,'angleScale':.75,'phase':3.19};sail_specs.append(S)
  def triangular(u,v,S=S):
   T,H,C=[Vector((p[0],p[2],p[1])) for p in [S['tack'],S['head'],S['clew']]]
   p=T*(1-v)*(1-u)+C*u*(1-v)+H*v;p.y+=S['draft']*math.sin(math.pi*u)*max(0,1-v)**.6;return p
  grid('Aft spanker',triangular,36,42,'SAIL',S['id'])
 # Longitudinal stays are tied to the next mast or bow, never dangling in space.
 target=(mast_specs[mi-1][0],0,floor(mast_specs[mi-1][0])+1) if mi else (65,0,15)
 rope('Main standing forestay',(x,0,top*.80),target,.063,.15)
for j,(tack,head,clew) in enumerate([([68.8,16.3,0],[32,46,0],[45,10,0]),([62.2,14.4,0],[32,37,0],[39,10,0]),([54.5,11.9,0],[32,29,0],[34,9.8,0])]):
 S={'id':'sail-'+str(len(sail_specs)),'boom':None,'tack':tack,'head':head,'clew':clew,'draft':1.7,'roach':.25,'angleScale':.50,'phase':j*1.71};sail_specs.append(S)
 def jib(u,v,S=S):
  T,H,C=[Vector((p[0],p[2],p[1])) for p in [S['tack'],S['head'],S['clew']]];p=T*(1-v)*(1-u)+C*u*(1-v)+H*v;p.y+=S['draft']*math.sin(math.pi*u)*max(0,1-v)**.6;return p
 grid('Forward jib',jib,36,44,'SAIL',S['id']);rope('Jib luff stay',(tack[0],0,tack[1]),(head[0],0,head[1]),.035,.02)

# Stern lanterns with bronze lattices and glass, visible even at deck distance.
for z in [-4.5,0,4.5]:
 h=13.35 if z==0 else 12.5;tube('Lantern support',(stern+.20,z,11.7),(stern+.2,z,h),.065,'BRASS',n=10)
 box('Lantern glowing glass',(stern+.2,z,h+.36),(.4,.4,.65),'LAMP',.02)
 for dx in [-.23,.23]:
  for dz in [-.23,.23]:tube('Lantern lattice',(stern+.2+dx,z+dz,h),(stern+.2+dx,z+dz,h+.73),.024,'BRASS',n=6)
 ellipsoid('Lantern domed roof',(stern+.2,z,h+.76),(.34,.34,.18),'BRASS',20,10)

# Shared exporter: AO from actual geometry; independently moving sails excluded.
suffix=base[base.index('bpy.context.view_layer.update();deps='):]
suffix=suffix.replace('idx.extend((corners[0],corners[2],corners[1]))','idx.extend((corners[0],corners[1],corners[2]) if ev.matrix_world.to_3x3().determinant()<0 else (corners[0],corners[2],corners[1]))')
suffix=suffix.replace("'length':52,'hullLength':47,'beam':9.3,'deckHeight':2.6,'draft':6.65,'crewConcept':[20,30],'masts':3", "'length':122,'hullLength':105,'beam':18.5,'deckHeight':6.19,'draft':7.5,'crewConcept':[200,250],'masts':5,'mass':5800000,'name':'Imperial Star'")
suffix=suffix.replace("manifest['rigLines']=[]","manifest['rigLines']=list(rig)")
suffix=suffix.replace('schooner.bin.gz','imperial-star.bin.gz').replace('schooner.json','imperial-star.json').replace('schooner-52m.blend','imperial-star-122m.blend').replace('schooner-studio.png','imperial-star-studio.png')
suffix=suffix.replace('range(8)','range(4)').replace('i*math.tau/8','i*math.tau/4').replace("'rays':9","'rays':5")
suffix=suffix.replace('camera.location=(66,-84,39);target=Vector((0,0,14))','camera.location=(145,-190,88);target=Vector((0,0,23))').replace('data.ortho_scale=78','data.ortho_scale=166')
suffix=suffix.replace('130000,35','450000,70').replace('65000,30','220000,55').replace('80000,25','320000,60').replace("[(5,-30,50)]","[(5,-80,100)]")
hydro_code='''
# Clip the actual exported painted hull triangles below each water plane.
# The closure at the plane contributes zero to the y-divergence integral.
def displaced(level):
 total=0;g=manifest['groups']['hull'];inds=names['hull_indices']
 for i in range(0,len(inds),3):
  vs=[list(vertex_data[(g['vertexOffset']//4+vi*11):(g['vertexOffset']//4+vi*11+3)]) for vi in inds[i:i+3]]
  if vertex_data[g['vertexOffset']//4+inds[i]*11+8]!=MAT['HULL']:continue
  poly=[]
  for a,b in zip(vs,vs[1:]+vs[:1]):
   inside=a[1]<=level;other=b[1]<=level
   if inside:poly.append(a)
   if inside!=other:
    t=(level-a[1])/(b[1]-a[1]);poly.append([a[k]+t*(b[k]-a[k]) for k in range(3)])
  for j in range(1,len(poly)-1):
   a,b,c=poly[0],poly[j],poly[j+1]
   ny=(b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])
   total+=(a[1]+b[1]+c[1]-3*level)*ny/6
 return abs(total)
manifest['hydro']={'density':1025,'method':'clipped exported hull triangles','volumeCurve':[[i/4,displaced(i/4)] for i in range(-12,13)]}
print('EXACT_DISPLACEMENT_CURVE',manifest['hydro'],flush=True)
'''
suffix=suffix.replace("with open(os.path.join(asset,'imperial-star.bin.gz')",hydro_code+"\nwith open(os.path.join(asset,'imperial-star.bin.gz')")
exec(compile(suffix,str(Path(__file__)),'exec'))
