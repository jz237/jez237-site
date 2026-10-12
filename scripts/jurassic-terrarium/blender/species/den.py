"""The T. rex den: a basalt overhang at the foot of the right-hand peak (not an animal; it reuses the
distance-field mesher and the bake).

Built in 'animal space' like the dinosaurs, so the mouth faces +x here, which the exporter turns into
+z in the scene (towards the front glass). Metres; the floor of the hollow is z = 0. The runtime
places it so the hollow sits on the level shelf patched into the terrain (see tools/build-page.mjs).
Overall about 22 m wide, 13 m deep and 11 m high; the hollow is 15 m wide, 7 m deep, 6.5 m high.
"""
import math
import numpy as np
from anatomy import Body, V
from sdf import Ellipsoid, Box, Prim, rot_euler


def _hash(ix, iy, iz):
    h = (ix * 374761393 + iy * 668265263 + iz * 2147483647) & 0xFFFFFFFF
    h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFF) / 65535.0


def value_noise(P):
    """3D value noise in [-1, 1], vectorised."""
    f = np.floor(P)
    t = P - f
    t = t * t * (3 - 2 * t)
    i = f.astype(np.int64)
    out = 0.0
    for dx in (0, 1):
        for dy in (0, 1):
            for dz in (0, 1):
                w = (t[:, 0] if dx else 1 - t[:, 0]) * (t[:, 1] if dy else 1 - t[:, 1]) * (t[:, 2] if dz else 1 - t[:, 2])
                out = out + w * _hash(i[:, 0] + dx, i[:, 1] + dy, i[:, 2] + dz)
    return out * 2 - 1


def fbm(P, octaves=4):
    s, a, out = 1.0, 0.5, 0.0
    for _ in range(octaves):
        out = out + a * value_noise(P * s)
        s *= 2.03
        a *= 0.5
    return out


class Rock(Prim):
    """A primitive roughened by fractal noise, plus horizontal strata (basalt flows)."""

    def __init__(self, inner, amp=0.6, freq=0.35, strata=0.25, **kw):
        super().__init__(k=inner.k, tag=inner.tag, op=inner.op, name=inner.name, detail=inner.detail, **kw)
        self.inner = inner
        self.amp, self.freq, self.strata = amp, freq, strata

    def dist(self, P):
        d = self.inner.dist(P)
        n = fbm(P * self.freq + 7.3)
        z = P[:, 2]
        warp = fbm(P * 0.18 + 2.1, 3)
        st = self.strata * (np.abs(np.sin(z * 1.3 + warp * 3.0)) * 0.7 + np.abs(np.sin(z * 3.1 + warp * 5.0)) * 0.3)
        return d - self.amp * n + st

    def bbox(self):
        lo, hi = self.inner.bbox()
        return lo - self.amp - 0.5, hi + self.amp + 0.5


def build():
    b = Body('den')
    b.bone('root', V(0, 0, 0), V(0, 0, 1))
    # the rock mass: tilted, rounded basalt blocks (columns and slabs), roughened, stepping up the slope
    rng = np.random.default_rng(42)
    blocks = [
        # centre (a fwd, s left, z up), half extents, tilt (rx, ry, rz)
        ((-2.0, 0.0, 4.2), (5.5, 9.5, 4.5), (0.0, 0.08, 0.0)),
        ((-5.5, -5.5, 4.0), (5.0, 4.5, 5.5), (0.12, 0.05, 0.25)),
        ((-5.0, 5.8, 3.5), (5.0, 4.5, 5.0), (-0.1, 0.06, -0.2)),
        ((-7.5, 0.5, 8.0), (5.0, 8.0, 4.0), (0.05, -0.12, 0.1)),
        ((0.8, -8.6, 2.2), (3.0, 2.6, 3.0), (0.25, 0.1, 0.4)),
        ((1.2, 8.9, 1.8), (2.8, 2.4, 2.6), (-0.3, 0.1, -0.5)),
        ((2.8, -6.0, 0.8), (1.6, 1.4, 1.2), (0.4, 0.2, 0.9)),
        ((3.2, 6.4, 0.7), (1.4, 1.5, 1.0), (-0.2, 0.3, 0.3)),
        ((-1.0, -2.5, 8.6), (3.2, 3.5, 1.4), (0.08, 0.1, 0.4)),
        ((-0.6, 3.5, 8.4), (3.0, 3.0, 1.3), (-0.1, 0.06, -0.3)),
    ]
    for c, h, (rx, ry, rz) in blocks:
        b.add(Rock(Box(c, h, R=rot_euler(rx, ry, rz), round=1.2, k=0.9, bind=0, name='rock'),
                   amp=0.55, freq=0.4, strata=0.2))
    # the hollow: a flattened half-dome scooped out of the front, open at the bottom and the front
    hollow = Ellipsoid((1.6, 0.0, 0.0), (7.2, 7.4, 6.4), k=0.8, op='sub', name='hollow')
    b.add(Rock(hollow, amp=0.5, freq=0.5, strata=0.15))
    # nothing below the floor: the terrain is the floor
    b.add(Box((0, 0, -6.0), (30, 30, 6.0), k=0.0, op='sub', name='cut'))
    b.meta = dict(
        name='den', common='Den', length=22.0, voxel=0.06, faces=36000, tex=2048, static=True,
        palette=dict(back='#5d5853', flank='#6c665f', belly='#4a4642', pattern='#2f2c29', accent='#55663a',
                     keratin='#6c665f', claw='#6c665f', mouth='#6c665f', eye='#6c665f'),
        pattern=dict(kind='mottle', mottle=0.5),
        scales=dict(base=0.25, feature=0.6, border=0.5, folds=0.0, bump=1.2),
        gait=dict(kind='static'),
    )
    return b
