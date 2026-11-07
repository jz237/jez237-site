"""Astra's complete pickup collection: authored solid meshes, no billboard sprites.
Each vertex carries position, surface normal, emission, alloy colour and roughness.
Reproducible standard-library generator; gameplay IDs and sizes are unchanged.
"""
from pathlib import Path
import math,struct,gzip,base64,json
S,C,P=math.sin,math.cos,math.pi
OUT=Path(__file__).resolve().parent
NAMES={0:'Extra life',1:'Energy',2:'Shields',3:'Laser upgrade',4:'Blue key',5:'Red key',6:'Gold key',7:'Hoard orb',10:'Concussion missile',11:'Concussion four-pack',12:'Quad lasers',13:'Vulcan cannon',14:'Spreadfire cannon',15:'Plasma cannon',16:'Fusion cannon',17:'Proximity mines',18:'Homing missile',19:'Homing four-pack',20:'Smart missile',21:'Mega missile',22:'Vulcan ammunition',23:'Cloaking device',24:'Turbo',25:'Invulnerability',27:'Megawow',28:'Gauss cannon',29:'Helix cannon',30:'Phoenix cannon',31:'Omega cannon',32:'Super laser',33:'Full map',34:'Energy converter',35:'Ammunition rack',36:'Afterburner',37:'Headlight',38:'Flash missile',39:'Flash four-pack',40:'Guided missile',41:'Guided four-pack',42:'Smart mines',43:'Mercury missile',44:'Mercury four-pack',45:'Earthshaker missile',46:'Blue flag',47:'Red flag'}
ALLOY=(.34,.43,.50);DARK=(.065,.095,.12);EDGE=(.66,.73,.77);GOLD=(.97,.59,.12);CYAN=(.08,.72,1.);BLUE=(.1,.3,1.);RED=(1.,.09,.035);GREEN=(.22,1.,.25);VIOLET=(.63,.19,1.)
NAMES[50]='Hostage rescue pod'
def sub(a,b):return tuple(x-y for x,y in zip(a,b))
def norm(a):
 d=math.sqrt(sum(x*x for x in a)) or 1;return tuple(x/d for x in a)
def cross(a,b):return a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]
class Mesh:
 def __init__(self):self.v=[]
 def tri(self,a,b,c,col=ALLOY,e=0,rough=.34,n=None):
  ns=n or [norm(cross(sub(b,a),sub(c,a)))]*3
  for p,q in zip((a,b,c),ns):self.v.extend((*p,*(x*.5+.5 for x in q),e,*col,rough))
 def quad(self,a,b,c,d,col=ALLOY,e=0,rough=.34,n=None):
  self.tri(a,b,c,col,e,rough,n[:3] if n else None);self.tri(a,c,d,col,e,rough,[n[0],n[2],n[3]] if n else None)
 def box(self,center,size,col=ALLOY,e=0):
  # True edge chamfers catch highlights on all armour plates and housings.
  h=[v*.5 for v in size];b=min(h)*.26
  def at(p):return tuple(a+c for a,c in zip(center,p))
  for axis in range(3):
   j,k=(axis+1)%3,(axis+2)%3
   for sign in (-1,1):
    p=[];n=[0,0,0];n[axis]=sign
    for u,v in [(-1,-1),(1,-1),(1,1),(-1,1)]:
     q=[0,0,0];q[axis]=sign*h[axis];q[j]=u*(h[j]-b);q[k]=v*(h[k]-b);p.append(at(q))
    self.quad(*p,col,e,n=[n]*4)
  for axis in range(3):
   j,k=(axis+1)%3,(axis+2)%3
   for u in (-1,1):
    for v in (-1,1):
     p=[];n=[0,0,0];n[j]=u;n[k]=v;n=norm(n)
     for s,edge in [(-1,0),(1,0),(1,1),(-1,1)]:
      q=[0,0,0];q[axis]=s*(h[axis]-b);q[j]=u*(h[j]-(b if edge else 0));q[k]=v*(h[k]-(0 if edge else b));p.append(at(q))
     self.quad(*p,col,e,n=[n]*4)
  for x in (-1,1):
   for y in (-1,1):
    for z in (-1,1):
     signs=(x,y,z);pts=[]
     for axis in range(3):pts.append(at([signs[k]*(h[k]-(0 if k==axis else b)) for k in range(3)]))
     self.tri(*pts,col,e,n=[norm(signs)]*3)
 def lathe(self,profile,col=ALLOY,e=0,center=(0,0,0),scale=(1,1,1),segments=32):
  def p(z,r,t):return tuple(a+b*c for a,b,c in zip(center,scale,(r*C(t),r*S(t),z)))
  for (z,r),(zz,rr) in zip(profile,profile[1:]):
   for i in range(segments):
    a=i*2*P/segments;b=(i+1)*2*P/segments
    n=[norm((C(t)/scale[0],S(t)/scale[1],(r-rr)/max(.00001,zz-z)/scale[2])) for t in (a,b,b,a)]
    self.quad(p(z,r,a),p(z,r,b),p(zz,rr,b),p(zz,rr,a),col,e,n=n)
 def torus(self,r,t,col=ALLOY,e=0,center=(0,0,0),axis=2,start=0,end=2*P,segments=40):
  def rotate(p):return (p[2],p[0],p[1]) if axis==0 else (p[0],p[2],p[1]) if axis==1 else p
  def v(a,b):
   n=rotate((C(a)*C(b),S(a)*C(b),S(b)));p=rotate(((r+t*C(b))*C(a),(r+t*C(b))*S(a),t*S(b)))
   return tuple(x+y for x,y in zip(p,center)),n
  for i in range(segments):
   for j in range(8):
    q=[v(start+(end-start)*a/segments,2*P*b/8) for a,b in ((i,j),(i+1,j),(i+1,j+1),(i,j+1))]
    self.quad(*(a[0] for a in q),col,e,n=[a[1] for a in q])
 def sphere(self,r,col,e=0,center=(0,0,0)):
  def v(a,b):
   n=(C(a)*S(b),S(a)*S(b),C(b));return tuple(c+r*t for c,t in zip(center,n)),n
  for i in range(28):
   for j in range(14):
    q=[v(a*2*P/28,b*P/14) for a,b in ((i,j),(i+1,j),(i+1,j+1),(i,j+1))]
    self.quad(*(a[0] for a in q),col,e,n=[a[1] for a in q])
 def add(self,other,center=(0,0,0),scale=1):
  for i in range(0,len(other.v),11):self.v.extend((*[center[k]+scale*other.v[i+k] for k in range(3)],*other.v[i+3:i+11]))
 def beam(self,a,b,r,col=ALLOY,e=0):
  n=norm(sub(b,a));t=norm(cross(n,(0,1,0) if abs(n[1])<.9 else (1,0,0)));u=cross(n,t)
  for i in range(12):
   pts=[]
   for p,j in ((a,i),(a,i+1),(b,i+1),(b,i)):
    pts.append(tuple(p[k]+r*(t[k]*C(j*P/6)+u[k]*S(j*P/6)) for k in range(3)))
   self.quad(*pts,col,e)
 def finish(self):
  radius=max(math.sqrt(sum(v*v for v in self.v[i:i+3])) for i in range(0,len(self.v),11))
  for i in range(0,len(self.v),11):
   for k in range(3):self.v[i+k]/=radius
  return struct.pack('<I',len(self.v)//11)+struct.pack('<%df'%len(self.v),*self.v)
def bands(m,col=CYAN):
 for z in (-.45,.45):
  m.torus(.42,.055,EDGE,center=(0,0,z));m.torus(.427,.018,col,1.4,center=(0,0,z))
def core(m,col,kind):
 m.sphere(.43,col,.42);m.torus(.56,.06,DARK,axis=0);m.torus(.59,.025,col,1.1,axis=0)
 for axis in (1,2):m.torus(.61,.045,EDGE,axis=axis)
 for i in range(6):
  a=i*P/3;m.sphere(.08,ALLOY,center=(.63*C(a),.63*S(a),0))
  m.beam((.48*C(a),.48*S(a),-.35),(.48*C(a),.48*S(a),.35),.055,DARK)
  for z in (-.36,.36):
   m.lathe([(-.045,.06),(.045,.06)],EDGE,center=(.48*C(a),.48*S(a),z),segments=12)
 for z in (-.30,-.20,.20,.30):m.torus(.46,.022,ALLOY,center=(0,0,z))
 for sign in (-1,1):
  m.lathe([(-.055,.27),(.055,.27)],DARK,center=(0,0,sign*.49))
  m.torus(.22,.025,col,.85,center=(0,0,sign*.55))
 if kind==2:
  for i in range(8):
   a=i*P/4;m.beam((.50*C(a),.50*S(a),-.36),(.50*C(a),.50*S(a),.36),.04,EDGE)
def rocket(col,kind=0):
 m=Mesh();m.lathe([(-.95,0),(-.95,.16),(-.78,.21),(.45,.21),(.65,.18),(.93,.03),(.98,0)],EDGE)
 m.lathe([(-.79,.213),(-.65,.213)],DARK)
 for z in (-.58,-.47,.34):m.torus(.211,.014,col,.4,center=(0,0,z),segments=24)
 m.lathe([(-.99,.08),(-.95,.13)],DARK);m.torus(.09,.017,CYAN,1.2,center=(0,0,-.99),segments=24)
 for i in range(4):
  a=i*P/2;p=(C(a),S(a));b=(-S(a)*.018,C(a)*.018)
  poly=[(.18,-.79),(.48,-.91),(.40,-.37),(.19,-.17)]
  for side in (-1,1):m.quad(*[(p[0]*r+b[0]*side,p[1]*r+b[1]*side,z) for r,z in poly],ALLOY)
  m.beam((p[0]*.46,p[1]*.46,-.86),(p[0]*.36,p[1]*.36,-.43),.012,col,.8)
 if kind in (1,4,5):m.sphere(.10,col,.9,center=(0,0,.84))
 if kind in (2,3,7):
  for z in (-.22,-.08,.06,.20):m.torus(.22,.025,DARK,center=(0,0,z),segments=24)
 return m
def cannon(m,col,count,kind):
 m.box((0,0,-.26),(.75,.52,.77),DARK);m.box((0,0,-.29),(.64,.57,.55),ALLOY)
 for i in range(count):
  a=i*2*P/count;r=0 if count==1 else .23
  center=(r*C(a),r*S(a),.1);rad=.15 if count<3 else .095
  m.lathe([(-.40,rad*.8),(-.33,rad),(.53,rad),(.58,rad*.8),(.59,rad*.6)],EDGE,center=center)
  m.lathe([(.57,rad*.61),(.60,rad*.61)],DARK,center=center)
  m.torus(rad*.65,.012,col,1.8,center=(center[0],center[1],.69),segments=20)
  for z in (-.10,.03,.17,.32):m.torus(rad+.016,.018,DARK if kind%2 else col,.25,center=(center[0],center[1],z+.1),segments=20)
 for sign in (-1,1):
  m.box((sign*.39,.02,-.18),(.08,.30,.61),EDGE)
  for z in (-.4,-.29,-.18,-.07,.04):m.box((sign*.437,.02,z),(.015,.19,.035),DARK)
  m.box((sign*.20,.30,-.28),(.08,.035,.42),col,1.2)
 m.box((0,-.35,-.4),(.26,.25,.28),DARK)
 for x in (-.26,.26):
  for y in (-.19,.19):
   m.lathe([(-.025,.045),(.025,.045)],EDGE,center=(x,y,-.67),segments=12)
   m.box((x,y,-.70),(.045,.012,.008),DARK)
 for z in (-.53,-.42,-.31):m.box((0,.32,z),(.50,.045,.04),EDGE)
 m.box((0,0,-.66),(.37,.24,.035),ALLOY)
 for i in range(5):m.box((-.13+i*.065,0,-.685),(.026,.17,.018),col,.35)
 if kind in (15,16,29,31,32):
  for sign in (-1,1):m.beam((sign*.30,-.25,-.45),(sign*.30,-.25,.25),.035,col,.65)
def equipment(m,id):
 col={23:VIOLET,24:GOLD,25:GOLD,27:GREEN,33:CYAN,34:GREEN,35:GOLD,36:GOLD,37:CYAN}.get(id,CYAN)
 if id in (23,25,27):
  core(m,col,id)
  for j in range(3):m.torus(.75,.035,EDGE,axis=j,start=.2,end=5.5)
 elif id in (24,36):
  for sign in (-1,1):
   center=(sign*.33,0,0)
   m.lathe([(-.7,.18),(-.58,.23),(.40,.23),(.60,.16)],ALLOY,center=center)
   for z in (-.5,-.4,-.3,-.2):m.torus(.24,.02,DARK,center=(sign*.33,0,z),segments=28)
   m.torus(.15,.035,EDGE,center=(sign*.33,0,.61));m.sphere(.13,col,1.3,center=(sign*.33,0,.58))
   m.lathe([(-.71,.14),(-.66,.14)],CYAN,.8,center=center)
  m.box((0,0,-.15),(.4,.18,.60),DARK);m.box((0,.16,-.1),(.16,.07,.40),col,.8)
 elif id==37:
  m.lathe([(-.55,.15),(-.35,.29),(.22,.43),(.4,.43),(.42,.36)],ALLOY)
  m.lathe([(.42,.36),(.44,.30)],EDGE);m.sphere(.30,(.6,.9,1.),.9,center=(0,0,.26))
  for z in (-.24,-.1,.04):m.torus(.29+(z+.24)*.4,.03,DARK,center=(0,0,z))
 elif id==35:
  for y in (-.30,.3):
   for x in (-.45,0,.45):
    m.lathe([(-.5,.1),(-.42,.15),(.42,.15),(.54,.05)],GOLD,center=(x,y,0),segments=20)
  for z in (-.3,.25):m.box((0,0,z),(1.2,.85,.12),DARK);m.box((0,.44,z),(1.1,.04,.06),CYAN,.8)
 else:
  m.box((0,0,0),(1.,.75,.35),DARK);m.box((0,0,.20),(.86,.6,.06),ALLOY)
  m.box((0,0,.24),(.65,.43,.025),(.03,.16,.21),.3)
  for i in range(5):
   m.box((-.27+i*.135,0,.26),(.012,.36,.008),col,.9)
   m.box((0,-.17+i*.085,.26),(.55,.01,.008),col,.9)
  for x in (-.40,.40):
   for y in (-.27,.27):m.sphere(.035,EDGE,center=(x,y,.245))
  if id==34:
   m.torus(.18,.04,GOLD,1.1,center=(-.20,0,.30));m.torus(.18,.04,CYAN,1.1,center=(.20,0,.30))
def d2_mine(m,smart,caged):
 # Reconstruct the six red/amber lobes from D2 pbomb/spbomb sprites.
 # Pickups use the original silver cubic carrier; deployed mines have
 # eight diagonal contact spikes. Shared proportions and finishes.
 shell=(.74,.30,.025) if smart else (.65,.012,.009)
 silver=(.69,.71,.70)
 m.sphere(.32,(.18,.12,.045) if smart else (.12,.013,.01))
 for axis in range(3):
  for sign in (-1,1):
   p=[0,0,0];p[axis]=sign*.34
   m.sphere(.40,shell,.035,center=p)
 if caged:
  for axis in range(3):
   for u in (-1,1):
    for v in (-1,1):
     center=[0,0,0];size=[.075,.075,.075]
     center[(axis+1)%3]=u*.55;center[(axis+2)%3]=v*.55;size[axis]=1.175
     m.box(center,size,silver)
 else:
  for x in (-1,1):
   for y in (-1,1):
    for z in (-1,1):
     direction=norm((x,y,z));t=norm(cross(direction,(0,1,0)));u=cross(direction,t)
     base=[d*.54 for d in direction];tip=[d*.98 for d in direction]
     for i in range(12):
      a=i*2*P/12;b=(i+1)*2*P/12
      p=[base[k]+.085*(t[k]*C(a)+u[k]*S(a)) for k in range(3)]
      q=[base[k]+.085*(t[k]*C(b)+u[k]*S(b)) for k in range(3)]
      m.tri(p,q,tip,silver,rough=.22)

def make(id):
 m=Mesh()
 if id==50:
  # An armoured open rescue cradle with an actual suited person inside.
  for y in (-.82,.82):
   m.box((0,y,0),(.90,.18,.65),ALLOY);m.box((0,y,.35),(.65,.05,.025),CYAN,1.1)
  for x in (-.44,.44):m.beam((x,-.82,-.12),(x,.82,-.12),.055,EDGE)
  m.box((0,0,-.25),(.7,1.45,.10),DARK)
  m.sphere(.19,EDGE,center=(0,.51,.03));m.box((0,.52,.19),(.27,.12,.08),(.02,.15,.21),.4)
  m.box((0,.12,.02),(.37,.47,.25),(.38,.48,.52));m.box((0,.18,.17),(.21,.19,.035),GOLD)
  for sign in (-1,1):
   m.beam((sign*.1,-.12,.01),(sign*.14,-.66,.04),.09,ALLOY)
   m.beam((sign*.20,.29,.01),(sign*.30,-.22,.06),.065,EDGE)
   m.box((sign*.15,-.70,.12),(.19,.13,.30),DARK)
  for y in (-.5,0,.5):m.box((-.48,y,.13),(.10,.16,.12),CYAN,.6)
 elif id in (1,2,7):core(m,GOLD if id==1 else BLUE if id==2 else GREEN,id)
 elif id==0:
  # Miniature Pyro rescue beacon, in an open protective docking cradle.
  m.lathe([(-.63,.12),(-.35,.23),(.15,.2),(.7,0)],EDGE,scale=(1,.55,1))
  m.box((0,.12,.1),(.16,.08,.36),CYAN,1.4)
  for sign in (-1,1):
   m.quad((sign*.1,0,.15),(sign*.85,-.05,-.30),(sign*.66,0,-.6),(sign*.13,.04,-.4),ALLOY)
   m.lathe([(-.7,.1),(-.3,.12),(.1,.05)],DARK,center=(sign*.4,0,-.1))
   m.torus(.085,.018,CYAN,1.5,center=(sign*.4,0,-.82))
  m.torus(.83,.04,GOLD,axis=1)
 elif id in (4,5,6):
  col={4:BLUE,5:RED,6:GOLD}[id]
  m.torus(.32,.09,EDGE,center=(0,.36,0));m.torus(.32,.032,col,1.4,center=(0,.36,.085))
  m.box((0,-.2,0),(.16,.68,.13),ALLOY)
  for i in range(id-2):m.box((.15,-.16-i*.14,0),(.24,.07,.13),EDGE)
  m.box((0,-.15,.08),(.05,.55,.025),col,1.2)
 elif id in (10,11,18,19,20,21,38,39,40,41,43,44,45):
  kind={10:0,11:0,18:1,19:1,20:2,21:3,38:4,39:4,40:5,41:5,43:6,44:6,45:7}[id]
  col=[GOLD,GREEN,VIOLET,RED,(1.,1.,.68),CYAN,(.73,.85,.97),(.9,.25,.05)][kind]
  missile=rocket(col,kind)
  if id in (11,19,39,41,44):
   for x in (-.36,.36):
    for y in (-.36,.36):m.add(missile,(x,y,0),.7)
   for z in (-.35,.18):m.box((0,0,z),(.98,.94,.08),DARK)
  else:m.add(missile)
 elif id in (3,12,13,14,15,16,28,29,30,31,32):
  count={3:1,12:4,13:6,14:3,15:2,16:2,28:6,29:5,30:2,31:3,32:1}[id]
  col={3:RED,12:RED,13:GOLD,14:VIOLET,15:GREEN,16:VIOLET,28:GOLD,29:BLUE,30:RED,31:CYAN,32:CYAN}[id]
  cannon(m,col,count,id)
 elif id in (17,42):d2_mine(m,id==42,True)
 elif id==22:
  for x in (-.4,0,.4):
   for y in (-.2,.2):m.lathe([(-.5,.1),(-.4,.14),(.3,.14),(.55,0)],GOLD,center=(x,y,0),segments=20)
  for z in (-.25,.18):m.box((0,0,z),(1.,.7,.08),DARK)
 elif id in (46,47):
  col=BLUE if id==46 else RED;m.beam((-.55,-.8,0),(-.55,.8,0),.035,EDGE)
  m.sphere(.075,GOLD,center=(-.55,.85,0));m.box((-.55,-.76,0),(.20,.18,.20),DARK)
  for i in range(24):
   x=-.5+i/24;xx=x+1/24;z=.09*S(i*.25);zz=.09*S((i+1)*.25)
   for j in range(12):
    y=.75-j*.7/12;yy=y-.7/12
    edge=j in (0,11) or i==23
    m.quad((x,y,z),(xx,y,zz),(xx,yy,zz),(x,yy,z),EDGE if edge else col,.12)
  m.torus(.16,.025,EDGE,center=(0,.4,.12));m.box((0,.4,.13),(.045,.23,.025),GOLD,.65)
 else:equipment(m,id)
 return m
def main(out):
 parts=[];catalog=[]
 for id in range(51):
  mesh=make(id);b=mesh.finish();parts.append(b)
  catalog.append({'id':id,'name':NAMES.get(id,'Reserved pickup '+str(id)),'active':id in NAMES,'triangles':len(mesh.v)//33})
 for smart in (False,True):
  mesh=Mesh();d2_mine(mesh,smart,False);parts.append(mesh.finish())
 binary=b'APU9'+struct.pack('<I',53)+b''.join(parts)
 packed=base64.b64encode(gzip.compress(binary,compresslevel=9,mtime=0)).decode()
 out.write_text('window.astraCollectibles='+json.dumps({'catalog':catalog,'gzip':packed},separators=(',',':'))+';\n',encoding='utf8')
 (OUT/'collectibles-catalog.json').write_text(json.dumps(catalog,indent=2),encoding='utf8')
 print(len(NAMES),'defined collectibles;',sum(x['triangles'] for x in catalog),'triangles;',len(binary),'raw bytes;',len(packed),'packed bytes')
if __name__=='__main__':
 import sys
 main(Path(sys.argv[1]) if len(sys.argv)>1 else OUT/'collectibles.js')
