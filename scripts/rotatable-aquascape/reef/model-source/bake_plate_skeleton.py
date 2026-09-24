"""Original plate underside study: small irregular pores in connected pale relief.

RGB is a tangent normal, alpha is linear cavity shading. Periodic distances and
derivatives retain seamless repeat and ordinary mip filtering. No photo/asset API.
"""
from pathlib import Path
import numpy as np
from PIL import Image

N, CELLS = 512, 9
rng = np.random.default_rng(2309240254)
y, x = np.mgrid[:N, :N].astype(float)
x *= CELLS/N
y *= CELLS/N
cavity = np.zeros((N, N))
lip = np.zeros_like(cavity)
tau = 2*np.pi/CELLS
x += .27*np.sin(y*tau*2)+.15*np.cos(y*tau*5)
y += .21*np.sin(x*tau*3)
for row in range(CELLS):
    for col in range(CELLS):
        if rng.random()<.12: continue
        px, py = col+.5+rng.uniform(-.37,.37), row+.5+rng.uniform(-.37,.37)
        dx, dy = (x-px+CELLS/2)%CELLS-CELLS/2, (y-py+CELLS/2)%CELLS-CELLS/2
        a = rng.uniform(0, np.pi)
        u, v = dx*np.cos(a)+dy*np.sin(a), -dx*np.sin(a)+dy*np.cos(a)
        r = np.hypot(u/rng.uniform(.10,.22), v/rng.uniform(.23,.44))
        cavity += np.exp(-(r/.70)**4)
        lip += np.exp(-((r-1)/.27)**2)
grain = (np.sin(x*tau*69+np.sin(y*tau*11))*np.sin(y*tau*63+np.sin(x*tau*13)))**4
web = np.maximum(0,np.sin(x*tau*16+np.sin(y*tau*7)*1.4))**5
height = -.08*cavity + .038*lip + .018*web + .008*grain
dx = (np.roll(height,-1,axis=1)-np.roll(height,1,axis=1))*7
dy = (np.roll(height,-1,axis=0)-np.roll(height,1,axis=0))*7
normal = np.stack([-dx,-dy,np.ones_like(dx)],axis=-1)
normal /= np.linalg.norm(normal,axis=-1)[...,None]
tone = .85-.25*cavity+.10*lip+.025*grain+.018*web
rgba = np.concatenate([normal*.5+.5,tone[...,None]],axis=-1)
assert np.isfinite(rgba).all()
out = Path(__file__).resolve().parent.parent/'assets'/'plate'/'skeleton.png'
Image.fromarray(np.uint8(np.clip(rgba,0,1)*255)).save(out,optimize=True)
print('Baked plate skeleton:', out.stat().st_size, 'bytes')
