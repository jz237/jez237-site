"""Stegosaurus stenops — adult, ~6.5 m, ~3.5 t.

After USNM 4934 (the articulated type, Gilmore 1914) and NHMUK PV R36730 "Sophie" (Maidment et al. 2015).
Proportions follow the research spec (L = 6.5 m): skull 0.41 m, neck 0.11 L, trunk 0.33 L, tail 0.50 L;
hip joint 1.75 m, glenoid 1.10 m, femur 1.0 m : tibia 0.62 : metatarsus 0.2; humerus : femur 1 : 1.9.
The back arches from low shoulders to a peak over the hips; the small head is carried low.
17 keratin-sheathed plates in two staggered (alternating) rows, the largest over the tail base (Gilmore's
P14); 4 thagomizer spikes in two pairs; a gular shield of small ossicles under the throat.
"""
import math
import numpy as np
from anatomy import Body, sec, V
from sdf import Prim, Loft, Ellipsoid, RoundCone, Xform, rot_euler, normalize

LEN = 6.5
X_HIP = 0.485                   # snout-tip-relative position of the hip joint (x L)
JAW_OPEN = math.radians(2.0)    # rest pose opens the jaw a little so the lips separate cleanly


def X(f):
    """Spec station (fraction of L behind the snout tip) -> animal x (m, +x forward, 0 at the hips)."""
    return (X_HIP - f) * LEN


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3 - 2 * t)


class SmoothLoft(Loft):
    """Loft with a smoother distance: each point is measured against the single nearest piece of the
    centre line, and past an interior joint the section is swept around the joint (rotational fill)
    instead of extruding every piece and taking their union. The stock union leaves thin spurious
    sheets and ridges where a tapering tube bends (the hips here); this field has neither."""

    def dist(self, P, K=1):
        j, t = self._candidates(P, 1)
        j, t = j[:, 0], t[:, 0]
        tt = t[:, None]
        C = self.S[j] * (1 - tt) + self.S[j + 1] * tt
        T = self.T[j] * (1 - tt) + self.T[j + 1] * tt
        T /= np.linalg.norm(T, axis=1, keepdims=True)
        Sd = self.Sd[j] * (1 - tt) + self.Sd[j + 1] * tt
        Up = self.Up[j] * (1 - tt) + self.Up[j + 1] * tt
        Vv = self.V[j] * (1 - tt) + self.V[j + 1] * tt
        q = P - C
        along = np.einsum('ij,ij->i', q, T)
        q = q - along[:, None] * T
        x = np.einsum('ij,ij->i', q, Sd)
        y = np.einsum('ij,ij->i', q, Up)
        w, top, bot, nt, nb = Vv[:, 0], Vv[:, 1], Vv[:, 2], Vv[:, 3], Vv[:, 4]
        h = np.where(y > 0, top, bot)
        n = np.where(y > 0, nt, nb)
        r = ((np.abs(x) / w) ** n + (np.abs(y) / h) ** n) ** (1.0 / n)
        rho = np.sqrt(x * x + y * y)
        rb = np.where(r > 1e-9, rho / np.maximum(r, 1e-9), np.minimum(w, h))
        last = len(self.S) - 2
        true_end = ((t >= 1.0) & (along > 0) & (j == last)) | ((t <= 0.0) & (along < 0) & (j == 0))
        d_side = np.sqrt(rho * rho + along * along) - rb
        if not self.cap:
            return np.where(true_end, np.maximum(rho - rb, np.abs(along)), d_side)
        rc = np.minimum(w, np.minimum(top, bot))
        z = np.abs(along) / rc
        d_cap = (np.sqrt(r * r + z * z) - 1.0) * np.minimum(rb, rc * 1.5)
        return np.where(true_end, d_cap, d_side)


def smooth(prim):
    """Give a Loft built by Body.loft_chain the smoother distance field."""
    prim.__class__ = SmoothLoft
    return prim


def pchip(x, y, xq):
    """Monotone piecewise-cubic (Fritsch-Carlson) interpolation; numpy only."""
    x, y, xq = (np.asarray(a, float) for a in (x, y, xq))
    h = np.diff(x)
    dl = np.diff(y) / h
    m = np.zeros_like(y)
    for i in range(1, len(y) - 1):
        if dl[i - 1] * dl[i] > 0:
            w1, w2 = 2 * h[i] + h[i - 1], h[i] + 2 * h[i - 1]
            m[i] = (w1 + w2) / (w1 / dl[i - 1] + w2 / dl[i])
    m[0], m[-1] = dl[0], dl[-1]
    k = np.clip(np.searchsorted(x, xq) - 1, 0, len(h) - 1)
    t = (xq - x[k]) / h[k]
    t2, t3 = t * t, t * t * t
    return ((2 * t3 - 3 * t2 + 1) * y[k] + (t3 - 2 * t2 + t) * h[k] * m[k] + (-2 * t3 + 3 * t2) * y[k + 1]
            + (t3 - t2) * h[k] * m[k + 1])


def resample(sections, step):
    """Re-space a loft's sections evenly along x (its centre line runs monotonically in x). Uniform
    Catmull-Rom through unevenly spaced sections overshoots and wiggles; even spacing keeps the tube's
    outline and its curvature smooth. Sizes are interpolated in log space so tapers stay proportional."""
    xs = np.array([s['p'][0] for s in sections])
    order = np.argsort(xs)
    xs = xs[order]
    S = [sections[i] for i in order]
    n = max(2, int(round((xs[-1] - xs[0]) / step)) + 1)
    xq = np.linspace(xs[0], xs[-1], n)
    z = pchip(xs, [s['p'][2] for s in S], xq)
    y = pchip(xs, [s['p'][1] for s in S], xq)
    out = {k: np.exp(pchip(xs, np.log([s[k] for s in S]), xq)) for k in ('w', 'top', 'bot')}
    ex = {k: pchip(xs, [s[k] for s in S], xq) for k in ('nt', 'nb')}
    res = [sec((xq[i], y[i], z[i]), out['w'][i], out['top'][i], out['bot'][i], ex['nt'][i], ex['nb'][i])
           for i in range(n)]
    return res if sections[0]['p'][0] <= sections[-1]['p'][0] else res[::-1]


# ---------------------------------------------------------------------------- dermal plates
def sd_polygon(p, v):
    """Exact signed distance from 2-D points p (N, 2) to the closed polygon v (M, 2); negative inside."""
    d = np.sum((p - v[0]) ** 2, axis=1)
    s = np.ones(len(p))
    for i in range(len(v)):
        e = v[i - 1] - v[i]
        w = p - v[i]
        t = np.clip((w @ e) / float(e @ e), 0.0, 1.0)
        bb = w - t[:, None] * e
        d = np.minimum(d, np.einsum('ij,ij->i', bb, bb))
        c1 = p[:, 1] >= v[i, 1]
        c2 = p[:, 1] < v[i - 1, 1]
        c3 = e[0] * w[:, 1] > e[1] * w[:, 0]
        flip = (c1 & c2 & c3) | (~c1 & ~c2 & ~c3)
        s = np.where(flip, -s, s)
    return s * np.sqrt(d)


class Plate(Prim):
    """A thin keratin-sheathed dermal plate standing on the back.

    The outline is a polygon in the plate's own (u, v) plane (u along the body, v up from the skin line);
    the plate is a lens across its thickness: t_c half-thickness in the middle, thinning to t_rim at the
    rim, with a thickened, rugose root (t_base extra) below base_top that is sunk into the skin."""

    def __init__(self, origin, u, v, outline, t_c, t_rim=0.004, t_base=0.035, base_top=0.12, rr=0.005,
                 inner=0.2, **kw):
        super().__init__(**kw)
        u = normalize(u)
        v = np.asarray(v, float) - np.dot(v, u) * u
        v = normalize(v)
        n = np.cross(v, u)
        self.o = np.asarray(origin, float)
        self.R = np.stack([u, n, v], axis=1)
        self.poly = np.asarray(outline, float)
        self.t_c, self.t_rim, self.t_base, self.base_top, self.rr, self.inner = t_c, t_rim, t_base, base_top, rr, inner
        hmax = t_c + t_base + rr
        lo2 = self.poly.min(axis=0) - rr
        hi2 = self.poly.max(axis=0) + rr
        corners = np.array([[a, c, bz] for a in (lo2[0], hi2[0]) for c in (-hmax, hmax) for bz in (lo2[1], hi2[1])])
        W = self.o + corners @ self.R.T
        self._lo, self._hi = W.min(axis=0), W.max(axis=0)

    def bbox(self):
        return self._lo, self._hi

    def dist(self, P):
        q = (P - self.o) @ self.R
        d2 = sd_polygon(q[:, [0, 2]], self.poly)
        f = np.clip(-d2 / self.inner, 0.0, 1.0)
        h = self.t_rim + (self.t_c - self.t_rim) * (1.0 - (1.0 - f) ** 2)
        h = h + self.t_base * smoothstep(self.base_top, -0.03, q[:, 2])
        dn = np.abs(q[:, 1]) - h
        out = np.minimum(np.maximum(d2, dn), 0.0) + np.sqrt(np.maximum(d2, 0.0) ** 2 + np.maximum(dn, 0.0) ** 2)
        return out - self.rr


def plate_outline(length, height, tm, wb, a, bexp, skew=0.0, embed=0.12, n=22):
    """Plate silhouette in (u, v): half-length grows from wb (at the skin) to 1 at height fraction tm,
    then closes over the apex as (1 - s^a)^(1/bexp) (a = bexp = 2: round; 1: straight-sided point).
    skew shifts the apex along u (negative = overhanging backwards)."""
    hl = 0.5 * length
    ts = np.linspace(0.0, 1.0, n)
    hw, cu = [], []
    for t in ts:
        if t <= tm:
            w = wb + (1.0 - wb) * math.sin(0.5 * math.pi * t / tm) ** 0.85
        else:
            s = (t - tm) / (1.0 - tm)
            w = max(0.0, 1.0 - s ** a) ** (1.0 / bexp)
        hw.append(w * hl)
        cu.append(skew * length * t * t)
    front = [(cu[i] + hw[i], ts[i] * height) for i in range(n - 1)]
    back = [(cu[i] - hw[i], ts[i] * height) for i in range(n - 2, -1, -1)]
    apex = [(cu[-1], height)]
    root = 0.88 * wb * hl
    bottom = [(-root, -embed), (root, -embed)]
    return np.array(bottom[1:] + front + apex + back + bottom[:1])


# Gilmore 1914 plate schedule (spec F2): station (x L), base length, height above skin (m), shape.
PLATES = [
    (0.075, 0.10, 0.12, 'neck'), (0.09, 0.11, 0.15, 'neck'), (0.11, 0.12, 0.18, 'neck'),
    (0.13, 0.13, 0.21, 'neck'), (0.15, 0.15, 0.25, 'neck'),
    (0.18, 0.22, 0.30, 'oval'), (0.22, 0.28, 0.36, 'oval'), (0.26, 0.34, 0.44, 'oval'), (0.30, 0.40, 0.50, 'oval'),
    (0.35, 0.48, 0.55, 'rect'), (0.40, 0.55, 0.60, 'rect'),
    (0.45, 0.62, 0.62, 'pent'), (0.51, 0.695, 0.60, 'pent'), (0.57, 0.785, 0.76, 'apex'),
    (0.64, 0.63, 0.627, 'pent'), (0.70, 0.41, 0.335, 'sharp'), (0.75, 0.29, 0.225, 'sharp'),
]
# shape -> (tm, wb, a, bexp, skew)
PLATE_SHAPES = dict(
    neck=(0.38, 0.72, 1.8, 1.5, 0.0),
    oval=(0.44, 0.50, 1.6, 1.35, 0.0),
    rect=(0.50, 0.65, 2.2, 1.5, -0.02),
    pent=(0.38, 0.72, 1.35, 1.15, -0.05),
    apex=(0.40, 0.72, 1.6, 1.3, -0.04),
    sharp=(0.32, 0.85, 1.0, 1.0, -0.32),
)
KERATIN = 1.07  # the keratin sheath makes the plates ~5-10% larger than the bone


# ---------------------------------------------------------------------------- tail spikes
def spike(base, direction, length, r0, bend, bind, region, split=0.62):
    """A thagomizer spike: expanded rugose base, sharp fore-and-aft edges low down, rounded tip, a slight
    backward curve. Two overlapping lofts so the pale base grades into the dark tip."""
    d = normalize(direction)
    base = np.asarray(base, float)
    tip = base + d * length
    mid = 0.5 * (base + tip) + np.asarray(bend, float)
    n = 9
    t = np.linspace(0.0, 1.0, n)[:, None]
    pts = (1 - t) ** 2 * base + 2 * (1 - t) * t * mid + t * t * tip
    fwd = V(1, 0, 0) - np.dot(V(1, 0, 0), d) * d
    side = normalize(fwd)
    secs = []
    for i, p in enumerate(pts):
        f = i / (n - 1)
        r = r0 * (1 - f) ** 0.95 + 0.004
        if f < 0.12:
            r *= 1.0 + 0.35 * (1 - f / 0.12)  # flared base
        ex = 1.6 if f < 0.66 else 2.0          # lens section (sharp edges) on the lower two-thirds
        secs.append(sec(p, r, r * 0.74, r * 0.74, ex, ex))
    # the root continues into the tail so the (flat) inner end is buried
    r_in = secs[0]['w'] * 0.75
    secs.insert(0, sec(base - d * 0.07, r_in, r_in * 0.74, r_in * 0.74, 1.6, 1.6))
    m = int(round(split * (n - 1))) + 1
    lower = SmoothLoft(secs[:m + 1], side=side, samples_per_seg=6, k=0.012, tag='keratin', bind=bind, detail=0.25,
                       name='spike', region=region)
    upper = SmoothLoft(secs[m - 1:], side=side, samples_per_seg=6, k=0.004, tag='claw', bind=bind, detail=0.2,
                       name='spike_tip', region=region)
    lower.cap = upper.cap = False  # flat ends: the two halves overlap, so no collar where they meet
    return [lower, upper]


# ---------------------------------------------------------------------------- probing helpers
def surface_along(prim, start, direction, reach=1.0, iters=36):
    """First zero of prim's field going from 'start' (inside) along 'direction' (bisection)."""
    d = normalize(direction)
    lo, hi = 0.0, reach
    for _ in range(iters):
        m = 0.5 * (lo + hi)
        if prim.dist(np.asarray([start + d * m]))[0] < 0:
            lo = m
        else:
            hi = m
    return start + d * (0.5 * (lo + hi))


def field_normal(prim, p, h=0.004):
    g = np.zeros(3)
    for i in range(3):
        e = np.zeros(3)
        e[i] = h
        g[i] = prim.dist(np.asarray([p + e]))[0] - prim.dist(np.asarray([p - e]))[0]
    return normalize(g)


def build():
    b = Body('stegosaurus')
    S = b.skel
    # ------------------------------------------------------------------ skeleton
    b.bone('root', V(0, 0, 0), V(0, 0, 0.5))
    hip = V(0, 0, 1.75)
    b.bone('pelvis', hip, V(0.42, 0, 1.70), 'root')
    spine_pts = [V(0.42, 0, 1.70), V(0.92, 0, 1.55), V(1.42, 0, 1.36), V(2.03, 0, 1.13)]
    b.chain('spine', spine_pts, 'pelvis')
    neck_pts = [V(2.03, 0, 1.13), V(2.27, 0, 1.04), V(2.51, 0, 0.955), V(2.74, 0, 0.88)]
    b.chain('neck', neck_pts, 'spine3')
    head_back, head_tip = V(2.73, 0, 0.865), V(3.155, 0, 0.695)
    ha = normalize(head_tip - head_back)            # skull axis, angled down ~22 degrees
    hu = V(-ha[2], 0, ha[0])                         # skull 'up'
    HL = float(np.linalg.norm(head_tip - head_back))

    def hp(t, up=0.0, y=0.0):
        """Point on the skull at axial fraction t (0 back, 1 beak tip), 'up' metres off the axis."""
        return head_back + ha * (t * HL) + hu * up + V(0, y, 0)

    b.bone('head', V(2.74, 0, 0.88), head_tip, 'neck3')
    jaw_pivot = hp(0.10, -0.045)
    Rj = rot_euler(ry=JAW_OPEN)
    chin = (hp(0.97, -0.075) - jaw_pivot) @ Rj.T + jaw_pivot
    b.bone('jaw', jaw_pivot, chin, 'head')
    tail_pts = [hip, V(-0.50, 0, 1.715), V(-1.00, 0, 1.665), V(-1.48, 0, 1.585), V(-1.92, 0, 1.49),
                V(-2.32, 0, 1.40), V(-2.68, 0, 1.315), V(-3.02, 0, 1.225), V(X(1.0), 0, 1.14)]
    b.chain('tail', tail_pts, 'pelvis')

    # hind limb: femur 1.0, tibia 0.62, metatarsus 0.2; near-straight pillar, joints slightly bent
    H, K, A, Bl = V(0.0, 0.30, 1.75), V(0.08, 0.34, 0.77), V(-0.03, 0.35, 0.185), V(0.13, 0.35, 0.05)
    T3 = V(0.33, 0.355, 0.03)
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'thigh.{s}', f(H), f(K), 'pelvis', z=(1, 0, 0))
        b.bone(f'shin.{s}', f(K), f(A), f'thigh.{s}', z=(1, 0, 0))
        b.bone(f'meta.{s}', f(A), f(Bl), f'shin.{s}', z=(1, 0, 0))
        b.bone(f'toe.{s}', f(Bl), f(T3), f'meta.{s}', z=(0, 0, 1))
    # forelimb: humerus 0.53, ulna 0.53, manus 0.16; short, flexed, elbows a little out
    Sh, El, Wr, Fc = V(1.78, 0.30, 1.10), V(1.67, 0.40, 0.62), V(1.75, 0.39, 0.16), V(1.79, 0.39, 0.03)
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'upperarm.{s}', f(Sh), f(El), 'spine3', z=(1, 0, 0))
        b.bone(f'forearm.{s}', f(El), f(Wr), f'upperarm.{s}', z=(1, 0, 0))
        b.bone(f'hand.{s}', f(Wr), f(Fc), f'forearm.{s}', z=(1, 0, 0))

    # ------------------------------------------------------------------ axial body (tail tip -> head)
    ax = [
        sec((X(1.0), 0, 1.14), 0.012, 0.012, 0.012),
        sec((-3.10, 0, 1.20), 0.030, 0.034, 0.034),
        sec((-2.80, 0, 1.27), 0.044, 0.050, 0.050),
        sec((-2.50, 0, 1.345), 0.058, 0.066, 0.068),
        sec((-2.11, 0, 1.44), 0.085, 0.098, 0.102),
        sec((-1.59, 0, 1.56), 0.125, 0.150, 0.158),
        sec((-1.07, 0, 1.655), 0.172, 0.212, 0.228),
        sec((-0.55, 0, 1.70), 0.24, 0.290, 0.305, 2.0, 2.0),
        sec((-0.33, 0, 1.69), 0.315, 0.34, 0.36, 2.1, 2.05),
        sec((-0.10, 0, 1.665), 0.37, 0.385, 0.40, 2.2, 2.1),
        sec((0.42, 0, 1.50), 0.47, 0.50, 0.58, 2.1, 2.1),
        sec((0.88, 0, 1.335), 0.51, 0.545, 0.585, 2.0, 2.1),
        sec((1.40, 0, 1.17), 0.40, 0.46, 0.39, 2.0, 2.1),
        sec((1.85, 0, 1.04), 0.31, 0.33, 0.27, 2.0, 2.0),
        sec((2.05, 0, 1.00), 0.25, 0.30, 0.26),
        sec((2.27, 0, 0.96), 0.175, 0.21, 0.22),
        sec((2.50, 0, 0.91), 0.135, 0.16, 0.165),
        sec((2.72, 0, 0.855), 0.10, 0.12, 0.125),
        sec((2.86, 0, 0.81), 0.07, 0.075, 0.08),
    ]
    axial_bones = [S[f'tail{i}'] for i in range(8, 0, -1)] + [S['pelvis'], S['spine1'], S['spine2'], S['spine3'],
                                                              S['neck1'], S['neck2'], S['neck3'], S['head']]
    joints = [tail_pts[i] for i in range(7, 0, -1)] + [hip] + spine_pts + neck_pts[1:]
    axial = smooth(b.loft_chain(resample(ax, 0.12), axial_bones, joints, blend=0.25, k=0.0, samples=10,
                                name='axial'))

    # deep, slightly sagging gut between the legs
    b.add(Ellipsoid((0.70, 0, 0.99), (0.58, 0.40, 0.235), k=0.2, bind=S['spine1'], name='gut'))

    # ------------------------------------------------------------------ head
    head = S['head']
    hsecs = [
        sec(hp(-0.06, 0.0), 0.080, 0.085, 0.055, 2.2, 2.2),
        sec(hp(0.14, 0.0), 0.088, 0.090, 0.045, 2.4, 2.4),
        sec(hp(0.40, -0.003), 0.077, 0.074, 0.040, 2.5, 2.4),
        sec(hp(0.66, -0.006), 0.064, 0.064, 0.036, 2.5, 2.4),
        sec(hp(0.88, -0.010), 0.056, 0.056, 0.034, 2.4, 2.3),
        sec(hp(1.00, -0.016), 0.042, 0.044, 0.030, 2.2, 2.2),
    ]
    b.add(SmoothLoft(hsecs, samples_per_seg=10, k=0.05, bind=head, name='cranium', detail=0.7))
    # brow / supraorbital ridge and the jaw-closing muscles behind the eye
    for m in (1, -1):
        b.add(Ellipsoid(hp(0.40, 0.045, 0.055 * m), (0.07, 0.03, 0.022), R=rot_euler(ry=0.38), k=0.03, bind=head,
                        detail=1.2, name='brow'))
        b.add(Ellipsoid(hp(0.18, 0.01, 0.06 * m), (0.09, 0.045, 0.06), R=rot_euler(ry=0.38), k=0.04, bind=head,
                        name='adductor'))
    # fleshy cheeks covering the tooth row (ornithischian cheek emargination)
    for m in (1, -1):
        b.add(Ellipsoid(hp(0.42, -0.03, 0.062 * m), (0.11, 0.022, 0.03), R=rot_euler(ry=0.38, rz=-0.06 * m), k=0.03,
                        bind=head, name='cheek'))
    # keratin beak over the premaxillae
    b.add(SmoothLoft([sec(hp(0.80, -0.010), 0.058, 0.058, 0.034, 2.3, 2.2), sec(hp(0.93, -0.014), 0.054, 0.054, 0.034),
                sec(hp(1.02, -0.022), 0.034, 0.040, 0.028)], samples_per_seg=8, k=0.012, tag='claw', bind=head,
               detail=0.2, name='beak'))

    # lower jaw, sculpted closed and then opened by JAW_OPEN about the jaw joint
    jaw = S['jaw']
    jsecs = [
        sec(hp(0.08, -0.052), 0.072, 0.026, 0.062, 2.2, 2.4),
        sec(hp(0.32, -0.054), 0.066, 0.026, 0.058, 2.4, 2.4),
        sec(hp(0.62, -0.052), 0.054, 0.024, 0.046, 2.4, 2.3),
        sec(hp(0.86, -0.052), 0.044, 0.022, 0.036, 2.3, 2.2),
        sec(hp(0.98, -0.054), 0.030, 0.018, 0.024, 2.2, 2.2),
    ]
    jaw_prims = [SmoothLoft(jsecs, samples_per_seg=10, k=0.035, bind=jaw, name='mandible', detail=0.6),
                 SmoothLoft([sec(hp(0.80, -0.052), 0.046, 0.022, 0.036), sec(hp(0.99, -0.056), 0.026, 0.018, 0.024)],
                      samples_per_seg=8, k=0.01, tag='claw', bind=jaw, detail=0.2, name='predentary'),
                 Ellipsoid(hp(0.72, -0.040), (0.17, 0.035, 0.016), R=rot_euler(ry=0.38), k=0.012, op='sub',
                           tag='mouth', name='trough')]
    # the mouth slit: a thin sheet along the lip line from the corner of the mouth to the front
    slit = SmoothLoft([sec(hp(0.68, -0.036), 0.2, 0.008, 0.008, 4, 4), sec(hp(0.86, -0.038), 0.2, 0.0085, 0.0085, 4, 4),
                 sec(hp(1.10, -0.040), 0.2, 0.009, 0.009, 4, 4)], k=0.006, op='sub', tag='mouth', name='slit')
    b.add(slit)
    for p in jaw_prims:
        b.add(Xform(p, R=Rj, pivot=jaw_pivot))
    # nostrils near the front of the snout
    for m in (1, -1):
        b.add(Ellipsoid(hp(0.86, 0.020, 0.034 * m), (0.024, 0.012, 0.013), R=rot_euler(rz=0.3 * m, ry=0.38),
                        k=0.006, op='sub', name='nostril'))
    # eyes: socket + lids are field shapes; the eyeball itself is a separate mesh
    eye_r = 0.02
    for m, s in ((1, 'L'), (-1, 'R')):
        c = hp(0.38, 0.026, 0.066 * m)
        look = normalize(V(0.35, 0.93 * m, 0.02))
        b.add(Ellipsoid(c + look * 0.004, (0.036, 0.03, 0.03), k=0.012, bind=head, name='lids'))
        b.add(Ellipsoid(c, (eye_r + 0.002,) * 3, k=0.002, op='sub', name='socket'))
        Rl = np.stack([look, normalize(np.cross(V(0, 0, 1), look)),
                       normalize(np.cross(look, np.cross(V(0, 0, 1), look)))], axis=1)
        b.add(Ellipsoid(c + look * 0.03, (0.02, 0.022, 0.012), R=Rl, k=0.005, op='sub', name='aperture'))
        b.attachments.append(dict(kind='eye', center=c.tolist(), radius=eye_r, look=look.tolist(), bone='head',
                                  iris=[0.42, 0.29, 0.15], pupil='round'))

    # ------------------------------------------------------------------ throat ossicles (gular shield)
    rng = np.random.default_rng(4934)
    zc = lambda x: np.interp(x, [s['p'][0] for s in ax], [s['p'][2] for s in ax])
    for i, xo in enumerate(np.linspace(2.18, 2.74, 9)):
        for aj in np.linspace(-0.85, 0.85, 5 + (i % 2)):
            x = xo + rng.uniform(-0.02, 0.02)
            ang = aj + rng.uniform(-0.08, 0.08)
            dense = math.exp(-((x - 2.45) / 0.22) ** 2)  # densest mid-throat
            if rng.uniform() > 0.45 + 0.55 * dense:
                continue
            c0 = V(x, 0, zc(x))
            p = surface_along(axial, c0, V(0, math.sin(ang), -math.cos(ang)), reach=0.5)
            nrm = field_normal(axial, p)
            r = rng.uniform(0.012, 0.02) * (0.8 + 0.3 * dense)
            Rn = np.stack([normalize(np.cross(nrm, V(0, 1, 0)) if abs(nrm[1]) < 0.9 else V(1, 0, 0)),
                           normalize(np.cross(nrm, np.cross(nrm, V(0, 1, 0)))), nrm], axis=1)
            bone = 'neck1' if x < 2.27 else ('neck2' if x < 2.51 else 'neck3')
            b.add(Ellipsoid(p - nrm * 0.003, (r, r * rng.uniform(0.8, 1.0), r * 0.42), R=Rn, k=0.006, tag='osteo',
                            bind=S[bone], detail=0.3, name='ossicle'))

    # ------------------------------------------------------------------ hind limbs (left; mirrored)
    left = []
    leg = [
        sec((0.02, 0.30, 1.62), 0.12, 0.13, 0.13),
        sec((0.04, 0.34, 1.36), 0.18, 0.29, 0.30),
        sec((0.07, 0.355, 1.02), 0.16, 0.20, 0.21),
        sec(K + V(0, 0.005, 0), 0.135, 0.15, 0.155),
        sec((0.035, 0.355, 0.55), 0.125, 0.13, 0.17),
        sec((-0.005, 0.355, 0.35), 0.115, 0.12, 0.13),
        sec(A + V(0, 0, 0.03), 0.125, 0.13, 0.13),
    ]
    left.append(smooth(b.loft_chain(leg, [S['thigh.L'], S['shin.L'], S['meta.L']], [K, A], blend=0.10, k=0.08,
                             side=(0, 1, 0), samples=10, name='leg')))
    # elephantine foot: broad heel pad under the ankle
    left.append(b.add(Ellipsoid((0.04, 0.35, 0.10), (0.175, 0.15, 0.09), k=0.08, bind=S['meta.L'], name='pad',
                                region='foot.L')))
    # thigh muscle mass bulging below the broad ilium
    left.append(b.add(Ellipsoid((0.0, 0.30, 1.50), (0.44, 0.19, 0.36), R=rot_euler(ry=-0.1), k=0.15,
                                bind=S['thigh.L'], name='thighm')))
    # caudofemoralis: the tail-to-femur muscle filling the corner behind the thigh
    left.append(b.add(Ellipsoid((-0.38, 0.21, 1.47), (0.42, 0.16, 0.21), R=rot_euler(ry=0.3), k=0.18,
                                bind=S['pelvis'], name='caudofem')))
    # toes II-IV: short, stubby, with broad hoof-like unguals
    for dy, ln, w in ((-0.065, 0.06, 0.05), (0.0, 0.08, 0.055), (0.065, 0.06, 0.05)):
        base = V(0.12, 0.35 + dy * 0.8, 0.068)
        tip = V(0.12 + ln, 0.35 + dy * 1.3, 0.053)
        left.append(b.add(RoundCone(base, tip, w, w * 0.9, k=0.05, bind=S['toe.L'], name='toe', detail=0.8,
                                    region='foot.L')))
        dvec = normalize(tip - base)
        left.append(b.add(Ellipsoid(tip + dvec * 0.035 + V(0, 0, -0.006), (0.045, w * 1.15, 0.03),
                                    R=rot_euler(rz=math.atan2(dvec[1], dvec[0]), ry=0.2), k=0.01, tag='claw',
                                    bind=S['toe.L'], detail=0.2, name='hoof', region='foot.L')))

    # ------------------------------------------------------------------ forelimbs (short, flexed)
    arm = [
        sec(Sh + V(0.03, -0.08, 0.16), 0.13, 0.15, 0.15),
        sec(Sh + V(0, 0.02, 0), 0.165, 0.22, 0.22),
        sec((Sh + El) / 2 + V(0, 0.01, 0), 0.135, 0.15, 0.155),
        sec(El, 0.115, 0.11, 0.15),
        sec((El + Wr) / 2, 0.105, 0.115, 0.10),
        sec(Wr + V(0, 0, 0.02), 0.10, 0.105, 0.095),
    ]
    left.append(smooth(b.loft_chain(arm, [S['upperarm.L'], S['forearm.L'], S['hand.L']], [El, Wr], blend=0.06, k=0.13,
                             side=(0, 1, 0), samples=10, name='arm')))
    # scapula and shoulder muscles on the side of the chest
    left.append(b.add(Ellipsoid((1.66, 0.26, 1.22), (0.36, 0.12, 0.26), R=rot_euler(ry=0.55), k=0.12,
                                bind=S['spine3'], name='scapula')))
    # manus: five short digits in a semi-tubular arc on a common pad; I and II carry small blunt unguals
    left.append(b.add(RoundCone(Wr + V(0, 0, 0.02), Fc + V(0.01, 0, 0.08), 0.10, 0.105, k=0.05, bind=S['hand.L'],
                                name='manus', region='manus.L')))
    left.append(b.add(Ellipsoid(Fc + V(0.01, 0, 0.028), (0.125, 0.125, 0.05), k=0.04, bind=S['hand.L'], name='mpad',
                                region='manus.L')))
    for i, ang in enumerate(np.linspace(-1.25, 1.25, 5)):   # digit I medial (-y) ... V lateral
        dirv = V(math.cos(ang), math.sin(ang), 0)
        base = Fc + V(0, 0, 0.04) + dirv * 0.06
        tip = Fc + V(0, 0, 0.025) + dirv * 0.115
        left.append(b.add(RoundCone(base, tip, 0.035, 0.028, k=0.025, bind=S['hand.L'], name='digit',
                                    region='manus.L', detail=0.8)))
        if i < 2:
            left.append(b.add(Ellipsoid(tip + dirv * 0.02, (0.03, 0.026, 0.022),
                                        R=rot_euler(rz=ang), k=0.006, tag='claw', bind=S['hand.L'], detail=0.2,
                                        name='ungual', region='manus.L')))

    # ------------------------------------------------------------------ thagomizer (2 pairs)
    # anterior pair over caudals 12-14 from the tip, ~30 deg up, splayed ~50 deg; posterior pair ~25 / 35 deg
    for xb, el, sp, ln, r0, bone, tag in ((-2.50, 30, 50, 0.60 * 1.15, 0.052, 'tail6', 'spike1.L'),
                                          (-2.89, 25, 35, 0.53 * 1.15, 0.045, 'tail7', 'spike2.L')):
        e, s_ = math.radians(el), math.radians(sp)
        d = V(-math.cos(e) * math.cos(s_), math.cos(e) * math.sin(s_), math.sin(e))
        base = V(xb, 0.03, zc(xb) + 0.03)
        for p in spike(base, d, ln, r0, V(-0.05, 0, -0.01), S[bone], tag):
            left.append(b.add(p))
    b.mirror_y(left)

    # ------------------------------------------------------------------ plates (17, alternating)
    bones_x = []  # (name, x_front, x_back) along the dorsal chain
    for nm in ['head', 'neck3', 'neck2', 'neck1', 'spine3', 'spine2', 'spine1', 'pelvis'] + \
              [f'tail{i}' for i in range(1, 9)]:
        i = S[nm]
        x0, x1 = S.head[i][0], S.tail[i][0]
        bones_x.append((nm, max(x0, x1), min(x0, x1)))

    def bone_under(x):
        for nm, xf, xb in bones_x:
            if xb <= x <= xf:
                return S[nm]
        return S['tail8'] if x < 0 else S['head']

    def dorsal_z(x, y):
        c0 = V(x, y, zc(x))
        return surface_along(axial, c0, V(0, 0, 1), reach=1.0)[2]

    for i, (f, bl, ht, shape) in enumerate(PLATES):
        tm, wb, a_, be, skew = PLATE_SHAPES[shape]
        x = X(f)
        side = 1 if i % 2 == 0 else -1
        off = float(np.interp(f, [0.07, 0.17, 0.3, 0.6, 0.76], [0.035, 0.05, 0.07, 0.075, 0.05]))
        z0 = dorsal_z(x, side * off)
        # local dorsal profile -> plate 'up' leans with the back (perpendicular to the spine), mixed with vertical
        dz = dorsal_z(x + 0.12, 0.0) - dorsal_z(x - 0.12, 0.0)
        nrm = normalize(V(-dz / 0.24, 0, 1))
        up = normalize(0.65 * nrm + 0.35 * V(0, 0, 1))
        u = V(up[2], 0, -up[0])
        lean = math.radians(7.0) * side
        up = up * math.cos(lean) + V(0, 1, 0) * math.sin(lean)
        Lp, Hp = bl * KERATIN, ht * KERATIN
        embed = 0.10 + 0.08 * Lp
        outline = plate_outline(Lp, Hp, tm, wb, a_, be, skew=skew, embed=embed)
        tc = 0.010 + 0.016 * min(1.0, Hp / 0.8)
        origin = V(x, side * off, z0) - up * 0.01
        b.add(Plate(origin, u, up, outline, t_c=tc, t_rim=0.004, t_base=0.01 + 0.022 * min(1.0, Lp / 0.8),
                    base_top=0.07 + 0.14 * min(1.0, Hp / 0.8), rr=0.005, inner=0.12 + 0.12 * min(1.0, Lp / 0.8),
                    k=0.03, tag='osteo', accent=1.0, bind=bone_under(x), detail=0.15, name=f'plate{i + 1}',
                    region='plates'))

    # ------------------------------------------------------------------ metadata
    b.meta = dict(
        name='Stegosaurus stenops', common='Stegosaurus', length=LEN, mass_t=3.5,
        voxel=0.01, jaw_open=JAW_OPEN, tail_split=-1.0, faces=60000, tex=4096,
        palette=dict(back='#6A5F45', flank='#8A7D5C', belly='#CFC3A0', pattern='#3F3829',
                     accent='#7E4A30', accent2='#CF8A50', keratin='#D8CBAE', claw='#2C2824', mouth='#8a5a50',
                     eye='#6B4A26'),
        accent_grad=[1.75, 2.7],
        pattern=dict(kind='bands', count=16, start=-3.2, end=2.6, strength=0.55, mottle=0.4, low=-0.1, high=0.55),
        scales=dict(base=0.012, feature=0.045, tubercle=0.022, tubercle_density=0.22, border=0.35, folds=0.5),
        gait=dict(kind='quad', stride=2.1, duty=0.65, speed=1.0, offsets=(0.0, 0.25, 0.5, 0.75), bob=0.03,
                  sway=0.02, elbow_out=0.15, tail=0.12, neck_graze=0.5, extra=['tailswing'], neck_rest=-0.3),
    )
    return b
