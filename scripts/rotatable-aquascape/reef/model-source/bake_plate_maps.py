"""Original offline relief for a Montipora-like plate, not a species scan.

Jittered immersed cups, asymmetric hoods and fine connected tissue ridges.
Periodic profiles and derivatives keep repeated maps seamless. No paid assets.
"""
from pathlib import Path
import numpy as np
from PIL import Image

N, CELLS = 512, 10
rng = np.random.default_rng(23092351)
y, x = np.mgrid[:N, :N].astype(float)
x *= CELLS/N
y *= CELLS/N
cup = np.zeros((N,N))
rim = np.zeros_like(cup)
hood = np.zeros_like(cup)
septa = np.zeros_like(cup)
for cy in range(CELLS):
    for cx in range(CELLS):
        px, py = cx+.5+rng.uniform(-.32,.32), cy+.5+rng.uniform(-.32,.32)
        dx, dy = (x-px+CELLS/2)%CELLS-CELLS/2, (y-py+CELLS/2)%CELLS-CELLS/2
        angle = np.arctan2(dy,dx)
        phase, radius = rng.uniform(0,2*np.pi), rng.uniform(.17,.25)
        r = np.hypot(dx,dy)/(radius*(1+.08*np.sin(angle*3+phase)))
        cup += np.exp(-(r/.66)**4)
        rim += np.exp(-((r-.97)/.22)**2)
        hood += np.exp(-((r-1.28)/.29)**2)*(.5+.5*np.cos(angle-phase))**3
        septa += (.5+.5*np.cos(angle*12+phase))**5*np.exp(-((r-.60)/.28)**4)

# Short interrupted ridges and smaller granular tissue between cups. All
# frequencies are integral over the tile, including their phase modulation.
tau = 2*np.pi/CELLS
flow = np.sin(x*tau*17+np.sin(y*tau*5)*1.25+.6*np.sin(x*tau*3))
ridges = np.maximum(0,flow)**4*(.48+.52*(.5+.5*np.sin(y*tau*11+x*tau*3)))
grains = (np.sin(x*tau*79+np.sin(y*tau*13)) * np.sin(y*tau*73+np.sin(x*tau*11)))**4
height = -.060*cup + .052*rim + .095*hood + .027*septa + .035*ridges + .010*grains
tone = .75-.145*cup+.065*rim+.10*hood+.035*septa+.045*ridges+.02*grains
variation = 1+.045*np.sin(x*tau*2+np.sin(y*tau))*np.cos(y*tau*3)
albedo = np.stack([tone*variation, (tone-.025*cup)*variation*.96, tone*variation*.88],axis=-1)
dx = (np.roll(height,-1,axis=1)-np.roll(height,1,axis=1))*6
dy = (np.roll(height,-1,axis=0)-np.roll(height,1,axis=0))*6
normal = np.stack([-dx,-dy,np.ones_like(dx)],axis=-1)
normal /= np.linalg.norm(normal,axis=-1)[...,None]
rough = np.clip(.83+.075*cup-.03*hood+.02*grains,0,1)
out = Path(__file__).resolve().parent.parent/'assets'/'plate'
out.mkdir(parents=True,exist_ok=True)
for name,data in [('map',albedo),('normalMap',normal*.5+.5),('roughnessMap',np.repeat(rough[...,None],3,axis=-1))]:
    assert np.isfinite(data).all()
    Image.fromarray(np.uint8(np.clip(data,0,1)*255)).save(out/(name+'.png'),optimize=True)
print('Baked plate tissue:',sum(p.stat().st_size for p in out.glob('*.png')),'bytes')
