"""Pteranodon longiceps: adult male, sculpted in gliding flight (the rest pose).

After Bennett (2001) and Witton (2013), via the research spec:
  - span 6.0 m by the bone sum: humerus 0.28, ulna 0.44, wing metacarpal (MC IV) 0.70, wing-finger
    phalanges 0.62 / 0.44 / 0.26 / 0.14 m, shoulder width 0.25 m. The glide pose flexes the elbow,
    wrist and wing finger a little, so the tips are ~5.75 m apart.
  - skull + crest ~1.6 m (beak tip -> jaw joint 0.95 m); the crest is a thin blade angled ~18-25 deg
    above the skull axis, reaching ~0.55 m behind the occiput. Toothless keratin beak.
  - neck 0.55 m, torso 0.45 m (notarium), tail stub 0.22 m: 2.29 m from beak tip to tail tip.
  - hind limbs femur 0.20, tibia 0.33, metatarsus 0.08, pes ~0.1 m, trailing in flight.
  - brachiopatagium from the wing tip to the ankle with a concave trailing edge, propatagium in
    front of the arm from the neck base to the pteroid at the wrist, a small uropatagium between
    the inner thighs and the tail base. Aspect ratio ~9.6, ~3.5 m^2 of wing (planform incl. body).
Short pycnofibre fuzz on body, neck and proximal limbs; bare beak and crest.

The membrane is a custom thin-sheet primitive (Sheet, below): a planform polygon in the xy plane
lifted onto a smooth mid-surface z = f(x, y), with an exact-ish distance (rounded edges) and a
skinning map that follows the arm/finger bones along the span and blends to the body and legs at
the root and the trailing edge.
"""
import math
import numpy as np
import sdf
from anatomy import Body, sec, claw, V, bezier
from sdf import Loft, Ellipsoid, RoundCone, Xform, rot_euler, normalize

JAW_OPEN = math.radians(1.3)  # a small gap between the rhamphothecae
TAG_SIGMA = 0.0035  # material blend width in metres (see the wing colour notes in build())


# ------------------------------------------------------------------------------ helpers
def _sstep(e0, e1, x):
    t = np.clip((np.asarray(x, float) - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


def _dir(yaw, pitch):
    """Unit vector for a left-side limb segment: yaw = degrees from lateral (+y) towards forward (+x),
    pitch = degrees above horizontal."""
    a, p = math.radians(yaw), math.radians(pitch)
    return V(math.sin(a) * math.cos(p), math.cos(a) * math.cos(p), math.sin(p))


def _poly_sdf(P2, poly):
    """Signed distance from 2D points (n, 2) to a closed polygon (m, 2); negative inside (IQ)."""
    d = np.full(len(P2), np.inf)
    s = np.ones(len(P2))
    m = len(poly)
    for i in range(m):
        vi, vj = poly[i], poly[i - 1]
        e = vj - vi
        w = P2 - vi
        t = np.clip((w @ e) / max(float(e @ e), 1e-18), 0.0, 1.0)
        q = w - t[:, None] * e
        d = np.minimum(d, q[:, 0] ** 2 + q[:, 1] ** 2)
        c1 = P2[:, 1] >= vi[1]
        c2 = P2[:, 1] < vj[1]
        c3 = e[0] * w[:, 1] > e[1] * w[:, 0]
        flip = (c1 & c2 & c3) | (~c1 & ~c2 & ~c3)
        s = np.where(flip, -s, s)
    return s * np.sqrt(d)


def _box(A, r, axis):
    pad = [(0, 0), (0, 0)]
    pad[axis] = (r + 1, r)
    c = np.cumsum(np.pad(A, pad, mode='edge'), axis=axis)
    n = A.shape[axis]
    return (np.take(c, np.arange(2 * r + 1, 2 * r + 1 + n), axis=axis) - np.take(c, np.arange(n), axis=axis)) / (2 * r + 1)


def _blur(A, cells):
    r = max(1, int(round(cells)))
    for ax in (0, 1):
        for _ in range(3):
            A = _box(A, r, ax)
    return A


def _seg_dist2d(X, Y, a, b):
    a, b = np.asarray(a, float)[:2], np.asarray(b, float)[:2]
    e = b - a
    t = np.clip(((X - a[0]) * e[0] + (Y - a[1]) * e[1]) / max(float(e @ e), 1e-12), 0, 1)
    return np.hypot(X - a[0] - t * e[0], Y - a[1] - t * e[1])


def _softmin_bind(X, Y, segs, tau):
    """Bone weights from 2D distance to bone segments: [(bone, a, b), ...] -> {bone: weight map}."""
    D = np.stack([_seg_dist2d(X, Y, a, b) for _, a, b in segs])
    W = np.exp(-(D - D.min(axis=0, keepdims=True)) / tau)
    W /= W.sum(axis=0, keepdims=True)
    out = {}
    for (bone, _, _), w in zip(segs, W):
        out[bone] = out.get(bone, 0) + w
    return out


class Sheet(sdf.Prim):
    """A thin membrane: the planform polygon `poly` (xy plane, metres) lifted onto the mid-surface
    z = zfun(X, Y) with half-thickness hfun(X, Y, D) (D = signed planform distance). The edges are
    rounded with the half-thickness. Everything is rasterised once at `res` and sampled bilinearly,
    so evaluation is cheap; the distance is the extrusion distance corrected for the surface slope.
    bindfun(X, Y) -> {bone index: weight map} gives the skinning weights."""

    def __init__(self, poly, zfun, hfun, bindfun, res=0.004, pad=0.09, blur=0.012, **kw):
        super().__init__(**kw)
        poly = np.asarray(poly, float)
        lo = poly.min(axis=0) - pad
        hi = poly.max(axis=0) + pad
        nx = int(math.ceil((hi[0] - lo[0]) / res)) + 1
        ny = int(math.ceil((hi[1] - lo[1]) / res)) + 1
        xs = lo[0] + np.arange(nx) * res
        ys = lo[1] + np.arange(ny) * res
        X, Y = np.meshgrid(xs, ys, indexing='ij')
        D = _poly_sdf(np.stack([X.ravel(), Y.ravel()], 1), poly).reshape(nx, ny)
        Z = zfun(X, Y)
        if blur:
            Z = _blur(Z, blur / res)
        H = hfun(X, Y, D)
        gx, gy = np.gradient(Z, res)
        C = 1.0 / np.sqrt(1.0 + gx * gx + gy * gy)
        self.lo2 = lo
        self.hi2 = lo + (np.array([nx, ny]) - 1) * res
        self.res = res
        self.shape = (nx, ny)
        self.maps = np.stack([D, Z, H, C]).astype(np.float32)
        bw = bindfun(X, Y)
        self.bones = list(bw.keys())
        self.bmaps = np.stack([np.broadcast_to(bw[k], X.shape) for k in self.bones]).astype(np.float32)
        inside = D < 0.03
        zlo = float((Z - H)[inside].min())
        zhi = float((Z + H)[inside].max())
        self._lo = np.array([poly[:, 0].min() - 0.015, poly[:, 1].min() - 0.015, zlo - 0.01])
        self._hi = np.array([poly[:, 0].max() + 0.015, poly[:, 1].max() + 0.015, zhi + 0.01])
        self.bind = True
        self.poly = poly

    def _sample(self, M, x, y):
        nx, ny = self.shape
        fx = np.clip((x - self.lo2[0]) / self.res, 0, nx - 1.0001)
        fy = np.clip((y - self.lo2[1]) / self.res, 0, ny - 1.0001)
        i = fx.astype(np.int64)
        j = fy.astype(np.int64)
        tx = (fx - i).astype(np.float32)
        ty = (fy - j).astype(np.float32)
        return (M[:, i, j] * (1 - tx) * (1 - ty) + M[:, i + 1, j] * tx * (1 - ty)
                + M[:, i, j + 1] * (1 - tx) * ty + M[:, i + 1, j + 1] * tx * ty)

    def dist(self, P):
        x, y, z = P[:, 0], P[:, 1], P[:, 2]
        D, Z, H, C = self._sample(self.maps, x, y).astype(np.float64)
        ox = np.maximum(np.maximum(self.lo2[0] - x, x - self.hi2[0]), 0)
        oy = np.maximum(np.maximum(self.lo2[1] - y, y - self.hi2[1]), 0)
        D = D + np.hypot(ox, oy)
        dz = np.abs(z - Z) * C
        return np.sqrt(np.maximum(D + H, 0) ** 2 + dz * dz) - H

    def bbox(self):
        return self._lo, self._hi

    def binding(self, P):
        W = self._sample(self.bmaps, P[:, 0], P[:, 1]).astype(np.float64)
        W = np.maximum(W, 0)
        W /= np.maximum(W.sum(axis=0, keepdims=True), 1e-9)
        return [(b, w) for b, w in zip(self.bones, W)]


class SideSheet(Sheet):
    """A Sheet standing in the sagittal plane: the outline is a polygon in (x, z), the thickness is
    along y (mid-surface y = zfun(x, z)). Used for the cranial crest: a blade with rounded edges."""
    _perm = [0, 2, 1]

    def dist(self, P):
        return Sheet.dist(self, P[:, self._perm])

    def bbox(self):
        lo, hi = Sheet.bbox(self)
        return lo[self._perm], hi[self._perm]

    def binding(self, P):
        return Sheet.binding(self, P[:, self._perm])


class Tint(sdf.Prim):
    """Colour-only companion of a primitive: it never changes the shape, it only joins the surface's
    material / accent mix with a weight weight(P) in 0..1.

    Its distance is inner's plus a positive offset, so with k = 0 the union (a plain min against a field
    that already contains inner) leaves the field exactly as it is. Field.tag_weights weighs a primitive
    by exp(-d / sigma) at the surface, so an offset of -sigma ln(weight) gives it that weight. It carries
    no bone binding and inherits inner's UV region."""

    EPS = 2e-4

    def __init__(self, inner, weight, sigma, tag='skin', accent=0.0, name='tint'):
        super().__init__(k=0.0, tag=tag, accent=accent, detail=inner.detail, name=name)
        self.inner = inner
        self.weight = weight
        self.sigma = sigma

    def dist(self, P):
        w = np.clip(self.weight(P), 1e-4, 1.0)
        return self.inner.dist(P) + self.EPS - self.sigma * np.log(w)

    def bbox(self):
        return self.inner.bbox()


def _polyline_dist2d(X, Y, pts):
    """Distance from 2D points to a polyline (m, 2)."""
    pts = np.asarray(pts, float)
    d = np.full(np.shape(X), np.inf)
    for a, b in zip(pts[:-1], pts[1:]):
        d = np.minimum(d, _seg_dist2d(X, Y, a, b))
    return d


def _raster2d(fn, lo, hi, res):
    """Sample fn(X, Y) once on a grid over the xy box lo..hi; return a bilinear lookup f(P) (P: (n, 3))."""
    lo = np.asarray(lo, float)
    nx, ny = (int(math.ceil((hi[i] - lo[i]) / res)) + 1 for i in (0, 1))
    X, Y = np.meshgrid(lo[0] + np.arange(nx) * res, lo[1] + np.arange(ny) * res, indexing='ij')
    M = np.asarray(fn(X, Y), np.float32)

    def look(P):
        fx = np.clip((P[:, 0] - lo[0]) / res, 0, nx - 1.0001)
        fy = np.clip((P[:, 1] - lo[1]) / res, 0, ny - 1.0001)
        i, j = fx.astype(np.int64), fy.astype(np.int64)
        tx, ty = fx - i, fy - j
        return (M[i, j] * (1 - tx) * (1 - ty) + M[i + 1, j] * tx * (1 - ty) + M[i, j + 1] * (1 - tx) * ty
                + M[i + 1, j + 1] * tx * ty)

    return look


# ------------------------------------------------------------------------------ body
def build():
    b = Body('pteranodon')
    S_ = b.skel

    # -------------------------------------------------------------- skeleton: axis
    hip = V(0.0, 0.0, 0.445)
    b.bone('root', V(0, 0, 0), V(0, 0, 0.25))
    b.bone('pelvis', hip, V(0.12, 0, 0.455), 'root')
    spine_pts = [V(0.12, 0, 0.455), V(0.30, 0, 0.475), V(0.52, 0, 0.515)]
    b.chain('spine', spine_pts, 'pelvis')
    neck_pts = [V(0.52, 0, 0.515), V(0.70, 0, 0.556), V(0.88, 0, 0.596), V(1.05, 0, 0.628)]
    b.chain('neck', neck_pts, 'spine2')
    occ = neck_pts[-1]
    tip = V(2.065, 0, 0.590)  # beak tip
    b.bone('head', occ, tip, 'neck3')
    jaw_pivot = V(1.10, 0, 0.553)
    Rj = rot_euler(ry=JAW_OPEN)
    chin = (V(2.05, 0, 0.586) - jaw_pivot) @ Rj.T + jaw_pivot
    b.bone('jaw', jaw_pivot, chin, 'head')
    tail_tip = V(-0.22, 0, 0.430)
    b.bone('tail1', hip, tail_tip, 'pelvis')

    # -------------------------------------------------------------- skeleton: wing (left)
    Sh = V(0.45, 0.125, 0.520)  # glenoid
    wing_segs = [  # length, yaw (deg forward of lateral), pitch (deg up)
        ('upperarm', 0.28, -3, 9),
        ('forearm', 0.44, 11, 2),
        ('hand', 0.70, -1, -2),
        ('ph1', 0.62, -6, -4),
        ('ph2', 0.44, -15, -7),
        ('ph3', 0.26, -30, -10),
        ('ph4', 0.14, -50, -14),
    ]
    J = [Sh]
    for _, L, yaw, pitch in wing_segs:
        J.append(J[-1] + L * _dir(yaw, pitch))
    _, El, Wr, Kn4, F1, F2, F3, Tip = J  # elbow, wrist, wing-finger knuckle, phalanx joints, tip
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'upperarm.{s}', f(Sh), f(El), 'spine2')
        b.bone(f'forearm.{s}', f(El), f(Wr), f'upperarm.{s}')
        b.bone(f'hand.{s}', f(Wr), f(Kn4), f'forearm.{s}')
        b.bone(f'wingfinger1.{s}', f(Kn4), f(F1), f'hand.{s}')
        b.bone(f'wingfinger2.{s}', f(F1), f(F2), f'wingfinger1.{s}')
        b.bone(f'wingfinger3.{s}', f(F2), f(Tip), f'wingfinger2.{s}')

    # -------------------------------------------------------------- skeleton: hind limbs (left)
    Hp = V(0.0, 0.055, 0.440)
    Kn = Hp + 0.20 * normalize(V(-0.78, 0.45, -0.10))
    An = Kn + 0.33 * normalize(V(-0.90, 0.36, -0.02))
    Ball = An + 0.08 * normalize(V(-0.80, 0.16, -0.45))
    Toe = Ball + 0.075 * normalize(V(-0.85, 0.10, -0.40))
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'thigh.{s}', f(Hp), f(Kn), 'pelvis')
        b.bone(f'shin.{s}', f(Kn), f(An), f'thigh.{s}')
        b.bone(f'meta.{s}', f(An), f(Ball), f'shin.{s}')
        b.bone(f'toe.{s}', f(Ball), f(Toe), f'meta.{s}')

    # -------------------------------------------------------------- axial body (tail tip -> head)
    ax = [
        sec(tail_tip, 0.008, 0.008, 0.008),
        sec((-0.16, 0, 0.434), 0.017, 0.017, 0.018),
        sec((-0.08, 0, 0.440), 0.034, 0.036, 0.040),
        sec((0.00, 0, 0.447), 0.054, 0.056, 0.066),
        sec((0.10, 0, 0.456), 0.080, 0.070, 0.090),
        sec((0.22, 0, 0.469), 0.104, 0.080, 0.106),
        sec((0.34, 0, 0.486), 0.116, 0.084, 0.112),
        sec((0.44, 0, 0.502), 0.112, 0.080, 0.098),
        sec((0.53, 0, 0.520), 0.074, 0.066, 0.070),
        sec((0.62, 0, 0.539), 0.050, 0.048, 0.050),
        sec((0.76, 0, 0.568), 0.042, 0.042, 0.044),
        sec((0.90, 0, 0.600), 0.040, 0.041, 0.042),
        sec((1.00, 0, 0.619), 0.042, 0.045, 0.045),
        sec((1.09, 0, 0.632), 0.044, 0.044, 0.044),
    ]
    axial_bones = [S_['tail1'], S_['pelvis'], S_['spine1'], S_['spine2'], S_['neck1'], S_['neck2'], S_['neck3'],
                   S_['head']]
    joints = [hip, spine_pts[0], spine_pts[1], spine_pts[2], neck_pts[1], neck_pts[2], occ]
    b.loft_chain(ax, axial_bones, joints, blend=0.05, k=0.0, samples=10, tag='feather', detail=0.5, name='axial')
    # sternum + pectoral mass under the chest, notarium ridge over the shoulders
    b.add(Ellipsoid((0.34, 0, 0.435), (0.16, 0.095, 0.05), k=0.05, bind=S_['spine2'], tag='feather',
                    detail=0.5, name='pectoral'))
    b.add(Ellipsoid((0.40, 0, 0.555), (0.13, 0.05, 0.035), k=0.05, bind=S_['spine2'], tag='feather',
                    detail=0.5, name='notarium'))

    # -------------------------------------------------------------- wing membrane (left; mirrored)
    left = []
    # leading edge: propatagium (neck base -> pteroid tip), pteroid, then the wing spar to the tip
    pter_tip = Wr + 0.12 * normalize(V(0.55, -0.83, -0.05))
    P0 = V(0.57, 0.035, 0.50)
    prop = bezier(P0[:2], 0.5 * (P0[:2] + pter_tip[:2]) + np.array([-0.022, 0.0]), pter_tip[:2], 24)
    spar_ctrl = [Wr, 0.5 * (Wr + Kn4), Kn4, F1, F2, F3, Tip]
    spar_curve, _ = sdf.catmull(np.array(spar_ctrl), 12)
    # trailing edge: ankle -> tip, concave
    t = np.linspace(0, 1, 70)[:, None]
    c0, c1, c2, c3 = An[:2], An[:2] + np.array([0.22, 0.45]), Tip[:2] + np.array([-0.10, -0.85]), Tip[:2]
    te2 = (1 - t) ** 3 * c0 + 3 * (1 - t) ** 2 * t * c1 + 3 * (1 - t) * t * t * c2 + t ** 3 * c3
    poly = np.vstack([prop, spar_curve[:, :2], te2[::-1][1:-1], [An[:2], Kn[:2], Hp[:2]],
                      [[0.02, 0.03], [0.50, 0.03]]])

    # mid-surface: spar line (z of the bones) -> trailing boundary (leg, then the free edge)
    spar3 = np.vstack([Sh, El, spar_curve])
    spar3 = spar3[np.argsort(spar3[:, 1])]
    zl_of = lambda y: np.interp(y, spar3[:, 1], spar3[:, 2])
    s_te = np.clip((te2[:, 1] - An[1]) / (Tip[1] - An[1]), 0, 1)
    wa = np.exp(-((te2[:, 1] - An[1]) / 0.45) ** 2)
    zte = wa * (An[2] + zl_of(te2[:, 1]) - zl_of(An[1])) + (1 - wa) * (zl_of(te2[:, 1]) - 0.018 * (1 - s_te ** 4))
    trail3 = np.vstack([np.array([Hp, Kn, An]), np.column_stack([te2[1:], zte[1:]])])

    # spanwise tables of the leading (spar) and trailing boundaries, smoothed along the span so the
    # mid-surface has no creases at the elbow, wrist and knee
    yt = np.linspace(-0.2, 3.1, 3301)
    tabs = np.stack([np.interp(yt, spar3[:, 1], spar3[:, 0]), np.interp(yt, spar3[:, 1], spar3[:, 2]),
                     np.interp(yt, trail3[:, 1], trail3[:, 0]), np.interp(yt, trail3[:, 1], trail3[:, 2])])
    g = np.exp(-0.5 * (np.arange(-120, 121) / 35.0) ** 2)
    g /= g.sum()
    tabs = np.stack([np.convolve(np.pad(t, 120, mode='edge'), g, mode='valid') for t in tabs])

    def wing_z(X, Y):
        xl, zl, xt, zt = (np.interp(Y, yt, t) for t in tabs)
        chord = np.maximum(xl - xt, 0.05)
        v = (xl - X) / chord
        vc = np.clip(v, 0, 1)
        billow = 0.035 * chord * 4 * vc * (1 - vc) * _sstep(0.2, 0.7, Y) * (1 - _sstep(2.3, 2.85, Y))
        z = zl + (zt - zl) * vc + billow
        return np.where(v < 0, zl + 0.18 * (xl - X), z)  # propatagium droops a little

    def wing_h(X, Y, D):
        return 0.0115 - 0.0020 * _sstep(1.5, 2.8, Y)

    root_segs = [
        (S_['neck1'], neck_pts[0], neck_pts[1]),
        (S_['spine2'], spine_pts[1], spine_pts[2]),
        (S_['spine1'], spine_pts[0], spine_pts[1]),
        (S_['pelvis'], hip, spine_pts[0]),
        (S_['thigh.L'], Hp, Kn),
        (S_['shin.L'], Kn, An),
    ]
    spar_bones = ['upperarm.L', 'forearm.L', 'hand.L', 'wingfinger1.L', 'wingfinger2.L', 'wingfinger3.L']
    spar_joints = [(El[1], 0.06), (Wr[1], 0.06), (Kn4[1], 0.09), (F1[1], 0.09), (F2[1], 0.07)]

    def wing_bind(X, Y):
        fs = [_sstep(jy - bl, jy + bl, Y) for jy, bl in spar_joints]
        spar = {}
        for i, nm in enumerate(spar_bones):
            w = np.ones_like(Y)
            if i > 0:
                w = w * fs[i - 1]
            if i < len(spar_bones) - 1:
                w = w * (1 - fs[i])
            spar[S_[nm]] = w
        root = _softmin_bind(X, Y, root_segs, 0.03)
        xl = np.interp(Y, spar3[:, 1], spar3[:, 0])
        xt = np.interp(Y, trail3[:, 1], trail3[:, 0])
        v = np.clip((xl - X) / np.maximum(xl - xt, 0.05), 0, 1)
        beta = np.maximum(1 - _sstep(0.10, 0.20, Y), v * (1 - _sstep(0.25, 1.0, Y)))
        out = {}
        for k_, w in spar.items():
            out[k_] = out.get(k_, 0) + (1 - beta) * w
        for k_, w in root.items():
            out[k_] = out.get(k_, 0) + beta * w
        return out

    # colour: the shader has no membrane channel, so the membrane takes the osteo slot (this animal has
    # no osteoderms): warm rufous, shading towards osteo2 by the accent amount (meta osteo_shade). A Tint
    # (accent 1, colour only) raises the accent in a dark band along the free trailing edge and a
    # lighter one along the leading edge (spar and propatagium).
    wing = Sheet(poly, wing_z, wing_h, wing_bind, res=0.004, k=0.02, tag='osteo', detail=0.25,
                 name='brachiopatagium', region='membrane.L')
    left.append(b.add(wing))
    # material blend width (meta['tag_sigma'], also used by the Tints below). build.py's default,
    # 0.012 * length / 12 + 0.004 = 6.3 mm here, is mostly its 4 mm floor: on this small animal it
    # smeared the pale body fuzz 3-4 cm out over the membrane where the body fillets into the wing.
    tag_sigma = TAG_SIGMA
    le_xy = np.vstack([np.array([Sh, El])[:, :2], spar_curve[:, :2]])

    def wing_shade(X, Y):
        """Wanted shade 0 (osteo) .. 1 (osteo2) over the planform, as a Tint weight (accent = s / 2)."""
        bw = np.interp(Y, [0.2, 1.5, 2.9], [0.22, 0.17, 0.09])
        s_te = 1 - _sstep(0.4 * bw, bw, _polyline_dist2d(X, Y, te2))
        d_le = np.minimum(_polyline_dist2d(X, Y, le_xy), _polyline_dist2d(X, Y, prop))
        s_le = 0.42 * (1 - _sstep(0.025, 0.085, d_le))
        s = np.clip(np.maximum(s_te, s_le), 0, 0.999)
        return s / (2 - s)

    left.append(b.add(Tint(wing, _raster2d(wing_shade, wing.lo2, wing.hi2, 0.006), tag_sigma, tag='osteo',
                           accent=1.0, name='wingshade')))

    # uropatagium: a small web between the inner thighs and the base of the tail
    thigh_p = Hp + 0.8 * (Kn - Hp)
    uro_te = bezier(thigh_p[:2], np.array([-0.10, 0.07]), np.array([-0.125, 0.0]), 16)
    uro_poly = np.vstack([[[0.02, -0.02], [0.02, 0.045]], uro_te, [[-0.125, -0.02]]])
    leg_x = np.array([An[0], Kn[0], Hp[0]])
    leg_y = np.array([An[1], Kn[1], Hp[1]])
    leg_z = np.array([An[2], Kn[2], Hp[2]])

    def uro_z(X, Y):
        zt = np.interp(X, [tail_tip[0], 0.0], [tail_tip[2], hip[2]])
        yl = np.interp(X, leg_x, leg_y)
        zg = np.interp(X, leg_x, leg_z)
        return zt + (zg - zt) * np.clip(Y / np.maximum(yl, 0.03), 0, 1)

    uro_segs = [(S_['tail1'], hip, tail_tip), (S_['pelvis'], hip, spine_pts[0]), (S_['thigh.L'], Hp, Kn),
                (S_['shin.L'], Kn, An)]
    uro = Sheet(uro_poly, uro_z, lambda X, Y, D: np.full_like(X, 0.0085), lambda X, Y: _softmin_bind(X, Y, uro_segs, 0.03),
                res=0.003, k=0.015, tag='osteo', detail=0.25, name='uropatagium', region='membrane.L')
    left.append(b.add(uro))

    def uro_shade(X, Y):
        s = np.clip(1 - _sstep(0.012, 0.04, _polyline_dist2d(X, Y, uro_te)), 0, 0.999)
        return s / (2 - s)

    left.append(b.add(Tint(uro, _raster2d(uro_shade, uro.lo2, uro.hi2, 0.004), tag_sigma, tag='osteo',
                           accent=1.0, name='uroshade')))

    # -------------------------------------------------------------- arm (pycnofibre-covered proximally)
    arm_secs = [
        sec(V(0.43, 0.06, 0.505), 0.085, 0.065, 0.085),
        sec(Sh, 0.076, 0.052, 0.066),
        sec(Sh + 0.45 * (El - Sh), 0.060, 0.040, 0.050),
        sec(El, 0.045, 0.032, 0.034),
        sec(El + 0.4 * (Wr - El), 0.040, 0.027, 0.028),
        sec(El + 0.8 * (Wr - El), 0.031, 0.022, 0.022),
        sec(Wr, 0.030, 0.021, 0.021),
    ]
    # the arm carries the wing's leading edge: wing-coloured (a shade darker), fading to the body's
    # fuzz towards the shoulder (a feather Tint)
    arm = b.loft_chain(arm_secs, [S_['upperarm.L'], S_['forearm.L']], [El], blend=0.06, k=0.03,
                       side=(-1, 0, 0), samples=10, tag='osteo', detail=0.5, name='arm')
    arm.accent = 0.25
    left.append(arm)
    hu = El - Sh

    def shoulder_fuzz(P):
        # dorsal side only: the arm's underside is the membrane's leading strip, so from below the
        # fuzz would show as a pale blur around the shoulders. Below the arm's centre line the
        # membrane colour runs right up to the body and meets it in the short tag blend.
        s = ((P - Sh) @ hu) / float(hu @ hu)
        dz = P[:, 2] - (Sh[2] + np.clip(s, 0.0, 1.0) * hu[2])
        return (1 - _sstep(0.0, 0.4, s)) * _sstep(-0.004, 0.010, dz)

    left.append(b.add(Tint(arm, shoulder_fuzz, tag_sigma, tag='feather', name='armfuzz')))
    # wing metacarpal and the wing finger: one spar from the wrist to the tip
    hand_secs = [sec(p, w, t_, t_) for p, w, t_ in [
        (Wr, 0.030, 0.021),
        (0.5 * (Wr + Kn4), 0.024, 0.0185),
        (Kn4, 0.027, 0.021),
    ]]
    left.append(b.loft_chain(hand_secs, [S_['hand.L']], [], k=0.02, side=(-1, 0, 0), samples=10, detail=0.4,
                             tag='osteo', name='metacarpal'))
    left[-1].accent = 0.25
    fin_secs = [sec(p, w, t_, t_) for p, w, t_ in [
        (Kn4, 0.025, 0.020),
        (Kn4 + 0.5 * (F1 - Kn4), 0.021, 0.0168),
        (F1, 0.019, 0.0155),
        (F1 + 0.5 * (F2 - F1), 0.017, 0.0142),
        (F2, 0.015, 0.0130),
        (F3, 0.012, 0.0112),
        (Tip, 0.005, 0.0050),
    ]]
    left.append(b.loft_chain(fin_secs, [S_['wingfinger1.L'], S_['wingfinger2.L'], S_['wingfinger3.L']], [F1, F2],
                             blend=0.06, k=0.016, side=(-1, 0, 0), samples=10, detail=0.3, tag='osteo',
                             name='wingfinger'))
    left[-1].accent = 0.25
    # pteroid: a slender rod from the wrist pointing to the neck, carrying the propatagium's edge
    left.append(b.add(RoundCone(Wr + V(0.01, -0.01, 0), pter_tip, 0.011, 0.006, k=0.012, bind=S_['forearm.L'],
                                detail=0.3, tag='osteo', accent=0.25, name='pteroid')))
    # three small clawed fingers (I-III) at the end of the wing metacarpal, held forward in flight
    for off, dirv, L in [(V(0.012, -0.050, 0.010), V(0.88, -0.42, 0.22), 0.058),
                         (V(0.016, -0.022, 0.008), V(0.97, -0.12, 0.20), 0.068),
                         (V(0.014, 0.006, 0.004), V(0.94, 0.22, 0.12), 0.074)]:
        d = normalize(dirv)
        f0 = Kn4 + off
        f1 = f0 + d * L
        left.append(b.add(RoundCone(f0, f1, 0.0085, 0.0058, k=0.006, bind=S_['hand.L'], detail=0.3, name='finger')))
        left.append(b.add(claw(f1 - d * 0.004, d, 0.034, 0.0068, V(0, 0, -1), side=(0, 1, 0), bind=S_['hand.L'])))

    # -------------------------------------------------------------- hind limbs, trailing
    leg_secs = [
        sec(Hp + V(0.03, -0.01, 0.0), 0.050, 0.050, 0.055),
        sec(Hp + 0.45 * (Kn - Hp), 0.040, 0.036, 0.040),
        sec(Kn, 0.024, 0.024, 0.024),
        sec(Kn + 0.4 * (An - Kn), 0.021, 0.020, 0.021),
        sec(An + 0.12 * (Kn - An), 0.015, 0.015, 0.015),
        sec(An, 0.017, 0.016, 0.016),
    ]
    left.append(b.loft_chain(leg_secs, [S_['thigh.L'], S_['shin.L']], [Kn], blend=0.05, k=0.03, side=(0, -1, 0),
                             samples=10, tag='feather', detail=0.5, name='leg'))
    foot_secs = [sec(An, 0.016, 0.015, 0.015), sec(0.5 * (An + Ball), 0.020, 0.011, 0.011),
                 sec(Ball, 0.026, 0.010, 0.011)]
    left.append(b.loft_chain(foot_secs, [S_['meta.L']], [], k=0.012, side=(0, -1, 0), samples=8, detail=0.6,
                             name='pes', region='foot.L'))
    # toes I-IV fanning from the ball of the foot, small claws
    tdir = normalize(Toe - Ball)
    lat = normalize(np.cross(V(0, 0, 1), tdir))
    for i, (spread, L) in enumerate([(-0.022, 0.055), (-0.007, 0.066), (0.008, 0.068), (0.022, 0.060)]):
        b0 = Ball + lat * spread * 0.9
        d = normalize(tdir + lat * spread * 6.0 + V(0, 0, -0.08))
        t1 = b0 + d * L
        left.append(b.add(RoundCone(b0, t1, 0.0075, 0.0045, k=0.006, bind=S_['toe.L'], detail=0.5, name='toe',
                                    region='foot.L')))
        left.append(b.add(claw(t1, d, 0.020, 0.0045, V(0, 0, -1), side=(0, 1, 0), bind=S_['toe.L'])))
    b.mirror_y(left)

    # -------------------------------------------------------------- head
    head = S_['head']
    top = lambda x: np.interp(x, [0.99, 1.05, 1.12, 1.25, 1.36, 1.70, 1.90, 2.00, 2.065],
                              [0.668, 0.690, 0.701, 0.705, 0.704, 0.656, 0.624, 0.604, 0.590])
    tom = lambda x: np.interp(x, [1.16, 2.065], [0.577, 0.590])
    half_w = lambda x: np.interp(x, [0.99, 1.06, 1.15, 1.30, 1.45, 1.60, 1.75, 1.90, 2.00, 2.065],
                                 [0.040, 0.048, 0.051, 0.041, 0.032, 0.026, 0.020, 0.014, 0.008, 0.002])
    cran_bot = lambda x: np.interp(x, [0.99, 1.05, 1.10, 1.18, 1.30, 1.60], [0.600, 0.572, 0.560, 0.570, 0.5752, 0.5793])

    def upper_sec(x, bot_fn, scale=1.0):
        zt, zb = top(x), bot_fn(x)
        f = np.interp(x, [1.0, 1.3, 1.5], [0.42, 0.36, 0.33])
        zc = zb + f * (zt - zb)
        return sec((x, 0, zc), half_w(x) * scale, (zt - zc) * scale, (zc - zb) * scale,
                   float(np.interp(x, [1.0, 1.3, 1.5], [1.9, 1.8, 1.75])), 2.4)

    # posterior skull: braincase, orbit, quadrate (bare skin)
    cran = [upper_sec(x, cran_bot, float(np.interp(x, [1.42, 1.58], [1.0, 0.86]))) for x in (0.99, 1.04, 1.10, 1.18, 1.26, 1.34, 1.42, 1.50, 1.58)]
    b.add(Loft(cran, samples_per_seg=8, k=0.03, bind=head, detail=0.5, name='cranium'))
    # rostrum: keratin rhamphotheca, a tall narrow triangle in section; coincides with the cranium
    # where they overlap so the union stays smooth
    ros = [upper_sec(x, lambda x: tom(x) - 0.002, float(np.interp(x, [1.30, 1.50], [0.84, 1.0])))
           for x in (1.30, 1.40, 1.50, 1.62, 1.75, 1.88, 1.97, 2.03, 2.065)]
    b.add(Loft(ros, samples_per_seg=8, k=0.006, tag='keratin', bind=head, detail=0.3, name='rostrum'))
    # cranial crest: a thin blade swept back over the neck (bare skin, display colours). Its side
    # outline: the dorsal edge continues the beak's dorsal line ~20 deg upwards from x ~1.36, the
    # ventral edge rises from the occiput; rounded tip ~0.55 m behind the occiput.
    ax_u = normalize(V(-1.0, 0.0, 0.30))
    ax_n = normalize(V(0.30, 0.0, 1.0))
    ct, rt = V(0.525, 0.0, 0.940), 0.026
    dors = [(x, 0.704 + 0.316 * (1.36 - x)) for x in np.linspace(1.40, 0.535, 23)]
    cap = [ct + rt * (math.cos(f) * ax_n + math.sin(f) * ax_u) for f in np.linspace(0.15, math.pi - 0.15, 12)]
    vent_ctrl = np.array([[0.52, 0.915], [0.66, 0.838], [0.80, 0.776], [0.94, 0.718], [1.04, 0.676], [1.12, 0.656],
                          [1.28, 0.652], [1.40, 0.660]])
    vent, _ = sdf.catmull(vent_ctrl, 6)
    crest_poly = np.vstack([np.array(dors), np.array([[c[0], c[2]] for c in cap]), vent[1:]])
    crest = SideSheet(crest_poly, lambda X, Z: np.zeros_like(X),
                      lambda X, Z, D: np.interp(X, [0.50, 0.80, 1.10, 1.40], [0.0095, 0.0110, 0.0140, 0.0170]),
                      lambda X, Z: {head: np.ones_like(X)}, res=0.003, pad=0.06, blur=0, k=0.025,
                      detail=0.3, accent=1.0, name='crest', region='head')
    b.add(crest)

    # the lower jaw, sculpted closed and then opened by JAW_OPEN about the jaw joint
    jaw = S_['jaw']
    jb = lambda x: np.interp(x, [1.09, 1.20, 1.45, 1.75, 1.95, 2.02, 2.05], [0.552, 0.527, 0.535, 0.553, 0.569, 0.578, 0.585])
    jsecs = []
    for x in (1.09, 1.13, 1.22, 1.38, 1.56, 1.74, 1.90, 1.99, 2.05):
        zt = tom(max(x, 1.16)) - 0.001
        zb = jb(x)
        zc = zb + 0.55 * (zt - zb)
        jsecs.append(sec((x, 0, zc), half_w(x) * 0.92, zt - zc, zc - zb, 2.6, 1.7))
    mandible = Loft(jsecs, samples_per_seg=8, k=0.012, tag='keratin', bind=jaw, detail=0.3, name='mandible')
    b.add(Xform(mandible, R=Rj, pivot=jaw_pivot))

    # nostrils (small slits), eyes
    for m in (1, -1):
        b.add(Ellipsoid((1.47, 0.031 * m, 0.656), (0.028, 0.012, 0.0055), R=rot_euler(ry=0.12), k=0.006, op='sub',
                        name='nostril'))
    eye_r = 0.016
    for m in (1, -1):
        c = V(1.170, 0.044 * m, 0.656)
        look = normalize(V(0.45, 0.88 * m, 0.08))
        b.add(Ellipsoid(c + look * 0.003, (0.030, 0.022, 0.025), k=0.018, bind=head, detail=0.5, name='lids'))
        b.add(Ellipsoid(c, (eye_r + 0.0025,) * 3, k=0.006, op='sub', name='socket'))
        R = np.stack([look, normalize(np.cross(V(0, 0, 1), look)), normalize(np.cross(look, np.cross(V(0, 0, 1), look)))], axis=1)
        b.add(Ellipsoid(c + look * 0.024, (0.012, 0.0175, 0.0125), R=R, k=0.006, op='sub', name='aperture'))
        b.attachments.append(dict(kind='eye', center=c.tolist(), radius=eye_r, look=look.tolist(), bone='head',
                                  iris=[0.05, 0.035, 0.028], pupil='round'))

    # -------------------------------------------------------------- metadata
    span = 2 * float(Tip[1])
    length = float(tip[0] - tail_tip[0])
    b.meta = dict(
        name='Pteranodon longiceps', common='Pteranodon', length=round(length, 2), wingspan=round(span, 2),
        wingspan_bones=6.0, mass_t=0.03, sex='male',
        voxel=0.006, jaw_open=JAW_OPEN, jaw_seal=0.0, faces=50000, tex=2048,
        # osteo / osteo2: the wing membrane (see wing_shade): warm rufous, a dark chestnut trailing edge
        palette=dict(back='#4A4D52', flank='#E8E4DA', belly='#DEDBD3', pattern='#2A2B2E', accent='#B8432A',
                     accent2='#3A2420', keratin='#C9B78C', claw='#2A2622', mouth='#C46A4A', eye='#2B2420',
                     osteo='#A3552A', osteo2='#3E1D11'),
        accent_grad=[0.86, 0.97],
        osteo_shade=[0.0, 0.5],  # a Tint of weight f gives accent f / (1 + f): 0.5 = the full osteo2 band
        tag_sigma=TAG_SIGMA,  # crisp body/membrane colour junction (the Tints are tuned to it)
        osteo_rough=0.72,  # matte skin, not the default glossy keratin of an osteo part
        pattern=dict(kind='none', strength=0.0, mottle=0.12),
        scales=dict(base=0.006, feature=0.012, border=0.12, folds=0.15, bump=0.5),
        feature_on_body=0.3, feature_on_limbs=0.3,
        accent=[((1.13, 0.0, 0.548), (0.10, 0.05, 0.035), 0.45)],  # male facial / throat flush
        # flight: cruise m/s, flap period s (2-3 Hz bursts), flap amplitude rad, fraction of time gliding,
        # bank angle rad when circling; ground: quadrupedal walk v 0.9 m/s, stride 0.9 m, T 1.0 s
        gait=dict(kind='flyer', speed=12.0, flap_period=0.42, flap_amp=0.6, glide=0.85, bank=0.45,
                  walk_speed=0.9, stride=0.9, walk_period=1.0, duty=0.65),
    )
    return b
