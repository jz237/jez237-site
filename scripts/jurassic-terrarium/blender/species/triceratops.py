"""Triceratops prorsus — adult, after the research spec (section 3.2).

8.5 m along the midline (8.1 m nose to tail tip in the standing pose, the head pitched nose-down),
~8 t. Hip joint 2.1 m, top of hips 2.6 m, withers 2.15 m, belly clearance ~0.7 m, glenoid 1.3 m.
Femur 1.05 m : tibia 0.80 m : metatarsus 0.29 m; humerus 0.78 m : radius 0.48 m (forelimb ~0.72 of the
hindlimb). Skull with frill ~2.3 m along the skull axis, held ~24 deg nose-down with the beak ~0.7-0.85 m
above the ground. Solid frill, 1.47 m wide, a shallow backward-opening funnel raised over the neck
(the squamosal wings face sideways, so it reads as a fan from the side and a shield from the front),
with 1 midline + 2 epiparietal + 5 episquamosal flattened epiossifications per side on a pale rim;
1 m brow horns, forward-up, diverging and recurving forward, pale at the base and dark at the tips;
T. prorsus nasal horn; hooked keratin rostral and predentary. Barrel trunk, short drooping tail held
off the ground, semi-erect forelimbs with everted elbows (Fujiwara 2009): manus semi-supinated, digits
I-III hoofed and weight-bearing, IV-V stubs; pes with four short hoofed toes on an elephantine sole.
Big polygonal scales with scattered conical feature scales ("Lane", HMNS PV.1506).
"""
import math
import numpy as np
import sdf
from anatomy import Body, sec, V
from sdf import Loft, Ellipsoid, RoundCone, Box, Xform, rot_euler, normalize, chain_binding

JAW_OPEN = math.radians(2.5)  # rest pose: the beak a little open so upper and lower beaks separate cleanly

# ---------------------------------------------------------------------- skull frame
# s along the skull axis (towards the beak tip), h perpendicular to it (up), y the animal's left.
# The skull axis is pitched ~24 deg nose-down (spec: skull axis tilted ~25 deg in the standing pose).
SK_O = V(3.60, 0.0, 1.53)  # jaw-joint / frill-root station
SK_F = normalize(V(0.914, 0.0, -0.406))
SK_U = V(-SK_F[2], 0.0, SK_F[0])


def sk(s, h, y=0.0):
    return SK_O + s * SK_F + h * SK_U + V(0, y, 0)


def sksec(s, h, w, top, bot=None, nt=2.0, nb=2.0):
    return sec(sk(s, h), w, top, bot, nt, nb)


# ---------------------------------------------------------------------- helpers
class FrillShell(sdf.Prim):
    """A thin shell flaring backwards like a funnel: the ceratopsid frill.

    The frill is a cone around an axis that runs backwards through the back of the skull: the parietal
    part rises over the neck, the squamosals sweep down the sides to the cheeks, so the frill shows as a
    fan from the side and as a broad shield from the front. In polar coordinates around the axis
    (phi = 0 is 'up', +90 deg the animal's left), the mid-surface at radius r lies
    (r - r0) / tan(psi(phi)) behind c0 along 'back'; psi is the cone's half-angle. The outline is
    r <= R(phi) (symmetric in phi); band > 0 keeps only a strip of that width inside the margin (a
    thickened rim). Thickness: t_root near the root, t_body, t_rim at the margin."""

    def __init__(self, c0, back, up, r0, phis, radii, psis, t_root=0.12, t_body=0.04, t_rim=0.05, band=0.0,
                 soft=0.04, **kw):
        super().__init__(**kw)
        self.c0 = np.asarray(c0, float)
        self.back = normalize(back)
        up = np.asarray(up, float)
        self.up = normalize(up - np.dot(up, self.back) * self.back)
        self.side = np.cross(self.back, self.up)
        if self.side[1] < 0:
            self.side = -self.side
        self.r0 = r0
        self.phis = np.radians(np.asarray(phis, float))
        self.radii = np.asarray(radii, float)
        self.psis = np.radians(np.asarray(psis, float))
        self.t_root, self.t_body, self.t_rim, self.band = t_root, t_body, t_rim, band
        self.soft = soft
        ph = np.linspace(-math.pi, math.pi, 181)
        rr = np.linspace(0, 1, 25)
        PH, RR = np.meshgrid(ph, rr)
        pts = self.surface_point(PH.ravel(), (self.R(PH) * RR).ravel())
        pad = max(t_root, t_rim, t_body) + 0.02
        self._lo = pts.min(axis=0) - pad
        self._hi = pts.max(axis=0) + pad

    def R(self, phi):
        return np.interp(np.abs(phi), self.phis, self.radii)

    def _amid(self, r, phi):
        psi = np.interp(np.abs(phi), self.phis, self.psis)
        x = r - self.r0
        xp = 0.5 * (x + np.sqrt(x * x + self.soft ** 2))  # soft max(x, 0): a rounded bend at r0
        return xp / np.tan(psi), np.sin(psi)

    def surface_point(self, phi, r):
        phi = np.asarray(phi, float)
        r = np.asarray(r, float)
        a, _ = self._amid(r, phi)
        return (self.c0[None] + a[:, None] * self.back[None]
                + (r * np.cos(phi))[:, None] * self.up[None] + (r * np.sin(phi))[:, None] * self.side[None])

    def margin(self, phi, inset=0.0):
        """Margin point at angle phi (radians) moved 'inset' inwards, the outward direction along the
        surface there, and the tangent along the margin."""
        f = lambda ph, dr=0.0: self.surface_point(np.atleast_1d(ph), self.R(np.atleast_1d(ph)) - inset + dr)[0]
        p = f(phi)
        out = normalize(f(phi, 0.01) - p)
        tang = normalize(f(phi + 0.01) - f(phi - 0.01))
        return p, out, tang

    def dist(self, P):
        q = P - self.c0
        a = q @ self.back
        x1 = q @ self.up
        y1 = q @ self.side
        r = np.hypot(x1, y1)
        phi = np.arctan2(y1, x1)
        amid, sp = self._amid(r, phi)
        dn = np.abs(a - amid) * sp
        R = self.R(phi)
        rim_f = np.clip((r - (R - 0.16)) / 0.16, 0, 1)
        root_f = np.clip((self.r0 + 0.25 - r) / 0.25, 0, 1)
        t = self.t_body + (self.t_rim - self.t_body) * rim_f ** 2 + (self.t_root - self.t_body) * root_f ** 2
        dout = (r - R) / sp
        if self.band > 0:
            dout = np.maximum(dout, ((R - self.band) - r) / sp)
        return np.sqrt(dn * dn + np.maximum(dout, 0) ** 2) - t

    def bbox(self):
        return self._lo, self._hi


class WLoft(Loft):
    """A Loft with a more careful distance for thick, bent tubes (the trunk, thighs, tail base).

    sdf.Loft finds a point's piece by projecting it onto the straight centre-line segments, and holds a
    piece's section across a short fixed overlap past its ends. On the outside of a bend in a thick tube
    (the hump over the hips) that projection drifts away from the cross-section planes, which left a
    ~3 mm sawtooth at every sample and cracks (pits of several cm) between pieces; and where a big section
    changes size quickly, the true nearest piece can lie further away than the 4 nearest segments.
    Here the parameter is solved so the point lies in the piece's own (interpolated) cross-section plane,
    the section size is extrapolated past the piece ends, and pieces further along are checked too."""
    OFFS = (-16, -11, -7, -5, -3, -2, 2, 3, 5, 7, 11, 16)

    def _section_dist(self, P, j, t):
        A = self.S[j]
        AB = self.S[j + 1] - A
        seg = np.maximum(np.linalg.norm(AB, axis=1), 1e-12)
        T0, T1 = self.T[j], self.T[j + 1]
        dT = T1 - T0
        PA = P - A
        # solve (P - C(u)) . T(u) = 0 for u (Newton from the straight-segment projection)
        u = np.einsum('ij,ij->i', PA, AB) / (seg * seg)
        for _ in range(3):
            q = PA - u[:, None] * AB
            Tu = T0 + u[:, None] * dT
            f = np.einsum('ij,ij->i', q, Tu)
            fp = -np.einsum('ij,ij->i', AB, Tu) + np.einsum('ij,ij->i', q, dT)
            u = u - f / np.where(np.abs(fp) > 1e-9, fp, -1e-9)
            u = np.clip(u, -3.0, 4.0)
        last = len(self.S) - 2
        tc = np.clip(u, 0.0, 1.0)
        te = np.clip(u, np.where(j == 0, 0.0, -1.5), np.where(j == last, 1.0, 2.5))
        tt = tc[:, None]
        C = A + tt * AB
        T = T0 * (1 - tt) + T1 * tt
        T /= np.linalg.norm(T, axis=1, keepdims=True)
        Sd = self.Sd[j] * (1 - tt) + self.Sd[j + 1] * tt
        Up = self.Up[j] * (1 - tt) + self.Up[j + 1] * tt
        te_ = te[:, None]
        Vv = self.V[j] * (1 - te_) + self.V[j + 1] * te_
        Vv[:, :3] = np.maximum(Vv[:, :3], 1e-4)
        Vv[:, 3:] = np.clip(Vv[:, 3:], 1.2, 6.0)
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
        # on the inside of a bend the section planes cross beyond the centre of curvature; a point out
        # there is not in this piece (the neighbouring pieces cover it)
        inner = np.einsum('ij,ij->i', q, dT) / np.maximum(seg, 1e-9)  # (q . N) * curvature
        beyond = inner > 0.85
        # how far past this piece's end plane (> 0) or start plane the point lies; inside the piece a
        # point the solve did not bring into the plane (far inside a tight bend) counts as outside
        past = np.where(u >= 1.0, along, np.where(u <= 0.0, -along, np.maximum(-seg, np.abs(along) - 0.5 * seg)))
        overlap = 0.3 * seg
        past = np.where(beyond, np.maximum(past, 0.5), past)
        true_end = ((u >= 1.0) & (j == last)) | ((u <= 0.0) & (j == 0))
        d_side = rho - rb
        pi = past - overlap
        d_int = np.minimum(np.maximum(d_side, pi), 0) + np.sqrt(np.maximum(d_side, 0) ** 2 + np.maximum(pi, 0) ** 2)
        rc = np.minimum(w, np.minimum(top, bot))
        z = np.maximum(past, 0) / rc
        r2 = np.sqrt(r * r + z * z)
        # the cap's distance scale starts equal to the side's (rb) at the end plane, so the field has no
        # jump there (a jump in distance values shows as a crease wherever the tube is smooth-blended),
        # and ends direction-independent at the cap's tip (no pinch at the pole)
        sc = np.clip(z, 0, 1)
        d_cap = (r2 - 1.0) * (rb * (1 - sc) + rc * sc)
        return np.where(true_end, d_cap, d_int)

    def dist(self, P, K=3):
        j, tt = self._candidates(P, K)
        out = None
        for c in range(j.shape[1]):
            d = self._section_dist(P, j[:, c], tt[:, c])
            out = d if out is None else np.minimum(out, d)
        j0 = j[:, 0]
        M = len(self.S) - 1
        for o in self.OFFS:
            jj = np.clip(j0 + o, 0, M - 1)
            out = np.minimum(out, self._section_dist(P, jj, None))
        return out


def loft_chain(b, sections, bones, joint_points, blend=0.05, side=(0, 1, 0), k=0.1, tag='skin', samples=10,
               detail=1.0, name='', region=None):
    """Body.loft_chain with a WLoft."""
    lf = WLoft(sections, side=side, samples_per_seg=samples, k=k, tag=tag, name=name, detail=detail)
    lf.chain = list(bones)
    lf.region = region
    if len(bones) == 1:
        lf.bind = bones[0]
    else:
        ju = lf.param(np.array(joint_points, float))
        total = sum(np.linalg.norm(np.asarray(sections[i + 1]['p']) - np.asarray(sections[i]['p']))
                    for i in range(len(sections) - 1))
        lf.bind = chain_binding(lf, bones, ju, blend / max(total, 1e-6))
    return b.add(lf)


def bez(p0, p1, p2, t):
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t * t * p2


def horn_part(base, ctrl, tip, r0, t0, t1, n=5, taper=0.8, flat=1.0, side=(0, 1, 0), tag='keratin', k=0.03,
              bind=None, name='horn', detail=0.3, region=None):
    """A piece [t0, t1] of a tapering horn along a quadratic Bezier (base, ctrl, tip)."""
    secs = []
    for t in np.linspace(t0, t1, n):
        r = r0 * (1 - t) ** taper + 0.006
        secs.append(sec(bez(base, ctrl, tip, t), r * flat, r, r))
    return Loft(secs, side=side, samples_per_seg=6, k=k, tag=tag, bind=bind, name=name, detail=detail,
                region=region)


def hoof(tip, d, width, k=0.008, bind=None, region=None, tag='claw'):
    """A blunt, broad hoof-like ungual: a rounded, flattened block capping the toe tip, a little wider than
    the toe, its front wall sloping back like a hoof."""
    d = normalize(V(d[0], d[1], 0.0))
    side = V(-d[1], d[0], 0.0)
    R = np.stack([d, side, V(0, 0, 1)], axis=1) @ rot_euler(ry=-0.65)
    hx, hz = 0.6 * width, 0.5 * width
    low = hx * math.sin(0.65) + hz * math.cos(0.65)  # depth of the lowest corner below the centre
    c = tip - d * 0.45 * width + V(0, 0, low - 0.025 - tip[2])
    return Box(c, (hx, width, hz), R=R, round=0.85 * hz, k=k, tag=tag, bind=bind, region=region, detail=0.2,
               name='hoof')


def build():
    b = Body('triceratops')
    S = b.skel
    # ------------------------------------------------------------------ skeleton
    b.bone('root', V(0, 0, 0), V(0, 0, 0.6))
    hip_c = V(0.0, 0, 2.10)
    b.bone('pelvis', hip_c, V(0.65, 0, 2.10), 'root')
    spine_pts = [V(0.65, 0, 2.10), V(1.40, 0, 2.02), V(2.15, 0, 1.86), V(2.92, 0, 1.66)]
    b.chain('spine', spine_pts, 'pelvis')
    condyle = sk(0.05, -0.07)
    neck_pts = [V(2.92, 0, 1.66), V(3.30, 0, 1.56), condyle]
    b.chain('neck', neck_pts, 'spine3')
    b.bone('head', condyle, sk(1.55, -0.05), 'neck2')
    jaw_pivot = sk(0.15, -0.40)
    Rj = rot_euler(ry=JAW_OPEN)
    chin = (sk(1.60, -0.23) - jaw_pivot) @ Rj.T + jaw_pivot
    b.bone('jaw', jaw_pivot, chin, 'head')
    tail_pts = [hip_c, V(-0.52, 0, 1.97), V(-1.04, 0, 1.78), V(-1.55, 0, 1.56), V(-2.06, 0, 1.35),
                V(-2.53, 0, 1.15), V(-2.99, 0, 0.90)]
    b.chain('tail', tail_pts, 'pelvis')

    H, K, A, Bl = V(0.0, 0.48, 2.10), V(0.22, 0.52, 1.07), V(0.02, 0.50, 0.30), V(0.17, 0.49, 0.07)
    T3 = V(0.46, 0.50, 0.03)
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'thigh.{s}', f(H), f(K), 'pelvis', z=(1, 0, 0))
        b.bone(f'shin.{s}', f(K), f(A), f'thigh.{s}', z=(1, 0, 0))
        b.bone(f'meta.{s}', f(A), f(Bl), f'shin.{s}', z=(1, 0, 0))
        b.bone(f'toe.{s}', f(Bl), f(T3), f'meta.{s}', z=(0, 0, 1))
    Sh, El, Wr, Fc = V(2.55, 0.52, 1.30), V(2.33, 0.85, 0.60), V(2.45, 0.76, 0.14), V(2.64, 0.77, 0.03)
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'upperarm.{s}', f(Sh), f(El), 'spine3', z=(1, 0, 0))
        b.bone(f'forearm.{s}', f(El), f(Wr), f'upperarm.{s}', z=(1, 0, 0))
        b.bone(f'hand.{s}', f(Wr), f(Fc), f'forearm.{s}', z=(0, 0, 1))

    # ------------------------------------------------------------------ axial body (tail tip -> head)
    ax = [
        sec((-2.99, 0, 0.90), 0.02, 0.02, 0.02),
        sec((-2.58, 0, 1.05), 0.075, 0.08, 0.085),
        sec((-2.20, 0, 1.19), 0.135, 0.145, 0.16),
        sec((-1.79, 0, 1.35), 0.20, 0.22, 0.26),
        sec((-1.41, 0, 1.51), 0.30, 0.29, 0.35),
        sec((-1.00, 0, 1.68), 0.41, 0.38, 0.47),
        sec((-0.62, 0, 1.82), 0.52, 0.48, 0.59, 2.0, 2.1),
        sec((-0.25, 0, 1.92), 0.60, 0.62, 0.69, 2.1, 2.1),
        sec((0.10, 0, 1.94), 0.65, 0.68, 0.76, 2.1, 2.2),
        sec((0.55, 0, 1.84), 0.76, 0.76, 0.80, 2.1, 2.2),
        sec((1.06, 0, 1.70), 0.85, 0.87, 0.87, 2.1, 2.2),
        sec((1.50, 0, 1.61), 0.89, 0.90, 0.89, 2.1, 2.2),
        sec((1.91, 0, 1.55), 0.89, 0.88, 0.85, 2.1, 2.2),
        sec((2.35, 0, 1.51), 0.81, 0.79, 0.77, 2.1, 2.2),
        sec((2.80, 0, 1.50), 0.66, 0.65, 0.65, 2.1, 2.1),
        sec((3.17, 0, 1.53), 0.48, 0.56, 0.52),
        sec((3.47, 0, 1.48), 0.40, 0.47, 0.46),
        sec((3.75, 0, 1.44), 0.36, 0.36, 0.40),
    ]
    axial_bones = [S[f'tail{i}'] for i in range(6, 0, -1)] + [S['pelvis'], S['spine1'], S['spine2'], S['spine3'],
                                                              S['neck1'], S['neck2'], S['head']]
    joints = [tail_pts[i] for i in range(5, 0, -1)] + [hip_c] + spine_pts + [neck_pts[1], condyle]
    loft_chain(b, ax, axial_bones, joints, blend=0.35, k=0.0, samples=12, name='axial')

    # ------------------------------------------------------------------ head
    head = S['head']
    jaw = S['jaw']
    cran = [
        sksec(-0.10, 0.02, 0.32, 0.38, 0.42, 1.7, 2.2),
        sksec(0.18, 0.02, 0.40, 0.45, 0.50, 1.7, 2.4),
        sksec(0.50, 0.05, 0.38, 0.44, 0.42, 1.9, 2.4),
        sksec(0.80, 0.07, 0.30, 0.36, 0.36, 2.2, 2.4),
        sksec(1.06, 0.06, 0.22, 0.28, 0.32, 2.3, 2.4),
        sksec(1.30, 0.03, 0.16, 0.21, 0.25, 2.3, 2.3),
        sksec(1.50, -0.02, 0.11, 0.15, 0.18, 2.2, 2.2),
        sksec(1.64, -0.06, 0.05, 0.07, 0.08),
    ]
    b.add(WLoft(cran, samples_per_seg=10, k=0.10, bind=head, name='cranium'))
    left_head = []
    # jugal flare and cheek (covers the dental battery), and the brow-horn bosses
    left_head.append(b.add(Ellipsoid(sk(0.28, -0.24, 0.33), (0.26, 0.10, 0.24), R=rot_euler(ry=0.4), k=0.10,
                                     bind=head, name='jugal')))
    left_head.append(b.add(Ellipsoid(sk(0.72, -0.24, 0.19), (0.42, 0.11, 0.15), R=rot_euler(ry=0.4), k=0.10,
                                     bind=head, name='cheek')))
    left_head.append(b.add(Ellipsoid(sk(0.44, 0.34, 0.20), (0.15, 0.13, 0.13), k=0.08, bind=head, detail=1.5,
                                     name='hornboss')))

    # frill: a funnel-like shell flaring back over the neck; rust accent, pale epoccipital rim
    fr_c0 = sk(0.08, 0.16)
    th = math.radians(21)  # cone axis: backwards, a little flatter than the skull axis
    fr_back = V(-math.cos(th), 0, math.sin(th))
    fr_up = V(math.sin(th), 0, math.cos(th))
    phis = [0, 25, 50, 75, 90, 105, 120, 140, 180]
    radii = [0.81, 0.81, 0.80, 0.76, 0.725, 0.65, 0.48, 0.32, 0.25]
    psis = [35, 35, 36, 38, 38, 40, 43, 50, 60]
    fr = dict(c0=fr_c0, back=fr_back, up=fr_up, r0=0.34, phis=phis, radii=radii, psis=psis, soft=0.08)
    # (own UV island: inside the head's island the conformal unwrap squeezes it)
    frill = FrillShell(t_root=0.07, t_body=0.04, t_rim=0.048, k=0.05, bind=head, accent=1.0, detail=0.7,
                       name='frill', region='frill', **fr)
    b.add(frill)
    b.add(FrillShell(t_root=0.05, t_body=0.049, t_rim=0.049, band=0.015, k=0.03, bind=head, tag='osteo',
                     detail=0.5, name='frillrim', region='frill', **fr))
    # epiossifications: 1 midline + 2 epiparietals + 5 episquamosals per side, flattened onto the margin (adult)
    epi_phis = [0.0] + [15, 32, 50, 66, 82, 97, 111]
    for i, pd in enumerate(epi_phis):
        for m in ((1,) if i == 0 else (1, -1)):
            p, out, tang = frill.margin(math.radians(pd) * m)
            nrm = normalize(np.cross(out, tang))
            tang = np.cross(nrm, out)
            size = 0.075 if pd < 115 else 0.06
            Rm = np.stack([out, tang, nrm], axis=1)
            b.add(Ellipsoid(p + out * 0.025, (size * 0.75, size, 0.045), R=Rm, k=0.025, bind=head, tag='osteo',
                            detail=0.4, name='epoccipital', region='frill'))

    # brow (postorbital) horns: ~1 m with sheath, forward-up, diverging, recurving forward at the tips
    for m, s in ((1, 'L'), (-1, 'R')):
        base = sk(0.42, 0.36, 0.19 * m)
        el, az = math.radians(30), math.radians(12) * m
        d = V(math.cos(el) * math.cos(az), math.sin(az), math.sin(el))
        tip = base + d * 1.0
        ctrl = 0.5 * (base + tip) + V(-0.04, 0.02 * m, 0.10)
        # pale at the base, dark keratin towards the tip; each horn its own UV island (a cone squeezed
        # into the head's island gets almost no texels)
        b.add(horn_part(base, ctrl, tip, 0.115, 0.0, 0.45, n=4, tag='osteo', k=0.05, bind=head, name='hornbase',
                        region=f'horn.{s}'))
        b.add(horn_part(base, ctrl, tip, 0.115, 0.30, 1.0, n=6, tag='keratin', k=0.01, bind=head, name='browhorn',
                        region=f'horn.{s}'))
    # nasal horn (T. prorsus: longer, ~0.3 m)
    nb = sk(1.10, 0.24)
    ntip = nb + V(math.cos(math.radians(45)), 0, math.sin(math.radians(45))) * 0.36
    nctrl = 0.5 * (nb + ntip) + V(-0.03, 0, 0.03)
    b.add(horn_part(nb, nctrl, ntip, 0.11, 0.0, 1.0, n=5, flat=0.8, tag='keratin', k=0.05, bind=head,
                    name='nasalhorn'))
    # epijugal knobs at the cheek corners
    for m in (1, -1):
        eb = sk(0.24, -0.42, 0.42 * m)
        et = sk(0.19, -0.53, 0.52 * m)
        b.add(horn_part(eb, 0.5 * (eb + et), et, 0.075, 0.0, 1.0, n=4, taper=0.5, tag='keratin', k=0.04, bind=head,
                        name='epijugal'))
    # upper beak: rostral keratin sheath, hooked
    beak = [
        sksec(1.38, 0.03, 0.17, 0.22, 0.25, 2.4, 2.4),
        sksec(1.50, 0.00, 0.13, 0.17, 0.20, 2.4, 2.4),
        sksec(1.61, -0.05, 0.08, 0.11, 0.13, 2.3, 2.3),
        sksec(1.68, -0.10, 0.045, 0.06, 0.08),
        sksec(1.70, -0.17, 0.02, 0.025, 0.03),
    ]
    b.add(Loft(beak, samples_per_seg=8, k=0.015, tag='keratin', bind=head, name='rostral', detail=0.2))
    b.mirror_y(left_head)

    # lower jaw, sculpted closed then opened by JAW_OPEN about the jaw joint
    mand = [
        sksec(0.02, -0.42, 0.36, 0.10, 0.13),
        sksec(0.30, -0.40, 0.38, 0.17, 0.19, 2.2, 2.4),
        sksec(0.62, -0.36, 0.33, 0.14, 0.21, 2.2, 2.4),
        sksec(0.95, -0.32, 0.26, 0.10, 0.19, 2.2, 2.4),
        sksec(1.20, -0.29, 0.19, 0.07, 0.15, 2.2, 2.4),
        sksec(1.36, -0.27, 0.14, 0.05, 0.11),
    ]
    jaw_prims = [WLoft(mand, samples_per_seg=8, k=0.08, bind=jaw, name='mandible')]
    pred = [
        sksec(1.28, -0.27, 0.15, 0.06, 0.10),
        sksec(1.42, -0.255, 0.11, 0.05, 0.085),
        sksec(1.52, -0.235, 0.065, 0.035, 0.06),
        sksec(1.57, -0.215, 0.03, 0.02, 0.035),
    ]
    jaw_prims.append(Loft(pred, samples_per_seg=8, k=0.012, tag='keratin', bind=jaw, name='predentary', detail=0.2))
    # the mouth slit between the beaks: a thin sheet from the corner of the beak forwards
    slit = Loft([sksec(1.12, -0.215, 0.5, 0.008, 0.008, 4, 4), sksec(1.45, -0.205, 0.5, 0.008, 0.008, 4, 4),
                 sksec(1.85, -0.19, 0.5, 0.008, 0.008, 4, 4)], k=0.008, op='sub', tag='mouth', name='slit')
    b.add(slit)
    for p in jaw_prims:
        b.add(Xform(p, R=Rj, pivot=jaw_pivot))
    # the inside of the beak (dark mouth)
    b.add(Ellipsoid(sk(1.40, -0.22), (0.24, 0.08, 0.035), R=rot_euler(ry=0.42), k=0.02, op='sub', tag='mouth',
                    name='palate'))
    # nostrils
    for m in (1, -1):
        b.add(Ellipsoid(sk(1.26, 0.04, 0.15 * m), (0.085, 0.035, 0.055), R=rot_euler(ry=0.42), k=0.015, op='sub',
                        name='nostril'))
    # eyes: small, lateral, tucked under the brow-horn base
    eye_r = 0.042
    for m, s in ((1, 'L'), (-1, 'R')):
        c = sk(0.56, 0.20, 0.345 * m)
        look = normalize(V(0.45, 0.88 * m, 0.0))
        b.add(Ellipsoid(c + look * 0.004, (0.075, 0.065, 0.06), k=0.03, bind=head, name='lids'))
        b.add(Ellipsoid(c, (eye_r + 0.004,) * 3, k=0.004, op='sub', name='socket'))
        Rl = np.stack([look, normalize(np.cross(V(0, 0, 1), look)),
                       normalize(np.cross(look, np.cross(V(0, 0, 1), look)))], axis=1)
        b.add(Ellipsoid(c + look * 0.06, (0.045, 0.042, 0.02), R=Rl, k=0.01, op='sub', name='aperture'))
        b.attachments.append(dict(kind='eye', center=c.tolist(), radius=eye_r, look=look.tolist(), bone='head',
                                  iris=[0.35, 0.23, 0.13], pupil='round'))

    # ------------------------------------------------------------------ hind limbs (left; mirrored)
    left = []
    leg = [
        sec((0.03, 0.50, 2.16), 0.31, 0.52, 0.58),
        sec((0.10, 0.53, 1.72), 0.32, 0.46, 0.48),
        sec((0.18, 0.54, 1.32), 0.28, 0.34, 0.34),
        sec(K, 0.24, 0.25, 0.26),
        sec((0.16, 0.52, 0.85), 0.23, 0.22, 0.28),
        sec((0.09, 0.51, 0.58), 0.21, 0.19, 0.23),
        sec(A, 0.20, 0.18, 0.20),
        sec((0.06, 0.50, 0.17), 0.205, 0.19, 0.21),
    ]
    left.append(loft_chain(b, leg, [S['thigh.L'], S['shin.L'], S['meta.L']], [K, A], blend=0.14, k=0.22,
                             side=(0, 1, 0), samples=10, name='leg'))
    left.append(b.add(Ellipsoid((0.08, 0.51, 0.80), (0.17, 0.16, 0.26), R=rot_euler(ry=-0.25), k=0.1,
                                bind=S['shin.L'], name='calf')))
    # upper thigh muscle mass (iliotibialis / femorotibialis) blending into the hip
    left.append(b.add(Ellipsoid((0.02, 0.50, 1.92), (0.55, 0.30, 0.52), R=rot_euler(ry=0.15), k=0.12,
                                bind=S['thigh.L'], name='thighmass')))
    # sole and heel pad (semi-digitigrade, elephantine)
    left.append(b.add(Box((0.12, 0.49, 0.075), (0.23, 0.20, 0.075), round=0.07, k=0.10, bind=S['meta.L'],
                          name='sole', region='foot.L')))
    left.append(b.add(Ellipsoid((-0.03, 0.50, 0.16), (0.15, 0.17, 0.15), k=0.10, bind=S['meta.L'], name='heel',
                                region='foot.L')))
    # toes I-IV: short and stubby with broad hooves (I the shortest)
    toes = [
        (V(0.18, 0.37, 0.07), V(0.32, 0.33, 0.045), 0.05),
        (V(0.20, 0.43, 0.07), V(0.39, 0.40, 0.045), 0.06),
        (V(0.20, 0.50, 0.07), V(0.42, 0.51, 0.045), 0.065),
        (V(0.19, 0.57, 0.07), V(0.37, 0.62, 0.045), 0.058),
    ]
    for base, tip, w in toes:
        d = tip - base
        secs = [sec(base + d * t, w * f, w * 0.75 * f, w * 0.8 * f) for t, f in
                ((0.0, 1.0), (0.5, 0.95), (0.85, 0.9))]
        left.append(b.loft_chain(secs, [S['meta.L'], S['toe.L']], [base + d * 0.4], blend=0.05, k=0.05,
                                 side=(-d[1], d[0], 0), samples=6, name='toe', detail=0.8, region='foot.L'))
        left.append(b.add(hoof(tip, d, w * 1.1, bind=S['toe.L'], region='foot.L')))
    # fill the front of the ankle so the foot reads as one elephantine column
    left.append(b.add(Ellipsoid((0.13, 0.50, 0.22), (0.13, 0.17, 0.11), k=0.08, bind=S['meta.L'], name='instep',
                                region='foot.L')))

    # ------------------------------------------------------------------ forelimbs (semi-erect, elbows everted)
    arm = [
        sec((2.62, 0.40, 1.52), 0.28, 0.35, 0.37),
        sec(Sh + V(0, 0.03, 0), 0.28, 0.31, 0.34),
        sec((2.44, 0.71, 0.95), 0.26, 0.28, 0.30),
        sec(El, 0.20, 0.20, 0.25),
        sec((2.39, 0.81, 0.37), 0.18, 0.18, 0.17),
        sec(Wr, 0.15, 0.15, 0.14),
        sec((2.52, 0.765, 0.08), 0.155, 0.14, 0.13),
    ]
    left.append(loft_chain(b, arm, [S['upperarm.L'], S['forearm.L'], S['hand.L']], [El, Wr], blend=0.10, k=0.16,
                             side=(0, 1, 0), samples=10, name='arm'))
    # shoulder / pectoral muscles
    left.append(b.add(Ellipsoid((2.57, 0.60, 1.32), (0.38, 0.24, 0.42), R=rot_euler(ry=-0.2), k=0.12,
                                bind=S['spine3'], name='shoulder')))
    # manus: fleshy pad, digits I-III forward with small hooves, IV-V short stubs
    left.append(b.add(Ellipsoid((2.56, 0.76, 0.065), (0.17, 0.16, 0.065), k=0.05, bind=S['hand.L'], name='palm',
                                region='manus.L')))
    fingers = [
        (V(2.61, 0.67, 0.05), V(2.73, 0.63, 0.035), 0.045, True),
        (V(2.64, 0.74, 0.05), V(2.78, 0.745, 0.035), 0.05, True),
        (V(2.62, 0.81, 0.05), V(2.74, 0.86, 0.035), 0.047, True),
        (V(2.55, 0.87, 0.05), V(2.62, 0.93, 0.04), 0.04, False),
        (V(2.47, 0.88, 0.05), V(2.49, 0.94, 0.045), 0.035, False),
    ]
    for base, tip, w, hoofed in fingers:
        left.append(b.add(RoundCone(base, tip, w, w * 0.85, k=0.04, bind=S['hand.L'], name='finger',
                                    region='manus.L')))
        if hoofed:
            left.append(b.add(hoof(tip, tip - base, w * 1.1, bind=S['hand.L'], region='manus.L')))
    b.mirror_y(left)

    # ------------------------------------------------------------------ metadata
    b.meta = dict(
        name='Triceratops prorsus', common='Triceratops', length=8.5, mass_t=8.0,
        voxel=0.012, jaw_open=JAW_OPEN, tail_split=-1.0, faces=60000, tex=2048,
        palette=dict(back='#5d5240', flank='#806f55', belly='#c9ba9c', pattern='#3f362b', accent='#8c4b2e',
                     accent2='#a35c37', keratin='#332b24', claw='#4a4136', mouth='#5a3a33', eye='#5a3b22',
                     osteo='#d4c4a0'),
        accent_grad=[1.9, 2.6],  # the frill's rust warms a little towards its top
        pattern=dict(kind='bands', count=11, start=-3.0, end=3.0, strength=0.6, mottle=0.35, low=-0.25, high=0.45),
        scales=dict(base=0.045, feature=0.10, tubercle=0.17, tubercle_density=0.18, border=0.4, folds=0.5),
        gait=dict(kind='quad', stride=2.7, duty=0.65, speed=1.1, offsets=(0.0, 0.25, 0.5, 0.75), gauge=0.9,
                  elbow_out=0.35, lift=0.14, bob=0.03, sway=0.03, tail=0.12, neck_graze=0.16, head_graze=0.14,
                  neck_browse=-0.12, run_speed=3.0, run_stride=3.6, run_duty=0.45, extra=['threat'], neck_rest=-0.35, neck_threat=0.05, head_threat=0.12, pitch_threat=0.02),
    )
    return b
