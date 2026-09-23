"""Original seamless porous carbonate surface, baked offline at 1K.
Fine pits are surface relief; the existing eroded rock supplies actual volume.
No external image or paid service. Image rows run downward; flipY=True gives
OpenGL tangent normal green = positive image-row height derivative.
"""
from pathlib import Path
import numpy as np
from PIL import Image
N=1024
rng=np.random.default_rng(2309232142)
def field(scale):
 f=np.fft.fftfreq(N);a=np.fft.ifft2(np.fft.fft2(rng.normal(size=(N,N)))*np.exp(-(f[:,None]**2+f[None,:]**2)*scale**2)).real
 return a/a.std()
coarse=field(120);grain=field(19);micro=field(4)
pits=np.zeros((N,N));rims=np.zeros_like(pits);floor=np.zeros_like(pits)
for count,lo,hi,strength in [(540,5,18,1),(3900,1.2,4.5,.32)]:
 for i in range(count):
  cx,cy=rng.uniform(0,N,2);radius=rng.uniform(lo,hi);extent=int(np.ceil(radius*2.4));ix=np.arange(int(cx)-extent,int(cx)+extent+1);iy=np.arange(int(cy)-extent,int(cy)+extent+1)
  yy,xx=np.meshgrid(iy-cy,ix-cx,indexing='ij');angle=rng.uniform(0,2*np.pi);u=(xx*np.cos(angle)+yy*np.sin(angle))/radius;v=(-xx*np.sin(angle)+yy*np.cos(angle))/radius/rng.uniform(.48,1.0)
  theta=np.arctan2(v,u);phase=rng.uniform(0,6.28);distance=np.hypot(u,v)/(1+.14*np.sin(theta*3+phase)+.07*np.cos(theta*5-phase))
  # Offset adjoining dissolution pocket; the shared opening is never a stamp.
  secondary=np.hypot((u-.37)*1.3,(v+.17)*1.35)
  distance=np.minimum(distance,secondary)
  basin=np.exp(-(distance/.72)**4);rim=np.exp(-((distance-1)/.13)**2)*( .6+.4*np.sin(theta*2+phase)**2)
  shade=np.exp(-(distance/.51)**4)
  index=np.ix_(iy%N,ix%N);depth=strength*rng.uniform(.65,1.25)
  pits[index]+=basin*depth;rims[index]+=rim*depth;floor[index]+=shade*depth
pits=1-np.exp(-pits);floor=1-np.exp(-floor)
# Discontinuous mineral grains, pale weathered rims and fine sheltered films.
mineral=np.maximum(0,grain-.3);crust=np.clip((coarse+.30*grain-.55)/1.35,0,1)
height=.19*rims-.28*pits+.030*grain+.012*micro+.012*mineral
shade=.49+.050*grain+.013*micro+.065*rims-.20*pits-.065*floor
albedo=np.stack([shade*1.05,shade*1.015,shade*.91],axis=-1)
crustColor=np.stack([.40+.015*grain,.30+.025*grain,.32+.015*grain],axis=-1)
albedo=albedo*(1-crust[...,None]*.34)+crustColor*crust[...,None]*.34
# Preserve pore color beneath sheltered films instead of black painted spots.
dx=(np.roll(height,-1,1)-np.roll(height,1,1))*2.8
dy=(np.roll(height,-1,0)-np.roll(height,1,0))*2.8
normal=np.stack([-dx,dy,np.ones_like(dx)],axis=-1);normal/=np.linalg.norm(normal,axis=-1)[...,None]
rough=np.clip(.88+.06*pits+.018*grain-.05*rims, .69,.99)
out=Path(__file__).resolve().parent.parent/'assets'/'limestone';out.mkdir(parents=True,exist_ok=True)
for name,data in [('map',albedo),('normalMap',np.concatenate([normal*.5+.5,rough[...,None]],axis=-1))]:
 assert np.isfinite(data).all()
 Image.fromarray(np.uint8(np.clip(data,0,1)*255)).save(out/(name+'.png'),optimize=True)
print('Original porous limestone 1K maps:',sum(p.stat().st_size for p in out.glob('*.png')),'bytes')
