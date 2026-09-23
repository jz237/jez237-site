"""Offline, periodic coral-cup relief. Original artistic tissue, no external assets.

Run from any directory with Python, numpy and Pillow. The jittered sites wrap on
a torus so the normal map and filtered albedo have no hard texture boundaries.
"""
from pathlib import Path
import numpy as np
from PIL import Image

N = 512
CELLS = 18
rng = np.random.default_rng(23092338)
y, x = np.mgrid[:N, :N].astype(float)
x *= CELLS / N
y *= CELLS / N
rim = np.zeros((N,N))
basin = np.zeros((N,N))
mouth = np.zeros((N,N))
ribs = np.zeros((N,N))
pigment = np.zeros((N,N))

def tissue_noise(scale):
    """Band-limited periodic tissue, without a visible crosshatched grain."""
    f = np.fft.fftfreq(N)
    band = np.exp(-(f[:, None]**2 + f[None, :]**2) * scale**2)
    field = np.fft.ifft2(np.fft.fft2(rng.normal(size=(N,N))) * band).real
    return field / field.std()

coarse, fine = tissue_noise(55), tissue_noise(9)
for cy in range(CELLS):
    for cx in range(CELLS):
        px = cx + .5 + (cy % 2)*.5 + rng.uniform(-.30, .30)
        py = cy + .5 + rng.uniform(-.30, .30)
        dx, dy = (x-px+CELLS/2) % CELLS-CELLS/2, (y-py+CELLS/2) % CELLS-CELLS/2
        # Unequal axes, offset walls and interrupted septa avoid stamped flowers.
        rotation = rng.uniform(0, 2*np.pi)
        dx, dy = dx*np.cos(rotation)-dy*np.sin(rotation), dx*np.sin(rotation)+dy*np.cos(rotation)
        stretch = rng.uniform(.76,1.25)
        dx, dy = dx*stretch, dy/stretch
        angle = np.arctan2(dy,dx)
        phase, size = rng.uniform(0,2*np.pi), rng.uniform(.27,.48)
        r = np.hypot(dx,dy)/(size*(1+.13*np.sin(angle*3+phase)+.065*np.cos(angle*5-phase)))
        # Smoothly summed profiles avoid discontinuous nearest-site borders.
        rim += np.exp(-((r-.90)/.14)**2) * (.72+.28*np.sin(angle*2+phase)**2)
        basin += np.exp(-(r/.60)**4)
        mouth += np.exp(-((dx/(size*.12))**2+(dy/(size*.24))**2)*2)
        septa = (.5+.5*np.cos(angle*rng.integers(12,21)+phase+np.sin(r*5+phase)*.52))**5
        ribs += septa*np.exp(-((r-.67)/.34)**4) * (.6+.4*np.cos(angle*3-phase)**2)
        pigment += rng.uniform(-.035,.035)*np.exp(-(r/.95)**4)
# Fine continuous coenenchyme between cups, with subtle pigment clouds. Relief
# is deliberately shallower than the old large, embossed radial flower stamps.
grain = .0025*fine + .002*coarse
height = .055*rim - .025*basin - .023*mouth + .019*ribs + grain
tone = .76 + .055*rim - .048*basin - .15*mouth + .025*ribs + pigment + .013*coarse + .004*fine
albedo = np.stack([tone+.009*coarse, tone+.018*basin, tone-.012*rim-.007*coarse], axis=-1)
# OpenGL tangent-space normals; same increasing-image-row convention as the
# existing reef maps (Texture.flipY=false).
dx = (np.roll(height,-1,axis=1)-np.roll(height,1,axis=1))*5
dy = (np.roll(height,-1,axis=0)-np.roll(height,1,axis=0))*5
normal = np.stack([-dx, -dy, np.ones_like(dx)],axis=-1)
normal /= np.linalg.norm(normal,axis=-1)[...,None]
rough = np.clip(.85 + .055*basin + .008*fine - .012*rim,0,1)
out = Path(__file__).resolve().parent.parent/'assets'/'encrusting'
out.mkdir(parents=True,exist_ok=True)
for name, data in [('map',albedo),('normalMap',normal*.5+.5),('roughnessMap',np.repeat(rough[...,None],3,axis=-1))]:
    assert np.isfinite(data).all()
    Image.fromarray(np.uint8(np.clip(data,0,1)*255)).save(out/(name+'.png'),optimize=True)
print('Baked three 512px encrusting coral maps:',sum(p.stat().st_size for p in out.glob('*.png')),'bytes')
