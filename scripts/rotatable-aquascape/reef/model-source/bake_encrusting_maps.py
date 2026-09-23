"""Offline, periodic coral-cup relief. Original artistic tissue, no external assets.

Run from any directory with Python, numpy and Pillow. The jittered sites wrap on
a torus so the normal map and filtered albedo have no hard texture boundaries.
"""
from pathlib import Path
import numpy as np
from PIL import Image

N = 512
CELLS = 10
rng = np.random.default_rng(23092338)
y, x = np.mgrid[:N, :N].astype(float)
x *= CELLS / N
y *= CELLS / N
rim = np.zeros((N,N))
basin = np.zeros((N,N))
mouth = np.zeros((N,N))
ribs = np.zeros((N,N))
for cy in range(CELLS):
    for cx in range(CELLS):
        px, py = cx + .5 + rng.uniform(-.25, .25), cy + .5 + rng.uniform(-.25, .25)
        dx, dy = (x-px+CELLS/2) % CELLS-CELLS/2, (y-py+CELLS/2) % CELLS-CELLS/2
        angle = np.arctan2(dy,dx)
        phase, size = rng.uniform(0,2*np.pi), rng.uniform(.27,.43)
        r = np.hypot(dx,dy)/(size*(1+.055*np.sin(angle*5+phase)))
        # Smoothly summed profiles avoid discontinuous nearest-site borders.
        rim += np.exp(-((r-.91)/.18)**2)
        basin += np.exp(-(r/.52)**4)
        mouth += np.exp(-(r/.15)**2)
        septa = (.5+.5*np.cos(angle*18+phase+np.sin(r*4+phase)*.22))**5
        ribs += septa*np.exp(-((r-.62)/.42)**4)
grain = np.sin(x*np.pi*68)*np.sin(y*np.pi*72)*.004
height = .10*rim - .033*basin - .037*mouth + .035*ribs + grain
tone = .76 + .10*rim - .09*basin - .21*mouth + .055*ribs + grain*1.5
variation = 1+.025*np.sin(x*2*np.pi/CELLS)*np.cos(y*4*np.pi/CELLS)
albedo = np.stack([tone*variation, (tone+.035*basin)*variation, (tone-.035*rim)*variation], axis=-1)
# OpenGL tangent-space normals; same increasing-image-row convention as the
# existing reef maps (Texture.flipY=false).
dx = (np.roll(height,-1,axis=1)-np.roll(height,1,axis=1))*5
dy = (np.roll(height,-1,axis=0)-np.roll(height,1,axis=0))*5
normal = np.stack([-dx, -dy, np.ones_like(dx)],axis=-1)
normal /= np.linalg.norm(normal,axis=-1)[...,None]
rough = np.clip(.83 + .08*basin + .015*rim,0,1)
out = Path(__file__).resolve().parent.parent/'assets'/'encrusting'
out.mkdir(parents=True,exist_ok=True)
for name, data in [('map',albedo),('normalMap',normal*.5+.5),('roughnessMap',np.repeat(rough[...,None],3,axis=-1))]:
    assert np.isfinite(data).all()
    Image.fromarray(np.uint8(np.clip(data,0,1)*255)).save(out/(name+'.png'),optimize=True)
print('Baked three 512px encrusting coral maps:',sum(p.stat().st_size for p in out.glob('*.png')),'bytes')
