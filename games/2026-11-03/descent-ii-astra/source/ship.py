"""Rebuild the Pyro around its actual Descent II polygon mesh and gun locations."""
from pathlib import Path
import base64, json, struct, sys
from collections import Counter
import numpy as np
from d2art import bitmap_reader
out=Path(__file__).resolve().parents[1]
root=Path(sys.argv[1]); b=(root/"descent2.ham").read_bytes()
def integer(p):return struct.unpack_from("<i",b,p)[0]
p=8
for size in [22,2,82,130,126,480,8,125,16]:
    p+=4+integer(p)*size
count=integer(p);head=p+4;start=head+count*734
sizes=[integer(head+i*734+4) for i in range(count)]
p=start+sum(sizes)+count*8
p+=4+integer(p)*4
obj_count=integer(p);p+=4
bitmaps=np.frombuffer(b,dtype="<u2",count=obj_count,offset=p)
lookups=np.frombuffer(b,dtype="<u2",count=obj_count,offset=p+2*obj_count)
p+=obj_count*4
model=integer(p)
guns=np.frombuffer(b,dtype="<i4",count=24,offset=p+36).reshape(-1,3)/65536
h=head+734*model
raw=b[start+sum(sizes[:model]):start+sum(sizes[:model+1])]
print("Pyro",model,"weapons",guns.round(2).tolist())
pig=(root/"groupa.pig").read_bytes()
first=struct.unpack_from("<H",b,h+731)[0]
def matname(i):
    bi=bitmaps[lookups[first+i]]
    return pig[12+18*(int(bi)-1):20+18*(int(bi)-1)].split(b"\0")[0].decode()
faces=[]; vertices={}
def vec(off):return np.frombuffer(raw,dtype="<i4",count=3,offset=off)/65536
def us(off):return struct.unpack_from("<H",raw,off)[0]
def visit(pos,offset):
    while (op:=us(pos)):
        n=us(pos+2)
        if op in (1,7):
            base=us(pos+4) if op==7 else 0;pos+=8 if op==7 else 4
            for j in range(n):vertices[base+j]=vec(pos+12*j)+offset
            pos+=n*12
        elif op in (2,3):
            idx=struct.unpack_from("<"+"H"*n,raw,pos+30)
            verts=np.array([vertices[i] for i in idx])
            norm=vec(pos+16); mat=us(pos+28)
            pos+=30+((n&~1)+1)*2
            if op==3:
                tex=np.frombuffer(raw,dtype="<i4",count=n*3,offset=pos).reshape(n,3)[:,:2]/65536
                pos+=n*12;mat=matname(mat)
            else:tex=np.zeros((n,2))
            faces.append((verts,norm,mat,tex))
        elif op==4:
            visit(pos+us(pos+28),offset);visit(pos+us(pos+30),offset);pos+=32
        elif op==6:visit(pos+us(pos+16),offset+vec(pos+4));pos+=20
        elif op==8:pos+=4
        else:raise ValueError((op,pos))
visit(0,np.zeros(3))
print("faces",len(faces),Counter(m for _,_,m,_ in faces),"bounds",np.min(np.concatenate([v for v,*_ in faces]),0),np.max(np.concatenate([v for v,*_ in faces]),0))
for v,n,m,u in faces:
    if isinstance(m,int):continue
    print(m,len(v),v.mean(0).round(1),n.round(2)) if "--inspect" in sys.argv else None

# Mesh vertices are xyz, normal, UV, and a material index. Identical data goes to
# the game renderer and to the flight terminal's inspection turntable.
mesh=[]
def unit(v):return v/max(np.linalg.norm(v),1.e-9)
def polygon(points,material,normal=None,uv=None):
    points=np.array(points);n=unit(np.cross(points[1]-points[0],points[2]-points[0])) if normal is None else unit(normal)
    if uv is None:
        axis=np.argmax(abs(n)); uv=np.delete(points,axis,axis=1)*.63
    for j in range(1,len(points)-1):
        for k in (0,j,j+1):mesh.append([*points[k],*n,*uv[k],material])
seen=set()
for verts,n,mat,uv in faces:
    key=tuple(sorted(tuple(v) for v in verts))
    if key in seen:continue
    seen.add(key)
    center=verts.mean(0)
    slot={"ship1-1":0,"ship1-2":1,"ship1-3":2,"ship1-4":3,"ship1-5":4,"glow04":6}.get(mat,5)
    # Keep small patches intact. Large panels have a shadowed joint, a bevel,
    # then a face at the original contour, so the hull stays within its envelope.
    radius=np.mean(np.linalg.norm(verts-center,axis=1))
    inner=center+(verts-center)*(.925 if radius>.22 else .975)
    raised=inner+unit(n)*min(.033,radius*.052)
    tuv=uv.mean(0)+(uv-uv.mean(0))*.925
    polygon(raised,slot,n,tuv)
    for j in range(len(verts)):
        k=(j+1)%len(verts)
        ridge=unit(n*.67+unit((verts[j]+verts[k])*.5-center)*.38)
        polygon([verts[j],verts[k],raised[k],raised[j]],5 if slot==1 else slot,ridge)
def tube(center,axis,rings,cap,nseg=16):
    axis=unit(np.array(axis,dtype=float));x=unit(np.cross(axis,[0,1,0] if abs(axis[1])<.85 else [0,0,1]));y=np.cross(axis,x)
    theta=np.arange(nseg)*np.pi*2/nseg
    circle=np.cos(theta)[:,None]*x+np.sin(theta)[:,None]*y
    previous=None
    for z,rad,mat in rings:
        ring=center+axis*z+rad*circle
        if previous is not None:
            for j in range(nseg):
                k=(j+1)%nseg;polygon([previous[j],previous[k],ring[k],ring[j]],mat,unit(circle[j]+circle[k]))
        previous=ring
    polygon(ring,cap,axis)
# Stepped laser sleeves at the original four muzzle hardpoints.
for j,g in enumerate(guns[:4]):
    r=.092 if j<2 else .116
    tube(g,np.array([0,0,1]),[(-.58,r*1.2,5),(-.47,r*1.39,4),(-.39,r,5),(-.18,r,2),(-.14,r*1.25,4),(-.08,r*1.24,4),(-.045,r,2),(0,r,5),(.005,r*.62,4)],5)
    tube(g,np.array([0,0,1]),[(.005,r*.47,5),(.009,r*.38,5)],6,12)
# Bell rims, annular exhaust liners and cooling ribs at the stock thruster faces.
for verts,n,mat,uv in faces:
    if mat!="glow04":continue
    center=verts.mean(0)
    tube(center,n,[(-.075,.38,2),(-.018,.42,4),(.045,.42,5),(.068,.385,4),(.060,.314,2),(.043,.277,5)],6,24)
    tube(center,n,[(.043,.16,6),(.067,.147,4)],2,18)
# Conform fittings to the stock upper hull, including the downward-sloping wings.
def deck(x,z):
    best=None
    for v,n,*_ in faces:
        if n[1]<.12:continue
        for i in range(1,len(v)-1):
            A,B,C=v[0],v[i],v[i+1]
            ax,az=B[0]-A[0],B[2]-A[2];bx,bz=C[0]-A[0],C[2]-A[2]
            det=ax*bz-az*bx
            if abs(det)<1.e-8:continue
            u=((x-A[0])*bz-(z-A[2])*bx)/det;w=(ax*(z-A[2])-az*(x-A[0]))/det
            if u>=-.001 and w>=-.001 and u+w<=1.001:
                y=A[1]+u*(B[1]-A[1])+w*(C[1]-A[1])
                if best is None or y>best:best=y
    return best
def overlay(coords,material,lift):
    points=[]
    for x,z in coords:
        y=deck(x,z)
        if y is None:return
        points.append(np.array([x,y+lift,z]))
    n=unit(np.cross(points[1]-points[0],points[2]-points[0]))
    polygon(points,material,n if n[1]>0 else -n)
for side in (-1,1):
    for i in range(7):
        z=-1.50-i*.115
        overlay([(side*.38,z),(side*.86,z-.04),(side*.86,z-.09),(side*.38,z-.055)],5,.032)
        overlay([(side*.38,z),(side*.86,z-.04),(side*.86,z-.058),(side*.38,z-.015)],4,.045)
    for x,z in [(1.35,-.90),(1.5,-.99),(1.65,-1.08),(1.8,-1.17),(1.95,-1.26),(2.1,-1.35)]:
        overlay([(side*x,z),(side*(x+.075),z-.04),(side*(x+.075),z+.26),(side*x,z+.30)],2,.039)
    overlay([(side*.22,3.07),(side*.57,2.59),(side*.52,2.51),(side*.17,3.01)],3,.044)
    overlay([(side*2.5,-1.21),(side*2.64,-1.29),(side*2.64,-1.15),(side*2.5,-1.07)],7,.043)
# A compound-curved glass canopy with a central keel and two structural bows.
profiles=[(-1.16,.38,.40,.39),(-.93,.67,.30,.66),(-.52,.76,.28,.84),
          (-.03,.76,.23,.86),(.53,.65,.15,.68),(1.02,.50,.03,.52),(1.51,.24,-.03,.30)]
angles=np.linspace(0,np.pi,15)
def arc(profile):
    z,w,y,h=profile
    return np.array([[w*np.cos(t),y+h*np.sin(t),z] for t in angles])
for k in range(len(profiles)-1):
    A,B=arc(profiles[k]),arc(profiles[k+1])
    for j in range(len(angles)-1):
        q=np.array([A[j],B[j],B[j+1],A[j+1]])
        n=unit(np.cross(q[1]-q[0],q[2]-q[0]))
        if n[1]<0:n=-n
        polygon(q,2 if j in (0,13) else 1,n)
    for t in (0,7,14):
        x0,y0,z0=A[t];x1,y1,z1=B[t]
        polygon([[x0-.022,y0+.012,z0],[x1-.022,y1+.012,z1],[x1+.022,y1+.012,z1],[x0+.022,y0+.012,z0]],2,np.array([0,1,0]))
for k in [1,4]:
    A=arc(profiles[k])
    for j in range(len(angles)-1):
        U,V=A[j],A[j+1]
        polygon([U+[0,.012,-.027],V+[0,.012,-.027],V+[0,.012,.027],U+[0,.012,.027]],2,
                unit(np.array([np.cos((angles[j]+angles[j+1])*.5),np.sin((angles[j]+angles[j+1])*.5),.05])))
rawmesh=np.asarray(mesh,dtype='<f4').tobytes()
asset={"data":base64.b64encode(rawmesh).decode(),"count":len(mesh),"fragment":(out/"source/ship.frag").read_text()}
(out/"pyro.js").write_text("window.astraHull="+json.dumps(asset,separators=(",",":"))+";\n")
print(len(mesh)//3,"triangles")


