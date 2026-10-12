"""Skeleton + flesh builders shared by every species.

A species module defines a function build() -> Body. A Body holds:
  - skel: bones in the rest pose (animal space, metres; +x forward, +y left, +z up),
  - field: the signed-distance sculpture of the flesh (sdf.Field),
  - attachments: rigid extra meshes that are not part of the field (eyeballs, teeth),
  - meta: palette, gait, scale and behaviour hints read by the Blender stage and the runtime.

Left-side parts are written once and mirrored with Body.mirror_y().
"""
import math
import numpy as np
import sdf
from sdf import Loft, Ellipsoid, RoundCone, Xform, chain_binding, rot_euler, normalize

V = lambda *a: np.array(a, dtype=np.float64)


class Skeleton:
    def __init__(self):
        self.names, self.head, self.tail, self.parent, self.zhint = [], [], [], [], []
        self.idx = {}

    def add(self, name, head, tail, parent=None, z=(0, 0, 1)):
        i = len(self.names)
        self.names.append(name)
        self.head.append(np.asarray(head, float))
        self.tail.append(np.asarray(tail, float))
        self.parent.append(-1 if parent is None else self.idx[parent])
        self.zhint.append(np.asarray(z, float))
        self.idx[name] = i
        return i

    def __getitem__(self, name):
        return self.idx[name]

    def mid(self, name):
        i = self.idx[name]
        return 0.5 * (self.head[i] + self.tail[i])

    def to_json(self):
        return [dict(name=n, head=h.tolist(), tail=t.tolist(), parent=p, z=z.tolist())
                for n, h, t, p, z in zip(self.names, self.head, self.tail, self.parent, self.zhint)]


class Body:
    def __init__(self, name):
        self.name = name
        self.skel = Skeleton()
        self.field = sdf.Field()
        self.attachments = []  # dicts: kind, bone, ... (built as meshes in Blender)
        self.meta = {}

    # ------------------------------------------------------------------ skeleton helpers
    def bone(self, *a, **kw):
        return self.skel.add(*a, **kw)

    def chain(self, prefix, points, parent, z=(0, 0, 1), names=None):
        """Bones along consecutive points; returns list of indices."""
        out = []
        for i in range(len(points) - 1):
            nm = names[i] if names else f'{prefix}{i + 1}'
            out.append(self.skel.add(nm, points[i], points[i + 1], parent, z=z))
            parent = nm
        return out

    # ------------------------------------------------------------------ flesh helpers
    def add(self, prim):
        return self.field.add(prim)

    def loft_chain(self, sections, bones, joint_points, blend=0.05, side=(0, 1, 0), k=0.1, tag='skin',
                   samples=10, detail=1.0, name='', cap=True, region=None):
        """A loft bound to a bone chain; joint_points are 3D positions of the internal joints.
        blend is in metres (converted to loft parameter)."""
        lf = Loft(sections, side=side, samples_per_seg=samples, k=k, tag=tag, name=name, detail=detail, cap=cap)
        lf.chain = list(bones)
        lf.region = region
        if len(bones) == 1:
            lf.bind = bones[0]
        else:
            J = np.array(joint_points, float)
            ju = lf.param(J)
            total = sum(np.linalg.norm(np.asarray(sections[i + 1]['p']) - np.asarray(sections[i]['p']))
                        for i in range(len(sections) - 1))
            lf.bind = chain_binding(lf, bones, ju, blend / max(total, 1e-6))
        return self.add(lf)

    def mirror_y(self, prims):
        """Return mirrored copies (y -> -y) of left-side primitives, rebinding .L bones to .R."""
        out = []
        M = np.diag([1.0, -1.0, 1.0])
        for p in prims:
            q = _Mirror(p, self.skel)
            out.append(self.add(q))
        return out


class _Mirror(sdf.Prim):
    def __init__(self, inner, skel):
        super().__init__(k=inner.k, tag=inner.tag, op=inner.op, name=inner.name + '.mirror', detail=inner.detail,
                         accent=inner.accent)
        self.inner = inner
        self.mirrored = True
        self.region = (inner.region[:-2] + '.R') if (inner.region or '').endswith('.L') else inner.region
        self.skel = skel
        self.bind = True

    @staticmethod
    def _m(P):
        Q = P.copy()
        Q[:, 1] = -Q[:, 1]
        return Q

    def dist(self, P):
        return self.inner.dist(self._m(P))

    def bbox(self):
        lo, hi = self.inner.bbox()
        return np.array([lo[0], -hi[1], lo[2]]), np.array([hi[0], -lo[1], hi[2]])

    def binding(self, P):
        out = []
        for b, w in self.inner.binding(self._m(P)):
            nm = self.skel.names[b]
            if nm.endswith('.L'):
                b = self.skel.idx[nm[:-2] + '.R']
            out.append((b, w))
        return out


def sec(p, w, top=None, bot=None, nt=2.0, nb=2.0):
    return dict(p=np.asarray(p, float), w=w, top=w if top is None else top,
                bot=(w if top is None else top) if bot is None else bot, nt=nt, nb=nb)


def bezier(p0, p1, p2, n):
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t * t * p2


def claw(base, direction, length, radius, curl, side, k=0.008, tag='claw', bind=None, flat=0.75):
    """A curved, laterally flattened keratin claw: a loft along a quadratic arc bent towards 'curl'
    (unit vector, usually down)."""
    base = np.asarray(base, float)
    d = normalize(direction)
    c = normalize(curl)
    p1 = base + d * length * 0.55
    p2 = base + d * length * 0.9 + c * length * 0.45
    pts = bezier(base, p1, p2, 5)
    rs = [radius, radius * 0.8, radius * 0.55, radius * 0.3, radius * 0.06]
    secs = [sec(p, r * flat, r, r * 0.8) for p, r in zip(pts, rs)]
    return Loft(secs, side=side, samples_per_seg=6, k=k, tag=tag, bind=bind, detail=0.2)


def horn(base, tip, r0, bend, side, k=0.04, tag='keratin', bind=None, samples=6, flat=1.0, n=6):
    """A tapering horn from base to tip, bowed by vector 'bend' at its middle."""
    base, tip, bend = (np.asarray(x, float) for x in (base, tip, bend))
    mid = 0.5 * (base + tip) + bend
    pts = bezier(base, mid, tip, n)
    secs = []
    for i, p in enumerate(pts):
        f = i / (n - 1)
        r = r0 * (1 - f) ** 0.85 + 0.004
        secs.append(sec(p, r * flat, r, r))
    return Loft(secs, side=side, samples_per_seg=samples, k=k, tag=tag, bind=bind, detail=0.3)
