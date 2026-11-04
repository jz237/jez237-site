"""Bake a compact 3-D billow with a scalloped density surface, fuel and outward normals.
The runtime integrates rotated instances through depth. No camera view is baked in.
Usage: python pyro_field.py path/to/pyro-field.js
"""
import base64, io, sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import map_coordinates, gaussian_filter
N=112
rng=np.random.default_rng(23732)
axis=np.linspace(-1,1,N,dtype=np.float32)
z,y,x=np.meshgrid(axis,axis,axis,indexing="ij",sparse=True)
def noise(cells):
    v=rng.random((cells+4,)*3,dtype=np.float32)
    grid=np.broadcast_arrays(*[(q+1)*(cells/2)+1 for q in (z,y,x)])
    return map_coordinates(v,grid,order=3,mode="nearest").astype(np.float32)-.5
n0,n1,n2,n3=[noise(f) for f in (5,12,26,52)]
X=x+.13*n0+.041*n2
Y=y+.12*noise(6)+.04*n1
Z=z+.13*noise(5)+.036*n3
surface=np.sqrt((X*1.10)**2+(Y*1.03)**2+(Z*.98)**2)-.515
def unite(center,r,soft):
    global surface
    a,b,c=center
    d=np.sqrt((X-a)**2+(Y-b)**2+(Z-c)**2)-r
    h=np.maximum(soft-np.abs(surface-d),0)/soft
    surface=np.minimum(surface,d)-h*h*soft*.25
for j in range(36):
    t=(j+.5)/36;nz=1-2*t
    a=j*2.399963+rng.uniform(-.17,.17)
    vec=np.array((np.sqrt(1-nz*nz)*np.cos(a),nz,np.sqrt(1-nz*nz)*np.sin(a)))
    center=vec*rng.uniform(.40,.56)
    radius=rng.uniform(.178,.292)
    unite(center,radius,.077)
    for k in range(3):
        offset=vec+rng.normal(0,.62,3);offset/=np.linalg.norm(offset)
        unite(center+offset*radius*.78,radius*rng.uniform(.39,.68),.038)
surface+=.063*n1+.035*n2+.014*n3
density=np.clip((.051-surface)/.13,0,1)
density=density*density*(3-2*density)*np.clip(.86+.17*n1+.12*n3,.55,1)
gz,gy,gx=np.gradient(gaussian_filter(surface,.65))
l1=np.abs(gx)+np.abs(gy)+np.abs(gz)+1e-10
ox=gx/l1;oy=gy/l1
nx=np.where(gz<0,(1-np.abs(oy))*np.sign(ox),ox)
ny=np.where(gz<0,(1-np.abs(ox))*np.sign(oy),oy)
rad=np.sqrt(X*X+Y*Y+Z*Z)
mag=np.sqrt(gx*gx+gy*gy+gz*gz)+1e-9
curvature=np.gradient(gx/mag,axis=2)+np.gradient(gy/mag,axis=1)+np.gradient(gz/mag,axis=0)
relief=np.clip(gaussian_filter(curvature,.55)*2.30,-.34,.23)
fuel=np.clip(.77-.59*rad+.39*n0+.25*n1+.17*n2+.065*n3+relief,0,1)
field=np.stack((density,nx*.5+.5,ny*.5+.5,fuel),axis=-1)
rgba=np.rint(field*255).clip(0,255).astype(np.uint8)
rgba[density<.001]=0
atlas=rgba.reshape(14,8,N,N,4).transpose(0,2,1,3,4).reshape(14*N,8*N,4)
buf=io.BytesIO();Image.fromarray(atlas).save(buf,format="PNG",compress_level=9)
Path(sys.argv[1]).write_bytes(b'window.astraPyroField="'+base64.b64encode(buf.getvalue())+b'";\n')
print("Baked",N,"cubed,",len(buf.getvalue()),"compressed bytes")
