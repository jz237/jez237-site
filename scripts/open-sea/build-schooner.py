"""Build the 52 m image-reference schooner, editable Blender scene and browser mesh.
Run: blender --background --factory-startup --python build-schooner.py -- <repo> <outputs>
Blender axes: X bow, Y starboard, Z up. Browser: X bow, Y up, Z starboard.
Concept geometry, not certified naval architecture. No external assets required.
"""
import bpy, math, json, struct, sys, os, array, gzip
from mathutils import Vector

args=sys.argv[sys.argv.index('--')+1:]
repo, outputs=args[0:2]
asset=os.path.join(repo,'demos','open-sea','assets');os.makedirs(asset,exist_ok=True)
os.makedirs(outputs,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
MAT={'HULL':0,'DECK':1,'CABIN':2,'GLASS':3,'TEAK':4,'ALU':5,'SAIL':6,'STEEL':7,'ROPE':8,'KEEL':9,'TRIM':10,'BRASS':11,'RUBBER':12,'SCREEN':13,'CANVAS':14,'WOOD':15,'SAFETY':16}
palette={'HULL':((.018,.045,.075,1),.25,0),'DECK':((.55,.31,.135,1),.6,0),'CABIN':((.86,.82,.71,1),.32,0),'GLASS':((.012,.026,.036,1),.1,.25),'TEAK':((.38,.21,.09,1),.55,0),'ALU':((.53,.57,.61,1),.3,.9),'SAIL':((.86,.83,.72,1),.82,0),'STEEL':((.7,.73,.76,1),.22,1),'ROPE':((.52,.48,.37,1),.85,0),'KEEL':((.025,.042,.055,1),.6,0),'TRIM':((.018,.022,.026,1),.45,0),'BRASS':((.5,.32,.10,1),.27,.8),'RUBBER':((.45,.47,.44,1),.7,0)}
palette.update({'SCREEN':((.02,.09,.12,1),.3,0),'CANVAS':((.69,.65,.54,1),.85,0),'WOOD':((.23,.10,.035,1),.24,0),'SAFETY':((.85,.12,.02,1),.67,0)})
materials={}
for name,(col,rough,metal) in palette.items():
 m=bpy.data.materials.new(name);m.use_nodes=True;m.diffuse_color=col
 p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=col;p.inputs['Roughness'].default_value=rough;p.inputs['Metallic'].default_value=metal
 if name in ['TEAK','DECK','SAIL']:
  n=m.node_tree.nodes.new('ShaderNodeTexNoise');n.inputs['Scale'].default_value=220 if name=='SAIL' else 9;n.inputs['Detail'].default_value=2
  bump=m.node_tree.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.10;bump.inputs['Distance'].default_value=.001 if name=='SAIL' else .003
  m.node_tree.links.new(n.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],p.inputs['Normal'])
 materials[name]=m

groups={'hull':[],'rig':[]};names={};rig=[];deck_nav={'obstacles':[],'surfaces':[]}
def mesh(name,verts,faces,mat,smooth=True,uv=None,group='hull'):
 me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.materials.append(materials[mat]);me.update()
 ob=bpy.data.objects.new(name,me);bpy.context.collection.objects.link(ob);groups.setdefault(group,[]).append(ob);names[name]=ob
 for f in me.polygons:f.use_smooth=smooth
 if uv:
  layer=me.uv_layers.new(name='UVMap')
  for loop in me.loops:layer.data[loop.index].uv=uv[loop.vertex_index]
 return ob
def grid(name,fn,nu,nv,mat,group='hull',flip=False):
 verts=[fn(i/nu,j/nv) for j in range(nv+1) for i in range(nu+1)];faces=[]
 for j in range(nv):
  for i in range(nu):
   a=j*(nu+1)+i;f=(a,a+1,a+nu+2,a+nu+1);faces.append(tuple(reversed(f)) if flip else f)
 uv=[(i/nu,j/nv) for j in range(nv+1) for i in range(nu+1)]
 return mesh(name,verts,faces,mat,True,uv,group)
def tube(name,a,b,r,mat='STEEL',r1=None,n=10,group='hull'):
 if name.endswith('mast collar') or name in ['Winch base','Helm pedestal','Tender davit']:
  deck_nav['obstacles'].append({'type':'circle','x':a[0],'z':a[1],'radius':max(r,r1 or r),'name':name})
 a,b=Vector(a),Vector(b);d=(b-a).normalized();up=Vector((1,0,0)) if abs(d.z)>.9 else Vector((0,0,1));s=d.cross(up).normalized();t=d.cross(s);r1=r if r1 is None else r1
 verts=[]
 for p,rad in [(a,r),(b,r1)]:
  for k in range(n):verts.append(p+rad*(math.cos(k*math.tau/n)*s+math.sin(k*math.tau/n)*t))
 faces=[(k,(k+1)%n,(k+1)%n+n,k+n) for k in range(n)];faces.extend([tuple(reversed(range(n))),tuple(range(n,n*2))])
 if group=='hull' and r<.065:group='rig'
 ob=mesh(name,verts,faces,mat,True,group=group);ob['tube_radius']=r;return ob
def box(name,c,d,mat='CABIN',bevel=.04,group='hull'):
 if name.startswith('Teak coaming ') or name in ['Cockpit seat','Cockpit coaming','Helm instrument','Windlass foundation']:
  deck_nav['obstacles'].append({'type':'box','x':c[0],'z':c[1],'halfX':d[0]/2,'halfZ':d[1]/2,'name':name})
 if name in ['Deck hatch glazing','Companionway threshold']:
  deck_nav['surfaces'].append({'x':c[0],'z':c[1],'halfX':d[0]/2+.07,'halfZ':d[1]/2+.07,'height':c[2]+d[2]/2})
 x,y,z=c;a,b,h=[v/2 for v in d];verts=[(x+i*a,y+j*b,z+k*h) for k in (-1,1) for j in (-1,1) for i in (-1,1)]
 faces=[(0,2,3,1),(4,5,7,6),(0,1,5,4),(2,6,7,3),(0,4,6,2),(1,3,7,5)]
 ob=mesh(name,verts,faces,mat,False,group=group)
 if bevel:
  mod=ob.modifiers.new('Soft machined edges','BEVEL');mod.width=bevel;mod.segments=2
  mod=ob.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');mod.keep_sharp=True;mod.weight=35
 return ob
def ellipsoid(name,c,r,mat='STEEL',nu=20,nv=12,group='hull'):
 return grid(name,lambda u,v:(c[0]+r[0]*math.cos(u*math.tau)*math.sin(v*math.pi),c[1]+r[1]*math.sin(u*math.tau)*math.sin(v*math.pi),c[2]+r[2]*math.cos(v*math.pi)),nu,nv,mat,group,True)
def torus(name,c,major,minor,mat='STEEL',axis='z',nu=24,nv=6,group='hull',stretch=1):
 def fn(u,v):
  a=u*math.tau;b=v*math.tau;rr=major+minor*math.cos(b);p=(rr*math.cos(a)*stretch,rr*math.sin(a),minor*math.sin(b))
  if axis=='y':p=(p[0],p[2],p[1])
  elif axis=='x':p=(p[2],p[0],p[1])
  return tuple(c[k]+p[k] for k in range(3))
 return grid(name,fn,nu,nv,mat,group)
def clamp(v,a,b):return max(a,min(b,v))
def beam(x):
 if x>=-2:return 4.65*max(.0,1-((x+2)/25.5)**2.1)**.7
 return 4.65*(1-.40*((-2-x)/21.5)**2.4)
def sheer(x):return 2.6+(.0018 if x>0 else .0007)*x*x
def deck_height(x,y):return sheer(x)+.055*(1-(y/(beam(x)*.995))**2)
def bottom(x):return -3.15*max(.05,1-(x/25.5)**2)**.5
def bow_rake(x,v):return x-2.7*max(0,min(1,(x-18.5)/5))**3*(1-v)
def hull(x,v,side):
 a=v*math.pi/2;z=bottom(x)+(sheer(x)-bottom(x))*(1-math.cos(a));y=beam(x)*math.sin(a)**.78
 return (bow_rake(x,v),side*y,z)
for side in [-1,1]:grid('Navy hull '+str(side),lambda u,v:hull(-23.5+47*u,v,side),160,40,'HULL',flip=side==1)
grid('Rounded transom',lambda u,v:(-23.5,hull(-23.5,v,1)[1]*(2*u-1),hull(-23.5,v,1)[2]),28,32,'HULL',flip=True)
grid('Teak working deck',lambda u,v:(-23.5+47*u,(v*2-1)*beam(-23.5+47*u)*.995,sheer(-23.5+47*u)+.055*(1-(v*2-1)**2)),160,40,'TEAK')
for side in [-1,1]:
 for k in range(100):
  x=-23.3+k*.464;x1=x+.464
  for height,rad,mat in [(0,.085,'TEAK'),(-.34,.028,'BRASS'),(.96,.024,'STEEL'),(.48,.012,'STEEL')]:
   tube('Continuous rail', (x,side*beam(x)*.987,sheer(x)+height),(x1,side*beam(x1)*.987,sheer(x1)+height),rad,mat,n=6)
 for k in range(38):
  x=-22.8+k*1.19;b=beam(x)*.985;h=sheer(x)
  tube('Stanchion',(x,side*b,h),(x,side*b,h+.99),.025,n=8)
  ellipsoid('Stanchion foot',(x,side*b,h+.015),(.09,.07,.025),'STEEL',12,6)
 # Actual rimmed portholes, two accommodation rows.
 for row in [1.25]:
  for k in range(22):
   x=-20.1+k*1.75;h=row+.12*abs(x)/20;a=math.acos(clamp(1-(h-bottom(x))/(sheer(x)-bottom(x)),-1,1));y=side*beam(x)*math.sin(a)**.78
   ellipsoid('Crew cabin portlight',(x,y+side*.028,h),(.26,.022,.17),'GLASS',16,8)
   torus('Portlight brass rim',(x,y+side*.035,h),.205,.018,'BRASS','y',20,6,stretch=1.34)
 # Hull cream bootstripe carried by geometry, parallel to the waterline.
 def stripe(u,v):
  x=-23.45+46.85*u;z=.035+v*.10;hv=math.acos(clamp(1-(z-bottom(x))/(sheer(x)-bottom(x)),-1,1))*2/math.pi
  p=hull(x,hv,side);return (p[0],p[1]+side*.015,z)
 grid('Cream boot stripe '+str(side),stripe,160,2,'CABIN',flip=side==1)

# Fin, bulb and substantial rudder, visible in the ocean's underwater view.
for side in [-1,1]:grid('Deep keel '+str(side),lambda u,v:(-1+(u-.5)*(9-3*v)+v,side*(.035+.31*math.sin(u*math.pi)),-2.8-3.5*v),32,16,'KEEL',flip=side<0)
ellipsoid('Ballast bulb',(0,0,-6.2),(3.7,.63,.45),'KEEL',48,20)
for side in [-1,1]:grid('Rudder '+str(side),lambda u,v:(-20.3+(u-.5)*(2.1-.5*v)-v*.35,side*(.025+.15*math.sin(u*math.pi)),-.4-4.1*v),20,18,'KEEL',flip=side<0)
tube('Rudder stock',(-20.5,0,-.4),(-20.5,0,-4.8),.14,'STEEL',n=14)

# Layered pilothouse and deck cabins, with individual framed windows.
houses=[(-10.8,9.2,6.0,2.1),(2.7,6.2,4.7,1.10),(12,3.8,3.2,.95)]
for hi,(x,length,width,height) in enumerate(houses):
 base=sheer(x)+.10
 box('Deckhouse '+str(hi),(x,0,base+height*.5),(length,width,height),'CABIN',.15)
 box('Teak coaming '+str(hi),(x,0,base+.09),(length+.16,width+.16,.18),'TEAK',.07)
 box('Deckhouse roof '+str(hi),(x,0,base+height+.065),(length+.24,width+.22,.13),'CABIN',.10)
 for side in [-1,1]:
  n=6 if hi==0 else 4
  for k in range(n):
   xx=x-length*.40+k*length*.8/(n-1);zz=base+height*.57
   box('Window gasket',(xx,side*(width*.5+.013),zz),(length/(n+1)*.74,.045,height*.53),'TRIM',.045)
   box('Deckhouse glass',(xx,side*(width*.5+.041),zz),(length/(n+1)*.67,.015,height*.46),'GLASS',.025)
 # Front windscreen and aft lights surrounding the companionway.
 for end in [-1,1]:
  count=3 if end==1 else 2
  for k in range(count):
   yy=(-.30+k*.60/(count-1))*width;xx=x+end*(length*.5+.03);zz=base+height*.61
   box('Bulkhead window gasket',(xx,yy,zz),(.045,width*.20,height*.49),'TRIM',.04)
   box('Bulkhead windscreen',(xx+end*.025,yy,zz),(.015,width*.18,height*.43),'GLASS',.025)
 for side in [-1,1]:
  for k in range(3):
   xx=x-length*.29+k*length*.29
   box('Roof skylight rim',(xx,side*width*.21,base+height+.18),(.92,.72,.09),'STEEL',.045)
   box('Roof skylight',(xx,side*width*.21,base+height+.236),(.82,.62,.025),'GLASS',.03)
 # Roof grab handles and properly connected legs.
 for side in [-1,1]:
  yy=side*(width/2-.25);zz=base+height+.32
  tube('Roof grabrail',(x-length*.38,yy,zz),(x+length*.38,yy,zz),.027,n=10)
  for xx in [x-length*.38,x,x+length*.38]:tube('Grabrail foot',(xx,yy,zz-.2),(xx,yy,zz),.025,n=8)
 # Companionway at aft bulkhead.
 box('Companionway surround',(x-length*.5-.03,0,base+.66),(.1,.91,1.3),'TEAK',.04)
 box('Companionway door',(x-length*.5-.09,0,base+.66),(.045,.77,1.18),'TRIM',.03)
 box('Companionway threshold',(x-length*.5-.30,0,sheer(x-length*.5-.30)+.08),(.40,.98,.12),'TEAK',.025)
 for side in [-1,1]:
  yy=side*.32;xx=x-length*.5-.12
  tube('Door handle',(xx,yy,base+.69),(xx,yy,base+.87),.021,'BRASS',n=8)
  for zz in [base+.29,base+1.02]:box('Door hinge',(xx,side*.39,zz),(.04,.07,.13),'STEEL',.012)

# Mast positions mirror the image's ascending heights from bow to stern.
mast_specs=[('Main',-12.7,36.5,9.8),('Middle',1.7,29.8,11.0),('Fore',14.0,23.8,8.6)]
sail_specs=[]
for mi,(label,x,height,foot) in enumerate(mast_specs):
 dh=sheer(x);top=dh+height;boom_h=dh+2.4;group='sail-'+str(mi);bg='boom-'+str(mi)
 tube(label+' mast',(x,0,dh),(x,0,top),.27-.025*mi,'ALU',.115-.012*mi,20)
 tube(label+' mast collar',(x,0,dh),(x,0,dh+.28),.40,'STEEL',n=20)
 for frac,spread in [(.34,2.9),(.64,2.25),(.86,1.55)]:
  z=dh+height*frac
  for side in [-1,1]:
   tube('Spreader',(x,0,z),(x-.15,side*spread,z+.10),.045,'ALU',.022,10)
   tube('Cap shroud',(x,0,top-.6),(x-.15,side*spread,z+.1),.027,'STEEL',n=5)
   tube('Lower shroud',(x-.15,side*spread,z+.1),(x-1.2,side*beam(x)*.87,dh+.15),.03,'STEEL',n=5)
 # Ratlines: independent fine geometry; ladders have sensible endpoints.
 for side in [-1,1]:
  y0=side*beam(x)*.87
  for k in range(int(height/.65)):
   f=(k*.65+.65)/height;yy=y0*(1-f)
   tube('Ratline',(x-1.2*(1-f),yy,dh+f*height),(x+1.35*(1-f),yy,dh+f*height),.012,'ROPE',n=5)
  for dx in [-1.2,1.35]:tube('Mast shroud',(x+dx,y0,dh+.1),(x,0,top-.8),.026,'STEEL',n=6)
 # Aft mainsail has a full, high rig; each boom moves with its own sail.
 tube(label+' boom',(x,0,boom_h),(x-foot,0,boom_h+.12),.17,'ALU',.115,16,bg)
 box('Gooseneck',(x-.08,0,boom_h),(.35,.36,.38),'STEEL',.07,bg)
 for j in range(3):torus('Boom sheet block',(x-foot*.7-j*.25,0,boom_h-.20),.12,.025,'STEEL','y',16,6,bg)
 S={'id':group,'boom':bg,'tack':[x,boom_h,0],'head':[x+.06,top-.65,0],'clew':[x-foot,boom_h+.12,0],'draft':.75+foot*.018,'roach':.32,'angleScale':1,'phase':mi*1.6}
 sail_specs.append(S)
 # Running rigging to deck blocks/winches.
 for side in [-1,1]:
  tube('Halyard',(x-.09,side*.12,top-.5),(x-.09,side*.12,dh+.2),.024,'ROPE',n=6)
  # Mainsheets are generated dynamically in the browser so they remain connected
  # when the booms swing. Static source lines show the Blender resting pose.
  ob=tube('Sheet',(x-foot*.8,side*.1,boom_h-.15),(x-foot*.6,side*2.9,sheer(x-foot*.6)+.18),.036,'ROPE',n=6)
  ob['browser_skip']=True
 # Radar, masthead light and small vane.
 ellipsoid('Masthead light',(x,0,top+.20),(.13,.13,.15),'TRIM',16,10)
 tube('Wind vane stem',(x,0,top+.27),(x,0,top+.75),.018,n=6)
 box('Wind vane',(x+.25,0,top+.75),(.7,.07,.055),'STEEL',.02)
 for k in range(4):
  z=dh+height*.28+k*.35;tube('Mast climbing step',(x-.1,.27,z),(x-.3,.27,z),.022,n=6)

# Bowsprit, forestays and two independently deforming headsails.
tube('Bowsprit',(20.6,0,sheer(20.6)+.26),(28.5,0,3.45),.28,'ALU',.15,18)
for side in [-1,1]:tube('Bowsprit whisker stay',(23.0,side*1.4,2.8),(28.5,0,3.4),.04,'STEEL',n=6)
tube('Bobstay',(22.9,0,.35),(28.5,0,3.4),.045,'STEEL',n=6)
fh=sheer(14)+23.8
for tack,head,clew,label in [([28.4,3.65,0],[14.02,fh-.9,0],[17.2,4.9,0],'Jib'),([22.7,3.9,0],[14.04,fh-5.0,0],[12.6,5.2,0],'Staysail')]:
 tube(label+' forestay',(tack[0],0,tack[1]),(head[0],0,head[1]),.035,'STEEL',n=6)
 lead=17 if label=='Jib' else 7
 ob=tube(label+' sheet',(clew[0],0,clew[1]),(lead,-min(3.8,beam(lead)*.8),sheer(lead)+.59),.036,'ROPE',n=8);ob['browser_skip']=True
 sail_specs.append({'id':'sail-'+str(len(sail_specs)),'boom':None,'tack':tack,'head':head,'clew':clew,'draft':1.0,'roach':.15,'angleScale':.55,'phase':len(sail_specs)*1.6})

# High-resolution cloth with sewn reinforcement and actual batten profiles.
for S in sail_specs:
 T,H,C=S['tack'],S['head'],S['clew'];g=S['id']
 def cloth(u,v,S=S):
  T,H,C=S['tack'],S['head'],S['clew'];lx=T[0]+(H[0]-T[0])*v;ly=T[1]+(H[1]-T[1])*v
  ex=C[0]+(H[0]-C[0])*v-S['roach']*math.sin(math.pi*v);ey=C[1]+(H[1]-C[1])*v
  camber=S['draft']*math.sin(math.pi*u**.85)*(1-v)**.6
  return (lx+(ex-lx)*u,camber,ly+(ey-ly)*u)
 grid('Ivory '+g,cloth,48,64,'SAIL',g)
 for v in [.22,.42,.62,.80]:
  a=cloth(.60,v);b=cloth(.99,v);tube('Sail batten',a,b,.017,'SAIL',n=5,group=g)
 for edge in ['luff','leech','foot']:
  for k in range(32):
   a=k/32;b=(k+1)/32
   p=cloth(0,a) if edge=='luff' else cloth(1,a) if edge=='leech' else cloth(a,0)
   q=cloth(0,b) if edge=='luff' else cloth(1,b) if edge=='leech' else cloth(b,0)
   tube('Sewn sail edge',p,q,.018,'SAIL',n=5,group=g)
 for uv in [(0,0),(1,0),(.01,.985)]:
  p=cloth(*uv);torus('Sail corner cringle',p,.075,.019,'STEEL','y',16,6,g)

# Working gear: sizeable winches, cleats, deck hatches, seating and dual helms.
for x in [-19,-16.8,-5.4,-1,7,17]:
 for side in [-1,1]:
  y=side*min(3.8,beam(x)*.80);z=sheer(x)
  tube('Winch base',(x,y,z+.02),(x,y,z+.16),.26,'STEEL',n=18)
  tube('Winch drum',(x,y,z+.16),(x,y,z+.59),.19,'STEEL',.23,20)
  for k in range(4):torus('Sheet wraps',(x,y,z+.25+k*.055),.21,.024,'ROPE',nu=20,nv=6)
  tube('Winch handle',(x,y,z+.62),(x+.34,y,z+.62),.025,'STEEL',n=8)
  tube('Winch grip',(x+.34,y,z+.62),(x+.34,y,z+.75),.035,'TRIM',n=8)
for x in [-21,-17,-5,6,18,22]:
 for side in [-1,1]:
  y=side*beam(x)*.85;z=sheer(x)
  box('Cleat foot',(x,y,z+.03),(.58,.24,.075),'STEEL',.025)
  tube('Cleat stem',(x,y,z+.04),(x,y,z+.2),.065,n=8)
  tube('Cleat horns',(x-.34,y,z+.20),(x+.34,y,z+.20),.05,n=8)
for x in [-18.4,-4.2,8.2,18.7]:
 for y in [-1.25,1.25]:
  z=sheer(x);box('Deck hatch rim',(x,y,z+.08),(1.30,.90,.14),'STEEL',.06);box('Deck hatch glazing',(x,y,z+.16),(1.16,.76,.035),'GLASS',.05)
  for xx in [x-.36,x+.36]:
   box('Hatch hinge',(xx,y-.45,z+.16),(.19,.08,.07),'STEEL',.015)
   tube('Hatch latch',(xx-.065,y+.34,z+.19),(xx+.065,y+.34,z+.19),.018,'STEEL',n=8)
for side in [-1,1]:
 z=sheer(-18);y=side*2.2
 box('Cockpit seat',(-18,y,z+.51),(3.1,.72,.17),'TEAK',.08)
 for k in range(3):
  xx=-19+k*1.0;box('Canvas cockpit cushion',(xx,y,z+.66),(.94,.65,.18),'CANVAS',.085)
  for end in [-1,1]:tube('Cushion piping',(xx+end*.43,y-.28,z+.70),(xx+end*.43,y+.28,z+.70),.009,'ROPE',n=6)
 box('Cockpit coaming',(-18,side*2.62,z+.82),(3.4,.14,.86),'CABIN',.06)
 tube('Helm pedestal',(-16.8,side*1.75,z),(-16.8,side*1.75,z+1.22),.12,'CABIN',n=14)
 c=(-16.98,side*1.75,z+1.18);torus('Helm wheel',c,.52,.033,'WOOD','x',48,8)
 tube('Wheel hub',(c[0]-.07,c[1],c[2]),(c[0]+.07,c[1],c[2]),.075,'BRASS',n=16)
 for k in range(8):
  a=k*math.tau/8;tube('Wheel spoke',c,(c[0],c[1]+.50*math.cos(a),c[2]+.50*math.sin(a)),.014,n=6)
 box('Helm instrument',(-16.63,side*1.75,z+1.94),(.18,.81,.61),'TRIM',.04)
 sx=-16.725;cy=side*1.75;cz=z+1.94
 tube('Chartplotter mounting arm',(-16.8,cy,z+.95),(-16.63,cy,z+1.75),.045,'STEEL',n=12)
 tube('Compass mounting bracket',(-16.8,cy,z+.96),(-16.45,cy,z+1.14),.04,'STEEL',n=12)
 mesh('Chartplotter screen',[(sx,cy-.35,cz-.25),(sx,cy+.35,cz-.25),(sx,cy+.35,cz+.25),(sx,cy-.35,cz+.25)],[(0,3,2,1)],'SCREEN',False,[(0,1),(1,1),(1,0),(0,0)])
 for k in range(3):ellipsoid('Instrument keys',(sx-.005,cy-.23+k*.23,cz-.286),(.012,.024,.014),'CABIN',10,6)
 tube('Compass binnacle',(-16.45,cy,z+1.12),(-16.45,cy,z+1.60),.13,'STEEL',n=18)
 torus('Compass brass rim',(-16.45,cy,z+1.64),.145,.018,'BRASS',nu=24,nv=6)
 ellipsoid('Compass glass',(-16.45,cy,z+1.64),(.13,.13,.05),'GLASS',24,8)

# Substantial twin anchor windlass with chain links and articulated flukes.
for side in [-1,1]:
 x=20.5;y=side*.68;z=sheer(x)
 box('Windlass foundation',(x,y,z+.10),(1.15,.70,.20),'STEEL',.08)
 tube('Windlass motor',(x-.40,y,z+.28),(x+.25,y,z+.28),.24,'STEEL',n=18)
 tube('Windlass capstan',(x,y,z+.26),(x,y,z+.68),.21,'STEEL',n=20)
 for k in range(20):
  xx=x+.4+k*.13;torus('Anchor chain link',(xx,y,z+.15),.085,.018,'STEEL','z' if k%2 else 'y',14,6,stretch=1.6)
 box('Anchor roller',(23.0,side*.80,3.4),(1.2,.22,.20),'STEEL',.04)
 tube('Anchor shank',(23.8,side*.82,3.3),(24.5,side*.82,1.8),.09,'STEEL',n=12)
 tube('Anchor stock',(24.4,side*.82-.46,2.0),(24.4,side*.82+.46,2.0),.055,n=8)
 for s in [-1,1]:
  verts=[(24.5,side*.82,1.8),(24.0,side*.82+s*.63,1.7),(24.7,side*.82+s*.60,2.1),(24.4,side*.82+s*.12,2.12)]
  mesh('Anchor fluke',verts,[(0,1,2,3)],'STEEL',False)

# Tender, stern davits, rescue gear and communications fittings.
z=sheer(-21.5)+1.15
for side in [-1,1]:
 ellipsoid('Tender pontoon',(-20.5,side*.90,z),(2.15,.34,.35),'RUBBER',28,12)
 tube('Tender davit',(-22,side*2.1,sheer(-22)),(-22,side*2.1,sheer(-22)+3.1),.085,'STEEL',n=12)
 tube('Davit arm',(-22,side*2.1,sheer(-22)+3.1),(-20.8,side*.80,sheer(-22)+3.1),.075,'STEEL',n=12)
 tube('Tender lifting line',(-20.8,side*.8,sheer(-22)+3.1),(-20.8,side*.8,z),.025,'ROPE',n=6)
box('Tender floor',(-20.5,0,z-.12),(3.8,1.40,.12),'TRIM',.09)
for x in [-21.3,-20.3,-19.3]:box('Tender bench',(x,0,z+.12),(.35,1.65,.12),'TEAK',.04)
box('Tender outboard',(-22.4,0,z+.15),(.42,.35,.60),'TRIM',.12)
deck_nav['obstacles'].append({'type':'box','x':-20.5,'z':0,'halfX':2.25,'halfZ':1.26,'name':'Suspended tender'})
for x in [-9.8,-7.8]:
 for side in [-1,1]:
  yy=side*2.25;zz=sheer(-10.8)+2.53
  box('Liferaft cradle',(x,yy,zz-.14),(1.42,.68,.12),'STEEL',.04)
  ellipsoid('Liferaft canister',(x,yy,zz+.15),(.65,.30,.27),'CABIN',20,12)
  for xx in [x-.36,x+.36]:torus('Raft securing strap',(xx,yy,zz+.15),.30,.022,'TRIM','x',20,6,stretch=.9)
for side in [-1,1]:
 z=sheer(-10.8)+2.33
 tube('Ventilation cowl',(-9,side*1.3,z),(-9,side*1.3,z+.5),.16,'CABIN',n=16)
 ellipsoid('Cowl cap',(-8.85,side*1.3,z+.50),(.32,.20,.18),'CABIN',20,12)
roof_h=sheer(-10.8)+2.33
tube('Radar mounting pedestal',(-13.8,0,roof_h),(-13.8,0,roof_h+.4),.14,'CABIN',n=16)
ellipsoid('Radar dome',(-13.8,0,roof_h+.72),(.65,.65,.45),'CABIN',24,16)
for side in [-1,1]:tube('Antenna',(-12,side*2.2,5.0),(-12,side*2.2,7.4),.024,'STEEL',n=8)

# Detail visible from a passenger's eye: working lines, belaying gear, rescue
# equipment and fasteners. Fine pieces share the existing filtered rig batch.
for x in [-18.8,-5.2,6.3,17.8]:
 for side in [-1,1]:
  yy=side*min(3.65,beam(x)*.76);zz=deck_height(x,yy)+.014
  for k in range(5):torus('Coiled running line',(x,yy,zz),.12+k*.032,.014,'ROPE',nu=32,nv=6,stretch=1.35)
  tube('Coil tail',(x+.31,yy,zz),(x+.62,yy+side*.14,deck_height(x+.62,yy+side*.14)+.016),.016,'ROPE',n=8)
  for xx in [x-.35,x+.35]:
   ellipsoid('Deck fastening',(xx,yy,deck_height(xx,yy)+.004),(.026,.026,.006),'STEEL',10,5)
for x in [-12.7,1.7,14]:
 yy=min(3.45,beam(x)*.73);zz=sheer(x)
 for side in [-1,1]:
  box('Belaying rail',(x,side*yy,zz+.31),(1.15,.18,.10),'WOOD',.025)
  for k in range(5):
   xx=x-.43+k*.21;tube('Belaying pin',(xx,side*yy,zz+.15),(xx,side*yy,zz+.53),.022,'BRASS',n=8)
  for xx in [x-.40,x+.40]:tube('Belaying rail support',(xx,side*yy,zz),(xx,side*yy,zz+.29),.031,'STEEL',n=8)
for side in [-1,1]:
 x=-18.9;yy=side*beam(x)*.984;zz=sheer(x)+.56
 torus('Rescue lifebuoy',(x,yy,zz),.30,.087,'SAFETY','y',36,10)
 for k in range(4):
  a=k*math.pi/2;cx=x+.30*math.cos(a);cz=zz+.30*math.sin(a)
  ellipsoid('Buoy reflective patch',(cx,yy-side*.067,cz),(.072,.023,.072),'CANVAS',12,6)
 torus('Rescue line',(x,yy,zz),.43,.014,'ROPE','y',40,6)
 for end in [-1,1]:tube('Buoy mount',(x+end*.25,yy,zz-.26),(x+end*.25,yy,zz+.26),.012,'STEEL',n=6)
 for xx in [-15.0,9.8]:
  cy=side*beam(xx)*.93;cz=sheer(xx)+.08
  box('Navigation light base',(xx,cy,cz),(.22,.13,.11),'TRIM',.025)
  box('Navigation light lens',(xx,cy+side*.035,cz+.065),(.13,.08,.06),'GLASS',.02)
for x,length,width,height in houses:
 base=sheer(x)+.10
 for side in [-1,1]:
  for k in range(8):
   xx=x-length*.43+k*length*.86/7;yy=side*(width/2+.026)
   ellipsoid('Window frame fastener',(xx,yy,base+.22),(.014,.007,.014),'STEEL',8,5)
  # Narrow louvred vents and an aft exterior light.
  xx=x+length*.30;yy=side*(width/2+.023)
  box('Cabin ventilation grille',(xx,yy,base+.25),(.46,.026,.22),'TRIM',.01)
  for k in range(5):tube('Vent louvre',(xx-.20,yy+side*.018,base+.17+k*.04),(xx+.20,yy+side*.018,base+.17+k*.04),.008,'STEEL',n=5)

def lettering(text,loc,size,normal,mat='BRASS'):
 data=bpy.data.curves.new(text,'FONT');data.body=text;data.align_x='CENTER';data.size=size;data.extrude=.0015;data.bevel_depth=.0008;data.resolution_u=3
 ob=bpy.data.objects.new(text,data);bpy.context.collection.objects.link(ob);ob.location=loc;ob.rotation_euler=Vector(normal).to_track_quat('Z','Y').to_euler();data.materials.append(materials[mat])
 bpy.context.view_layer.objects.active=ob;ob.select_set(True);bpy.ops.object.convert(target='MESH');ob.select_set(False);groups['hull'].append(ob)
lettering('OPEN SEA',(-23.53,0,2.04),.32,(1,0,0))
lettering('OPEN SEA',(-15.505,0,4.73),.12,(1,0,0))

# Export a compact indexed buffer, preserving Blender's evaluated bevel normals.
deps=bpy.context.evaluated_depsgraph_get();vertex_data=array.array('f');index_data=array.array('I');manifest={'version':1,'length':52,'hullLength':47,'beam':9.3,'deckHeight':2.6,'draft':6.65,'crewConcept':[20,30],'masts':3,'sails':sail_specs,'groups':{},'deck':deck_nav}
for group,objects in groups.items():
 verts=array.array('f');idx=array.array('I');lookup={}
 for ob in objects:
  if ob.get('browser_skip'):continue
  ev=ob.evaluated_get(deps);me=ev.to_mesh();me.calc_loop_triangles();uv=me.uv_layers.active;normals=me.corner_normals;matcode=MAT[ob.data.materials[0].name]
  for tri in me.loop_triangles:
   corners=[]
   for li in tri.loops:
    loop=me.loops[li];p=ev.matrix_world@me.vertices[loop.vertex_index].co;n=ev.matrix_world.to_3x3()@normals[li].vector;n.normalize();tc=uv.data[li].uv if uv else (p.x*.1,p.y*.1)
    if group.startswith('sail-') and not ob.name.startswith('Ivory '):
     S=sail_specs[int(group.split('-')[1])];T,H,C=S['tack'],S['head'],S['clew'];sv=clamp((p.z-T[1])/(H[1]-T[1]),0,1)
     lx=T[0]+(H[0]-T[0])*sv;ex=C[0]+(H[0]-C[0])*sv-S['roach']*math.sin(math.pi*sv)
     tc=(clamp((p.x-lx)/(ex-lx),0,1) if abs(ex-lx)>.001 else 0,sv)
    key=tuple(round(v,6) for v in (p.x,p.z,p.y,n.x,n.z,n.y,tc[0],tc[1],matcode,ob.get('tube_radius',0)))
    vi=lookup.get(key)
    if vi is None:vi=len(verts)//10;lookup[key]=vi;verts.extend(key)
    corners.append(vi)
   idx.extend((corners[0],corners[2],corners[1]))
  ev.to_mesh_clear()
 entry={'vertexOffset':len(vertex_data)*4,'vertexCount':len(verts)//10,'indexOffset':0,'indexCount':len(idx)}
 vertex_data.extend(verts);manifest['groups'][group]=entry;names[group+'_indices']=idx
vbytes=vertex_data.tobytes()
for group in groups:
 entry=manifest['groups'][group];entry['indexOffset']=len(vbytes)+len(index_data)*4;index_data.extend(names[group+'_indices'])
with open(os.path.join(asset,'schooner.bin.gz'),'wb') as f:f.write(gzip.compress(vbytes+index_data.tobytes(),compresslevel=9,mtime=0))
with open(os.path.join(asset,'schooner.json'),'w') as f:json.dump(manifest,f,separators=(',',':'))
print('BROWSER_ASSET',json.dumps({'bytes':len(vbytes)+len(index_data)*4,'vertices':len(vertex_data)//10,'triangles':len(index_data)//3,'objects':sum(map(len,groups.values()))}),flush=True)

# Save complete editable source, with a composed studio camera and Cycles materials.
scene=bpy.context.scene;scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
try:
 prefs=bpy.context.preferences.addons['cycles'].preferences;prefs.compute_device_type='OPTIX';prefs.get_devices()
 for device in prefs.devices:device.use=device.type=='OPTIX'
 scene.cycles.device='GPU';print('CYCLES_DEVICES',[(d.name,d.type,d.use) for d in prefs.devices],flush=True)
except Exception as e:print('Cycles CPU fallback',e,flush=True)
scene.world.color=(.30,.30,.30)
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.65,.69,.75,1);scene.world.node_tree.nodes['Background'].inputs[1].default_value=.38
def light(name,loc,power,size):
 data=bpy.data.lights.new(name,'AREA');data.energy=power;data.shape='DISK';data.size=size;ob=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(ob);ob.location=loc;ob.rotation_euler=(Vector((0,0,10))-ob.location).to_track_quat('-Z','Y').to_euler()
light('Large softbox',(5,-30,50),130000,35);light('Ocean fill',(-25,15,22),65000,30);light('Rim',(10,25,40),80000,25)
data=bpy.data.cameras.new('Schooner full view');camera=bpy.data.objects.new('Schooner full view',data);bpy.context.collection.objects.link(camera)
camera.location=(66,-84,39);target=Vector((0,0,14));camera.rotation_euler=(target-camera.location).to_track_quat('-Z','Y').to_euler();data.type='ORTHO';data.ortho_scale=78;scene.camera=camera
scene.render.resolution_x=1700;scene.render.resolution_y=1200;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True
scene.view_settings.view_transform='AgX';scene.render.filepath=os.path.join(outputs,'schooner-studio.png')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(outputs,'schooner-52m.blend'))
bpy.ops.render.render(write_still=True)
print('SCHOONER_COMPLETE',flush=True)
