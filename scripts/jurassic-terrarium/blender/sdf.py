"""Signed-distance sculpting kit for the dinosaur bodies (pure numpy, runs in system Python and in
Blender's Python).

Animal space, metres: +x forward (towards the snout), +y the animal's left, +z up, origin on the
ground below the hip joints. Every primitive knows:
  - its distance function (vectorised over an (N, 3) array),
  - a bounding box, so a dense grid only evaluates it where it can matter,
  - how it joins the body: smooth union (k = blend radius) or smooth subtraction,
  - a material tag (skin, keratin, eye, mouth, tooth, osteoderm …),
  - its bone binding: a function from points to (bone index, weight) pairs, used for skinning.

The distance functions are bounds rather than exact distances in places (ellipsoids, lofts). That
is fine for meshing and blending: only the zero set and its neighbourhood matter.
"""
import math
import numpy as np

TAGS = ['skin', 'keratin', 'eye', 'mouth', 'tooth', 'osteo', 'claw', 'feather', 'membrane', 'nail']
TAG = {t: i for i, t in enumerate(TAGS)}


def _v(a):
    return np.asarray(a, dtype=np.float64)


def normalize(v):
    v = _v(v)
    return v / max(np.linalg.norm(v), 1e-12)


def smin(a, b, k):
    """Polynomial smooth minimum (IQ), k = blend radius in metres."""
    if k <= 0:
        return np.minimum(a, b)
    h = np.clip(0.5 + 0.5 * (b - a) / k, 0.0, 1.0)
    return b + (a - b) * h - k * h * (1.0 - h)


def smax(a, b, k):
    return -smin(-a, -b, k)


def rot_from_axes(x, y=None, z=None):
    """3x3 matrix whose columns are an orthonormal frame with first axis x."""
    x = normalize(x)
    if y is None:
        ref = _v([0, 0, 1]) if abs(x[2]) < 0.9 else _v([0, 1, 0])
        y = np.cross(ref, x)
    y = _v(y) - np.dot(y, x) * x
    y = normalize(y)
    z = np.cross(x, y)
    return np.stack([x, y, z], axis=1)


def rot_euler(rx=0.0, ry=0.0, rz=0.0):
    cx, sx, cy, sy, cz, sz = math.cos(rx), math.sin(rx), math.cos(ry), math.sin(ry), math.cos(rz), math.sin(rz)
    X = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Y = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Z = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Z @ Y @ X


class Prim:
    op = 'union'  # 'union' | 'sub' | 'inter'

    def __init__(self, k=0.0, tag='skin', bind=None, op='union', name='', mirror=False, detail=1.0, region=None,
                 accent=0.0):
        self.region = region  # UV island group; None = derived from the bone binding
        self.accent = accent  # 0..1: how strongly this part takes the palette's 'accent' colour
        self.k = float(k)
        self.tag = tag
        self.bind = bind  # callable(P) -> list of (bone_index, weight array) or int bone index
        self.op = op
        self.name = name
        self.detail = detail  # how much skin detail (wrinkles/tubercles) this region takes

    def dist(self, P):
        raise NotImplementedError

    def bbox(self):
        raise NotImplementedError

    def binding(self, P):
        b = self.bind
        if b is None:
            return []
        if isinstance(b, int):
            return [(b, np.ones(len(P)))]
        if isinstance(b, (list, tuple)) and b and isinstance(b[0], tuple):
            return [(i, np.full(len(P), w)) for i, w in b]
        return b(P)


class Ellipsoid(Prim):
    def __init__(self, c, r, R=None, **kw):
        super().__init__(**kw)
        self.c = _v(c)
        self.r = _v(r)
        self.R = np.eye(3) if R is None else _v(R)

    def dist(self, P):
        q = (P - self.c) @ self.R  # into local frame
        r = self.r
        k0 = np.linalg.norm(q / r, axis=1)
        k1 = np.linalg.norm(q / (r * r), axis=1)
        return k0 * (k0 - 1.0) / np.maximum(k1, 1e-12)

    def bbox(self):
        ext = np.abs(self.R) @ self.r
        return self.c - ext, self.c + ext


class RoundCone(Prim):
    """Capsule with different end radii (IQ exact)."""

    def __init__(self, a, b, ra, rb, **kw):
        super().__init__(**kw)
        self.a, self.b = _v(a), _v(b)
        self.ra, self.rb = float(ra), float(rb)

    def dist(self, P):
        a, b, r1, r2 = self.a, self.b, self.ra, self.rb
        ba = b - a
        l2 = float(ba @ ba)
        rr = r1 - r2
        a2 = l2 - rr * rr
        il2 = 1.0 / l2
        pa = P - a
        y = pa @ ba
        z = y - l2
        xv = pa * l2 - np.outer(y, ba)
        x2 = np.einsum('ij,ij->i', xv, xv)
        y2 = y * y * l2
        z2 = z * z * l2
        k = np.sign(rr) * rr * rr * x2
        out = np.empty(len(P))
        c1 = np.sign(z) * a2 * z2 > k
        c2 = np.sign(y) * a2 * y2 < k
        out[:] = (np.sqrt(np.maximum(x2 * a2 * il2, 0)) + y * rr) * il2 - r1
        out = np.where(c2, np.sqrt(x2 + y2) * il2 - r1, out)
        out = np.where(c1, np.sqrt(x2 + z2) * il2 - r2, out)
        return out

    def bbox(self):
        r = max(self.ra, self.rb)
        return np.minimum(self.a, self.b) - r, np.maximum(self.a, self.b) + r


class Box(Prim):
    def __init__(self, c, half, R=None, round=0.0, **kw):
        super().__init__(**kw)
        self.c, self.h = _v(c), _v(half)
        self.R = np.eye(3) if R is None else _v(R)
        self.round = round

    def dist(self, P):
        q = np.abs((P - self.c) @ self.R) - (self.h - self.round)
        return np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(q.max(axis=1), 0) - self.round

    def bbox(self):
        ext = np.abs(self.R) @ self.h
        return self.c - ext, self.c + ext


class HalfSpace(Prim):
    """Points with (P - c) . n > 0 are outside. Use with op='inter' or 'sub' and a bbox."""

    def __init__(self, c, n, lo, hi, **kw):
        super().__init__(**kw)
        self.c, self.n = _v(c), normalize(n)
        self.lo, self.hi = _v(lo), _v(hi)

    def dist(self, P):
        return (P - self.c) @ self.n

    def bbox(self):
        return self.lo, self.hi


def catmull(points, samples_per_seg=8):
    """Centripetal-ish uniform Catmull-Rom through points (M, D); returns (S, D) and per-sample param
    in [0, len(points)-1]."""
    P = _v(points)
    n = len(P)
    if n == 2:
        t = np.linspace(0, 1, samples_per_seg + 1)
        return P[0] + np.outer(t, P[1] - P[0]), t
    ext = np.vstack([2 * P[0] - P[1], P, 2 * P[-1] - P[-2]])
    out, par = [], []
    for i in range(n - 1):
        p0, p1, p2, p3 = ext[i], ext[i + 1], ext[i + 2], ext[i + 3]
        ts = np.linspace(0, 1, samples_per_seg, endpoint=(i == n - 2))
        if i == n - 2:
            ts = np.linspace(0, 1, samples_per_seg + 1)
        t2, t3 = ts * ts, ts * ts * ts
        seg = 0.5 * ((2 * p1)[None] + np.outer(ts, (-p0 + p2)) + np.outer(t2, (2 * p0 - 5 * p1 + 4 * p2 - p3))
                     + np.outer(t3, (-p0 + 3 * p1 - 3 * p2 + p3)))
        out.append(seg)
        par.append(i + ts)
    return np.vstack(out), np.concatenate(par)


class Loft(Prim):
    """A tube swept along a smooth curve with an asymmetric super-elliptic cross-section.

    sections: list of dicts with keys
        p   : centre (3,)
        w   : half width (along the side axis)
        top : height above the centre line
        bot : depth below the centre line
        nt, nb : super-ellipse exponents for upper and lower halves (2 = ellipse)
        dz  : optional vertical offset of the cross-section's widest point (fraction of top/bot)
    side: reference lateral axis; the section frame keeps 'side' as close to it as the tangent allows.
    """

    def __init__(self, sections, side=(0, 1, 0), samples_per_seg=10, cap=True, **kw):
        super().__init__(**kw)
        self.sections = sections
        P = _v([s['p'] for s in sections])
        keys = ['w', 'top', 'bot', 'nt', 'nb']
        vals = _v([[s.get('w'), s.get('top', s.get('w')), s.get('bot', s.get('top', s.get('w'))),
                    s.get('nt', 2.0), s.get('nb', 2.0)] for s in sections])
        pts, par = catmull(P, samples_per_seg)
        # params: smooth interpolation (Catmull-Rom on values too, clamped positive)
        pv, _ = catmull(vals, samples_per_seg)
        pv[:, :3] = np.maximum(pv[:, :3], 1e-4)
        pv[:, 3:] = np.clip(pv[:, 3:], 1.2, 6.0)
        self.S = pts
        self.par = par
        self.V = pv
        T = np.gradient(pts, axis=0)
        T /= np.linalg.norm(T, axis=1, keepdims=True)
        side = normalize(side)
        Sd = side[None] - (T @ side)[:, None] * T
        Sd /= np.maximum(np.linalg.norm(Sd, axis=1, keepdims=True), 1e-9)
        Up = np.cross(T, Sd)
        self.T, self.Sd, self.Up = T, Sd, Up
        self.cap = cap
        r = np.max(pv[:, :3], axis=1)
        self._lo = (pts - r[:, None]).min(axis=0)
        self._hi = (pts + r[:, None]).max(axis=0)

    def bbox(self):
        return self._lo, self._hi

    def _candidates(self, P, K):
        """K nearest segments (by centre-line distance) per point: indices (n, K) and taus (n, K)."""
        A = self.S[:-1]
        B = self.S[1:]
        AB = B - A
        L2 = np.maximum(np.einsum('ij,ij->i', AB, AB), 1e-12)
        n = len(P)
        M = len(A)
        K = min(K, M)
        bi = np.zeros((n, K), dtype=np.int64)
        bt = np.zeros((n, K))
        step = max(1, int(2e6 // max(M, 1)))
        for s in range(0, n, step):
            Q = P[s:s + step]
            AP = Q[:, None, :] - A[None]
            t = np.clip(np.einsum('nmk,mk->nm', AP, AB) / L2[None], 0, 1)
            D = AP - t[..., None] * AB[None]
            d2 = np.einsum('nmk,nmk->nm', D, D)
            if K < M:
                j = np.argpartition(d2, K - 1, axis=1)[:, :K]
            else:
                j = np.broadcast_to(np.arange(M), d2.shape)
            r = np.arange(len(Q))[:, None]
            bi[s:s + step] = j
            bt[s:s + step] = t[r, j]
        return bi, bt

    def _nearest(self, P):
        j, t = self._candidates(P, 1)
        return j[:, 0], t[:, 0]

    def _section_dist(self, P, j, t):
        """Distance to the piece of the loft around segment j at param t (t clamped to [0,1]);
        beyond a piece's ends it is extruded with rounded edges, so the union of pieces is a
        smooth tube even where the curve bends tighter than the section is wide."""
        tt = t[:, None]
        C = self.S[j] * (1 - tt) + self.S[j + 1] * tt
        T = self.T[j] * (1 - tt) + self.T[j + 1] * tt
        T /= np.linalg.norm(T, axis=1, keepdims=True)
        Sd = self.Sd[j] * (1 - tt) + self.Sd[j + 1] * tt
        Up = self.Up[j] * (1 - tt) + self.Up[j + 1] * tt
        V = self.V[j] * (1 - tt) + self.V[j + 1] * tt
        q = P - C
        along = np.einsum('ij,ij->i', q, T)
        q = q - along[:, None] * T
        x = np.einsum('ij,ij->i', q, Sd)
        y = np.einsum('ij,ij->i', q, Up)
        w, top, bot, nt, nb = V[:, 0], V[:, 1], V[:, 2], V[:, 3], V[:, 4]
        h = np.where(y > 0, top, bot)
        n = np.where(y > 0, nt, nb)
        r = ((np.abs(x) / w) ** n + (np.abs(y) / h) ** n) ** (1.0 / n)
        rho = np.sqrt(x * x + y * y)
        rb = np.where(r > 1e-9, rho / np.maximum(r, 1e-9), np.minimum(w, h))  # boundary radius this way
        # extent test against the straight segment itself (the foot point was found on it, so
        # inside the segment this is exactly 0 and the neighbours agree at the joint)
        AB = self.S[j + 1] - self.S[j]
        seg = np.maximum(np.linalg.norm(AB, axis=1), 1e-12)
        qs = np.einsum('ij,ij->i', P - C, AB) / seg
        past = np.where(t >= 1.0, qs, np.where(t <= 0.0, -qs, -seg))  # > 0 beyond this piece
        overlap = 0.3 * seg  # interior joints overlap slightly so no zero-sheet forms inside the tube
        last = len(self.S) - 2
        true_end = ((t >= 1.0) & (qs > 0) & (j == last)) | ((t <= 0.0) & (qs < 0) & (j == 0))
        # interior pieces: plain extrusion (their neighbours continue the tube)
        d_side = rho - rb
        pi = past - overlap
        d_int = np.minimum(np.maximum(d_side, pi), 0) + np.sqrt(np.maximum(d_side, 0) ** 2 + np.maximum(pi, 0) ** 2)
        if not self.cap:
            return np.where(true_end, np.maximum(d_side, past), d_int)
        # true ends: a half-ellipsoid whose length is the section's smaller radius
        rc = np.minimum(w, np.minimum(top, bot))
        z = np.maximum(past, 0) / rc
        r2 = np.sqrt(r * r + z * z)
        d_cap = (r2 - 1.0) * np.minimum(rb, rc * 1.5)
        return np.where(true_end, d_cap, d_int)

    def eval_local(self, P):
        j, t = self._nearest(P)
        return j, t

    def dist(self, P, K=4):
        j, t = self._candidates(P, K)
        out = None
        for c in range(j.shape[1]):
            d = self._section_dist(P, j[:, c], t[:, c])
            out = d if out is None else np.minimum(out, d)
        return out

    def param(self, P):
        """Normalised position along the loft (0 at first section, 1 at last) for points."""
        j, t = self._nearest(P)
        return (self.par[j] * (1 - t) + self.par[j + 1] * t) / (len(self.sections) - 1)


class SmoothLoft(Loft):
    """Opt-in Loft with a crease-free distance, for thick bent tubes (trunk, neck, tail, limbs).

    Same constructor, sections, frames, bbox and param() as Loft; only dist() differs.

    Loft takes the union of its pieces, each extruded a little past its ends. Where the tube bends or
    its section changes size, the overlapping piece ends leave a rib at every sample, and sheets,
    creases and pits at the joints. Here every point is measured against ONE piece of the centre line
    (no union), in the cross-section plane that passes through the point: the plane's normal turns
    smoothly from one sample's tangent to the next along the piece, and the section size is
    interpolated with it. Neighbouring pieces share their end plane, so on the outside of a bend the
    planes fan out continuously; there is neither a rib nor a plateau where one piece hands over to the
    next. A point is given to the nearest piece (by its centre line) or one of that piece's neighbours,
    whichever actually holds the point's plane.

    The true ends are capped with a half-ellipsoid. Its distance scale starts equal to the side's at the
    end plane, so the field does not jump there, and becomes direction-independent at the tip (no pinch
    at the pole).

    Combines stegosaurus.SmoothLoft (one nearest piece, no union) with triceratops.WLoft (the point's
    own interpolated section plane, the continuous cap).
    """

    def _plane_u(self, P, j):
        """Parameter u along piece j whose interpolated section plane passes through P (unclamped).
        (P - A - u AB) . (T0 + u dT) = 0 is a quadratic in u; take the root near the chord projection."""
        A = self.S[j]
        AB = self.S[j + 1] - A
        T0 = self.T[j]
        dT = self.T[j + 1] - T0
        PA = P - A
        qa = -np.einsum('ij,ij->i', AB, dT)
        qb = np.einsum('ij,ij->i', PA, dT) - np.einsum('ij,ij->i', AB, T0)
        qc = np.einsum('ij,ij->i', PA, T0)
        disc = qb * qb - 4 * qa * qc
        sq = np.sqrt(np.maximum(disc, 0.0))
        den = -qb - np.where(qb >= 0, sq, -sq)
        u_lin = -qc / np.where(np.abs(qb) > 1e-12, qb, -1e-12)
        u = np.where((disc >= 0) & (np.abs(den) > 1e-12), 2 * qc / np.where(np.abs(den) > 1e-12, den, 1.0), u_lin)
        return u

    def _piece_dist(self, P, j, u):
        """Distance measured in piece j's section plane at parameter u (clamped to the piece; beyond a
        true end the remainder becomes the cap). Returns (distance, |P - centre|)."""
        last = len(self.S) - 2
        tc = np.clip(u, 0.0, 1.0)
        tt = tc[:, None]
        C = self.S[j] * (1 - tt) + self.S[j + 1] * tt
        T = self.T[j] * (1 - tt) + self.T[j + 1] * tt
        T /= np.linalg.norm(T, axis=1, keepdims=True)
        Sd = self.Sd[j] * (1 - tt) + self.Sd[j + 1] * tt
        Up = self.Up[j] * (1 - tt) + self.Up[j + 1] * tt
        Vv = self.V[j] * (1 - tt) + self.V[j + 1] * tt
        q = P - C
        cdist = np.linalg.norm(q, axis=1)
        along = np.einsum('ij,ij->i', q, T)
        q = q - along[:, None] * T
        x = np.einsum('ij,ij->i', q, Sd)
        y = np.einsum('ij,ij->i', q, Up)
        w, top, bot, nt, nb = Vv[:, 0], Vv[:, 1], Vv[:, 2], Vv[:, 3], Vv[:, 4]
        h = np.where(y > 0, top, bot)
        n = np.where(y > 0, nt, nb)
        r = ((np.abs(x) / w) ** n + (np.abs(y) / h) ** n) ** (1.0 / n)
        rho = np.sqrt(x * x + y * y)
        rb = np.where(r > 1e-9, rho / np.maximum(r, 1e-9), np.minimum(w, h))  # boundary radius this way
        true_end = ((u > 1.0) & (along > 0) & (j == last)) | ((u < 0.0) & (along < 0) & (j == 0))
        # 'along' is ~0 when the plane was solved; elsewhere the joint's section is swept around it
        d_side = np.sqrt(rho * rho + along * along) - rb
        if not self.cap:
            return np.where(true_end, np.maximum(rho - rb, np.abs(along)), d_side), cdist
        rc = np.minimum(w, np.minimum(top, bot))
        z = np.abs(along) / rc
        sc = np.clip(z, 0.0, 1.0)
        d_cap = (np.sqrt(r * r + z * z) - 1.0) * (rb * (1 - sc) + rc * sc)
        return np.where(true_end, d_cap, d_side), cdist

    def dist(self, P, K=1):
        j0, t0 = self._candidates(P, 1)
        j0, t0 = j0[:, 0], t0[:, 0]
        last = len(self.S) - 2
        tol = 1e-6
        # fallback: the nearest piece at its chord projection (as stegosaurus.SmoothLoft)
        best, _ = self._piece_dist(P, j0, t0)
        bestc = np.full(len(P), np.inf)
        for o in (0, -1, 1):
            j = np.clip(j0 + o, 0, last)
            u = self._plane_u(P, j)
            ok = ((u >= -tol) | (j == 0)) & ((u <= 1 + tol) | (j == last))
            d, cd = self._piece_dist(P, j, u)
            take = ok & (cd < bestc)
            best = np.where(take, d, best)
            bestc = np.where(take, cd, bestc)
        return best


class Field:
    """An ordered list of primitives combined left to right."""

    def __init__(self):
        self.prims = []

    def add(self, p):
        self.prims.append(p)
        return p

    def extend(self, ps):
        for p in ps:
            self.add(p)

    def bounds(self, pad=0.05):
        lo = np.full(3, np.inf)
        hi = np.full(3, -np.inf)
        for p in self.prims:
            if p.op != 'union':
                continue
            a, b = p.bbox()
            lo = np.minimum(lo, a)
            hi = np.maximum(hi, b)
        return lo - pad, hi + pad

    def eval(self, P, band=None, upto=None):
        """Distance for points P. band: skip primitives whose bbox (grown by k + band) misses."""
        d = np.full(len(P), 1e3)
        prims = self.prims if upto is None else self.prims[:upto]
        for p in prims:
            lo, hi = p.bbox()
            g = p.k + (band if band is not None else 0.0) + 1e-6
            if band is not None:
                m = np.all((P >= lo - g) & (P <= hi + g), axis=1)
                if not m.any():
                    continue
                idx = np.nonzero(m)[0]
                dp = p.dist(P[idx])
                cur = d[idx]
            else:
                idx = slice(None)
                dp = p.dist(P)
                cur = d
            if p.op == 'union':
                new = smin(cur, dp, p.k)
            elif p.op == 'sub':
                new = smax(cur, -dp, p.k)
            else:  # inter
                new = smax(cur, dp, p.k)
            d[idx] = new
        return d

    def tag_weights(self, P, sigma=0.02):
        """Soft material and bone membership for surface points.

        Returns (tagw (N, len(TAGS)), bones dict idx->weights, detail (N,)).
        Each union primitive contributes exp(-max(d,0)/sigma) where d is its own distance; the
        sub-primitives with tags (e.g. a mouth cavity) contribute where the point lies on their
        boundary (|d| small)."""
        n = len(P)
        tagw = np.zeros((n, len(TAGS)))
        detail = np.zeros(n)
        accent = np.zeros(n)
        detw = np.zeros(n)
        bones = {}
        for p in self.prims:
            lo, hi = p.bbox()
            g = 6 * sigma + p.k
            m = np.all((P >= lo - g) & (P <= hi + g), axis=1)
            if not m.any():
                continue
            idx = np.nonzero(m)[0]
            Q = P[idx]
            dp = p.dist(Q)
            if p.op == 'union':
                w = np.exp(-np.maximum(dp, 0) / sigma) * (dp < 6 * sigma + p.k)
            elif p.op == 'sub':
                w = np.exp(-np.abs(dp) / (0.5 * sigma)) * (np.abs(dp) < 3 * sigma)
                if p.tag == 'skin':
                    continue
            else:
                continue
            if not w.any():
                continue
            tagw[idx, TAG[p.tag]] += w
            detail[idx] += w * p.detail
            accent[idx] += w * p.accent
            detw[idx] += w
            if p.op == 'union' and p.bind is not None:
                for bi, bw in p.binding(Q):
                    arr = bones.setdefault(bi, np.zeros(n))
                    arr[idx] += w * bw
        s = tagw.sum(axis=1, keepdims=True)
        tagw = np.where(s > 0, tagw / np.maximum(s, 1e-12), np.eye(len(TAGS))[0][None])
        detail = np.where(detw > 0, detail / np.maximum(detw, 1e-12), 1.0)
        self.last_accent = np.where(detw > 0, accent / np.maximum(detw, 1e-12), 0.0)
        return tagw, bones, detail


def chain_binding(loft, bone_ids, joints, blend):
    """Bind a loft to a chain of bones. joints[i] is the loft parameter (0..1) of the joint between
    bone_ids[i] and bone_ids[i+1]; weights cross over smoothly within +-blend (a scalar or per joint)
    of each joint."""
    joints = np.asarray(joints, dtype=np.float64)
    bl = np.broadcast_to(np.asarray(blend, dtype=np.float64), joints.shape)

    def bind(P):
        u = loft.param(P)
        # cumulative: f_i = how far past joint i the point is (0 before, 1 after)
        fs = []
        for jv, b in zip(joints, bl):
            f = np.clip((u - (jv - b)) / max(2 * b, 1e-9), 0, 1)
            fs.append(f * f * (3 - 2 * f))
        out = []
        n = len(bone_ids)
        for i, bid in enumerate(bone_ids):
            w = np.ones(len(P))
            if i > 0:
                w = w * fs[i - 1]
            if i < n - 1:
                w = w * (1 - fs[i])
            out.append((bid, w))
        return out

    return bind


def segment_binding(a, b, bone_a, bone_b, blend=0.25):
    """Bind points to bone_a near a and bone_b near b along the segment a->b; the middle 'blend'
    fraction around the far joint mixes them."""
    a, b = _v(a), _v(b)
    ab = b - a
    L2 = float(ab @ ab)

    def bind(P):
        t = np.clip(((P - a) @ ab) / L2, 0, 1)
        f = np.clip((t - (1 - blend)) / blend, 0, 1)
        f = f * f * (3 - 2 * f)
        return [(bone_a, 1 - f), (bone_b, f)]

    return bind


# ---------------------------------------------------------------------------- dense grids

def grid_axes(lo, hi, voxel):
    nx, ny, nz = [int(math.ceil((hi[i] - lo[i]) / voxel)) + 1 for i in range(3)]
    return nx, ny, nz


def eval_slab(field, lo, voxel, shape, z0, z1, band):
    nx, ny, nz = shape
    xs = lo[0] + np.arange(nx) * voxel
    ys = lo[1] + np.arange(ny) * voxel
    zs = lo[2] + np.arange(z0, z1) * voxel
    X, Y, Z = np.meshgrid(xs, ys, zs, indexing='ij')
    P = np.stack([X.ravel(), Y.ravel(), Z.ravel()], axis=1)
    d = field.eval(P, band=band)
    return d.reshape(nx, ny, z1 - z0).astype(np.float32)


class Xform(Prim):
    """A primitive moved rigidly: rotated by R about pivot, then translated by t."""

    def __init__(self, inner, R=None, pivot=(0, 0, 0), t=(0, 0, 0)):
        super().__init__(k=inner.k, tag=inner.tag, bind=None, op=inner.op, name=inner.name, detail=inner.detail,
                         region=inner.region, accent=inner.accent)
        self.inner = inner
        self.bind = inner.bind  # binding() below maps the points back into the inner frame
        self.chain = getattr(inner, 'chain', None)
        self.R = np.eye(3) if R is None else _v(R)
        self.pivot = _v(pivot)
        self.t = _v(t)

    def _inv(self, P):
        return (P - self.pivot - self.t) @ self.R + self.pivot

    def dist(self, P):
        return self.inner.dist(self._inv(P))

    def binding(self, P):
        return self.inner.binding(self._inv(P))

    def bbox(self):
        lo, hi = self.inner.bbox()
        corners = np.array([[x, y, z] for x in (lo[0], hi[0]) for y in (lo[1], hi[1]) for z in (lo[2], hi[2])])
        c = (corners - self.pivot) @ self.R.T + self.pivot + self.t
        return c.min(axis=0), c.max(axis=0)


class Group(Prim):
    """Several primitives treated as one (combined with their own ops), e.g. a tooth row."""

    def __init__(self, prims, **kw):
        super().__init__(**kw)
        self.items = prims
        lo = np.full(3, np.inf)
        hi = np.full(3, -np.inf)
        for p in prims:
            a, b = p.bbox()
            lo, hi = np.minimum(lo, a), np.maximum(hi, b)
        self._lo, self._hi = lo, hi

    def dist(self, P):
        d = np.full(len(P), 1e3)
        for p in self.items:
            d = smin(d, p.dist(P), p.k)
        return d

    def bbox(self):
        return self._lo, self._hi
