"""Brachiosaurus altithorax — adult, ~22 m, ~30 t (Taylor 2009 mass; FMNH P 25107 proportions).

Not the Berlin mount (that is Giraffatitan): the trunk and tail are longer, the nasal arch is lower,
and the fleshy nostrils sit near the snout tip (Witmer 2001). Skull 0.70 m (USNM 5730), humerus
2.16 m, femur 2.03 m; forelimbs ~1.15x the hindlimbs. Neck raised ~50 degrees from the shoulders,
head flexed ~30 degrees nose-down, back sloping from the withers to the hips, tail held off the
ground. Columnar limbs on elephantine pads: tube-like front feet with a single thumb claw, hind feet
with sickle claws on digits I-III. No skin is known: polygonal tubercles as in other sauropods.
"""
import math
import numpy as np
from anatomy import Body, sec, claw, V
from sdf import Loft, SmoothLoft, Ellipsoid, RoundCone, Box, rot_euler, normalize, chain_binding

JAW_OPEN = math.radians(3.5)     # rest pose: the lips just part
HEAD_PITCH = math.radians(30.0)  # snout points forward-down

# head frame: origin at the head joint (occipital condyle); u forward along the skull, v up, w left
H0 = V(10.05, 0, 10.98)
RH = rot_euler(ry=HEAD_PITCH)
FWD, UP, LEFT = RH[:, 0].copy(), RH[:, 2].copy(), V(0, 1, 0)
JP = (0.04, -0.06)                # jaw joint in head-local (u, v)
RJ = rot_euler(ry=JAW_OPEN)


def hp(u, v, w=0.0, jaw=False):
    """Head-local (u, v, w) -> animal space; jaw=True applies the rest-pose jaw opening."""
    if jaw:
        q = RJ @ V(u - JP[0], w, v - JP[1])
        u, w, v = q[0] + JP[0], q[1], q[2] + JP[1]
    return H0 + u * FWD + v * UP + w * LEFT


def hR(R=None, jaw=False):
    R = np.eye(3) if R is None else R
    return RH @ (RJ @ R if jaw else R)


def hsec(u, v, w, top, bot, nt=2.0, nb=2.0, jaw=False):
    return sec(hp(u, v, 0.0, jaw), w, top, bot, nt, nb)


def _surface_w(prim, u, v):
    """Half width of a head primitive at head-local (u, v): where its distance crosses zero sideways."""
    lo, hi = 0.0, 0.5
    for _ in range(40):
        mid = 0.5 * (lo + hi)
        if prim.dist(hp(u, v, mid)[None])[0] < 0:
            lo = mid
        else:
            hi = mid
    return lo


def _surface_v(prims, u, w):
    """Height of the head surface (union of prims) above head-local (u, w)."""
    lo, hi = 0.0, 0.6
    for _ in range(40):
        mid = 0.5 * (lo + hi)
        q = hp(u, mid, w)[None]
        if min(p.dist(q)[0] for p in prims) < 0:
            lo = mid
        else:
            hi = mid
    return lo


def smooth_chain(b, sections, bones, joint_points, blend=0.05, side=(0, 1, 0), k=0.1, tag='skin', samples=10,
                 detail=1.0, name='', region=None):
    """Body.loft_chain with an sdf.SmoothLoft: same binding, no ribs or creases at bends and joints
    (as in trex.py)."""
    lf = SmoothLoft(sections, side=side, samples_per_seg=samples, k=k, tag=tag, name=name, detail=detail)
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


def build():
    b = Body('brachiosaurus')
    S = b.skel
    # ------------------------------------------------------------------ skeleton
    b.bone('root', V(0, 0, 0), V(0, 0, 0.8))
    HIP = V(0, 0, 3.63)
    sp = [HIP, V(1.15, 0, 4.05), V(2.40, 0, 4.27), V(3.45, 0, 4.55), V(4.62, 0, 5.15)]
    b.bone('pelvis', sp[0], sp[1], 'root')
    b.bone('spine1', sp[1], sp[2], 'pelvis')
    b.bone('spine2', sp[2], sp[3], 'spine1')
    b.bone('spine3', sp[3], sp[4], 'spine2')
    # neck: 7 bones from the shoulders to the head joint, a gentle S at both ends
    neck_pts = [sp[4], V(5.45, 0, 6.04), V(6.32, 0, 7.12), V(7.28, 0, 8.40), V(8.23, 0, 9.56),
                V(9.12, 0, 10.44), V(9.68, 0, 10.84), H0]
    b.chain('neck', neck_pts, 'spine3')
    snout = hp(0.665, 0.04)
    b.bone('head', H0, snout, 'neck7')
    jaw_pivot = hp(*JP)
    chin = hp(0.675, -0.07, jaw=True)
    b.bone('jaw', jaw_pivot, chin, 'head')
    tail_pts = [V(0, 0, 3.70), V(-0.95, 0, 3.73), V(-1.90, 0, 3.66), V(-2.85, 0, 3.55), V(-3.80, 0, 3.41),
                V(-4.70, 0, 3.26), V(-5.60, 0, 3.08), V(-6.45, 0, 2.88), V(-7.30, 0, 2.64), V(-8.15, 0, 2.40)]
    b.chain('tail', tail_pts, 'pelvis')

    # hind limb: femur 2.02, tibia 1.25, metatarsus 0.37 (1 : 0.62 : 0.18); nearly straight
    Hj, K, A, Bl, T3 = V(0, 0.62, 3.63), V(0.14, 0.64, 1.62), V(0.0, 0.62, 0.38), V(0.24, 0.62, 0.10), \
        V(0.58, 0.64, 0.05)
    # forelimb: humerus 2.15, radius 1.25, metacarpus 0.80 (1 : 0.58 : 0.37); slightly everted elbow
    Sh, El, Wr, Hc = V(4.00, 0.80, 4.30), V(3.90, 0.90, 2.16), V(4.02, 0.88, 0.92), V(4.04, 0.87, 0.12)
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'thigh.{s}', f(Hj), f(K), 'pelvis', z=(1, 0, 0))
        b.bone(f'shin.{s}', f(K), f(A), f'thigh.{s}', z=(1, 0, 0))
        b.bone(f'meta.{s}', f(A), f(Bl), f'shin.{s}', z=(1, 0, 0))
        b.bone(f'toe.{s}', f(Bl), f(T3), f'meta.{s}', z=(0, 0, 1))
        b.bone(f'upperarm.{s}', f(Sh), f(El), 'spine3', z=(1, 0, 0))
        b.bone(f'forearm.{s}', f(El), f(Wr), f'upperarm.{s}', z=(1, 0, 0))
        b.bone(f'hand.{s}', f(Wr), f(Hc), f'forearm.{s}', z=(1, 0, 0))

    # ------------------------------------------------------------------ axial body (tail tip -> head)
    ax = [
        sec((-8.22, 0, 2.39), 0.025, 0.025, 0.025),
        sec((-7.55, 0, 2.60), 0.07, 0.075, 0.08),
        sec((-6.70, 0, 2.85), 0.125, 0.135, 0.145),
        sec((-5.70, 0, 3.07), 0.185, 0.195, 0.215),
        sec((-4.60, 0, 3.28), 0.255, 0.265, 0.295),
        sec((-3.40, 0, 3.47), 0.345, 0.355, 0.405),
        sec((-2.20, 0, 3.62), 0.46, 0.47, 0.55, 2.0, 2.0),
        sec((-1.10, 0, 3.72), 0.62, 0.58, 0.72, 2.3, 2.0),
        sec((0.00, 0, 3.90), 0.90, 0.60, 1.08, 2.6, 2.1),
        sec((0.57, 0, 4.00), 1.03, 0.79, 1.27, 2.45, 2.15),
        sec((1.15, 0, 4.10), 1.14, 0.96, 1.44, 2.3, 2.2),
        sec((2.40, 0, 4.32), 1.24, 1.00, 1.76, 2.1, 2.2),
        sec((3.45, 0, 4.58), 1.20, 1.00, 1.92, 2.1, 2.1),
        sec((4.30, 0, 4.92), 1.05, 0.95, 1.58, 2.1, 2.0),
        sec((4.95, 0, 5.42), 0.82, 0.76, 1.20, 2.1, 1.9),
        sec((5.50, 0, 6.10), 0.64, 0.64, 0.80, 2.1, 1.85),
        sec((6.32, 0, 7.12), 0.50, 0.52, 0.60, 2.1, 1.85),
        sec((7.28, 0, 8.40), 0.40, 0.41, 0.47, 2.1, 1.85),
        sec((8.23, 0, 9.56), 0.32, 0.33, 0.37, 2.1, 1.85),
        sec((9.12, 0, 10.44), 0.25, 0.26, 0.29, 2.1, 1.9),
        sec((9.68, 0, 10.84), 0.185, 0.21, 0.23, 2.0, 2.0),
        sec(H0, 0.155, 0.19, 0.19),
        hsec(0.14, 0.07, 0.15, 0.15, 0.14),
    ]
    axial_bones = [S[f'tail{i}'] for i in range(9, 0, -1)] + [S['pelvis'], S['spine1'], S['spine2'], S['spine3']]
    axial_bones += [S[f'neck{i}'] for i in range(1, 8)] + [S['head']]
    joints = [tail_pts[i] for i in range(8, 0, -1)] + [tail_pts[0]] + sp[1:] + neck_pts[1:]
    smooth_chain(b, ax, axial_bones, joints, blend=0.4, k=0.0, samples=28, name='axial')
    # deep chest and the pectoral girdle: fills the junction of chest and neck underside
    b.add(Ellipsoid((4.30, 0, 3.50), (1.00, 0.88, 1.00), R=rot_euler(ry=-0.5), k=0.5, bind=S['spine3'],
                    name='chest'))
    left = []
    # pectoral muscles: tie the lower chest into the upper arms (no pot-belly between the forelimbs)
    left.append(b.add(Ellipsoid((4.25, 0.50, 3.05), (0.62, 0.48, 0.70), R=rot_euler(ry=-0.25), k=0.45,
                                bind=S['spine3'], name='pectoral')))
    # caudofemoralis bulge either side of the tail base
    left.append(b.add(Ellipsoid((-0.90, 0.36, 3.58), (1.15, 0.30, 0.50), k=0.5, bind=S['tail1'],
                                name='caudofem')))

    # ------------------------------------------------------------------ head
    head = S['head']
    # profile (u, top, upper lip line, half width, top exponent): rounded occiput, a moderate narial
    # arch in front of the eye, then a long, broad, blunt muzzle (U-shaped from above). The loft's
    # centre line is kept straight (v = VC) so its pieces cannot fan apart over the arch.
    VC = 0.06
    prof = [(-0.07, 0.15, -0.05, 0.12, 2.2), (0.02, 0.215, -0.07, 0.16, 2.3), (0.11, 0.245, -0.065, 0.172, 2.2),
            (0.19, 0.29, -0.045, 0.168, 1.9), (0.26, 0.33, -0.035, 0.155, 1.7), (0.33, 0.315, -0.032, 0.145, 1.8),
            (0.40, 0.265, -0.03, 0.14, 2.2), (0.47, 0.215, -0.03, 0.136, 2.6), (0.54, 0.19, -0.03, 0.132, 2.8),
            (0.60, 0.175, -0.03, 0.127, 2.8), (0.64, 0.155, -0.028, 0.118, 2.6)]
    cran = [hsec(u, VC, w, t - VC, VC - bo, nt, 3.5) for u, t, bo, w, nt in prof]
    cranium = b.add(Loft(cran, samples_per_seg=8, k=0.09, bind=head, name='cranium', detail=1.2))
    # broad, rounded U-shaped muzzle front
    muzzle = b.add(Ellipsoid(hp(0.625, 0.065), (0.06, 0.122, 0.105), R=hR(), k=0.04, bind=head, name='muzzle'))
    for m in (1, -1):
        # jaw-closing muscles behind the eye
        b.add(Ellipsoid(hp(0.07, 0.10, 0.11 * m), (0.10, 0.06, 0.09), R=hR(), k=0.08, bind=head, name='adductor'))
    # throat: the neck's underside runs smoothly into the back of the lower jaw
    b.add(Ellipsoid(hp(0.0, -0.11), (0.19, 0.13, 0.12), R=hR(), k=0.1, bind=head, name='throat'))

    # lower jaw (sculpted shut, opened by JAW_OPEN about the jaw joint); its flat top tucks into the
    # upper lip so the lips meet flush along the slit
    jaw = S['jaw']
    JC = -0.07
    jprof = [(-0.04, -0.02, -0.125, 0.125), (0.04, -0.012, -0.14, 0.135), (0.12, -0.012, -0.152, 0.135),
             (0.24, -0.015, -0.148, 0.13), (0.36, -0.015, -0.14, 0.128), (0.48, -0.015, -0.13, 0.126),
             (0.57, -0.015, -0.125, 0.124), (0.62, -0.016, -0.118, 0.118)]
    jaw_secs = [hsec(u, JC, w, t - JC, JC - bo, 3.5, 2.2, jaw=True) for u, t, bo, w in jprof]
    b.add(Loft(jaw_secs, samples_per_seg=8, k=0.04, bind=jaw, name='mandible', detail=1.0))
    b.add(Ellipsoid(hp(0.615, -0.068, jaw=True), (0.05, 0.112, 0.058), R=hR(jaw=True), k=0.03, bind=jaw, name='chin'))
    # mouth: tongue trough in the jaw, palate in the skull, and the slit along the lip line
    b.add(Ellipsoid(hp(0.46, -0.03, jaw=True), (0.19, 0.08, 0.03), R=hR(jaw=True), k=0.02, op='sub', tag='mouth',
                    name='trough'))
    b.add(Ellipsoid(hp(0.46, -0.025), (0.19, 0.08, 0.03), R=hR(), k=0.02, op='sub', tag='mouth', name='palate'))
    # (the gap must stay wider than a 3 cm voxel or the lips alias into holes)
    slit = Loft([sec(hp(0.34, -0.026), 0.3, 0.010, 0.010, 4, 4), sec(hp(0.50, -0.029), 0.3, 0.013, 0.013, 4, 4),
                 sec(hp(0.78, -0.031), 0.3, 0.013, 0.013, 4, 4)], k=0.008, op='sub', tag='mouth', name='slit')
    b.add(slit)
    b.add(Ellipsoid(hp(0.44, -0.042, jaw=True), (0.15, 0.06, 0.02), R=hR(jaw=True), k=0.02, tag='mouth', bind=jaw,
                    name='tongue'))
    # fleshy nostrils far forward near the snout tip (Witmer 2001), not on the arch
    nv = _surface_v([cranium, muzzle], 0.585, 0.06)
    for m in (1, -1):
        b.add(Ellipsoid(hp(0.585, nv - 0.008, 0.062 * m), (0.05, 0.026, 0.03), R=hR(rot_euler(rz=0.35 * m)), k=0.012,
                        op='sub', name='nostril'))
    # eyes: lids + socket are field shapes; the eyeball is a separate mesh
    eye_r = 0.032
    for m, s in ((1, 'L'), (-1, 'R')):
        c = hp(0.17, 0.17, (_surface_w(cranium, 0.17, 0.17) - 0.017) * m)
        look = normalize(RH @ V(0.30, 0.94 * m, 0.12))
        b.add(Ellipsoid(c + look * 0.004, (0.06, 0.045, 0.05), R=hR(), k=0.025, bind=head, name='lids'))
        b.add(Ellipsoid(c, (eye_r + 0.004,) * 3, k=0.004, op='sub', name='socket'))
        R = np.stack([look, normalize(np.cross(UP, look)), normalize(np.cross(look, np.cross(UP, look)))], axis=1)
        b.add(Ellipsoid(c + look * 0.045, (0.035, 0.034, 0.016), R=R, k=0.01, op='sub', name='aperture'))
        b.attachments.append(dict(kind='eye', center=c.tolist(), radius=eye_r, look=look.tolist(), bone='head',
                                  iris=[0.36, 0.28, 0.18], pupil='round'))
    # spatulate teeth in the front half of the jaws; only the tips show between the lips
    teeth = []
    for m in (1, -1):
        for u in np.linspace(0.40, 0.63, 7):
            hw = np.interp(u, [0.45, 0.60, 0.645], [0.13, 0.125, 0.11]) - 0.03
            base = hp(u, -0.008, hw * m)
            d = RH @ V(0.25, 0.06 * m, -1)
            teeth.append(dict(base=base.tolist(), dir=d.tolist(), length=0.04, radius=0.011, bone='head'))
        for u in np.linspace(0.44, 0.61, 6):
            hw = np.interp(u, [0.47, 0.56, 0.62], [0.115, 0.115, 0.105]) - 0.035
            base = hp(u, -0.045, hw * m, jaw=True)
            d = RH @ RJ @ V(0.25, 0.04 * m, 1)
            teeth.append(dict(base=base.tolist(), dir=d.tolist(), length=0.03, radius=0.009, bone='jaw'))
    b.attachments.append(dict(kind='teeth', items=teeth))

    # ------------------------------------------------------------------ hind limb (left; mirrored)
    leg = [
        sec((-0.01, 0.40, 3.98), 0.30, 0.33, 0.35),
        sec((-0.01, 0.58, 3.92), 0.46, 0.54, 0.58),
        sec(Hj + V(0.0, 0.03, 0.0), 0.54, 0.74, 0.84),
        sec((0.06, 0.66, 2.95), 0.50, 0.62, 0.70),
        sec((0.10, 0.66, 2.20), 0.42, 0.46, 0.50),
        sec(K, 0.35, 0.36, 0.37),
        sec((0.08, 0.63, 1.20), 0.33, 0.31, 0.39),
        sec((0.03, 0.62, 0.78), 0.29, 0.28, 0.31),
        sec(A, 0.31, 0.30, 0.33),
        sec((-0.02, 0.62, 0.22), 0.36, 0.37, 0.36),
    ]
    left.append(smooth_chain(b, leg, [S['thigh.L'], S['shin.L'], S['meta.L']], [K, A], blend=0.25, k=0.55,
                             side=(0, 1, 0), samples=16, name='leg'))
    # elephantine foot: broad sole with a heel pad behind the ankle
    left.append(b.add(Ellipsoid((0.16, 0.63, 0.18), (0.44, 0.37, 0.18), k=0.14, bind=S['meta.L'], name='foot',
                                region='foot.L')))
    left.append(b.add(Ellipsoid((-0.08, 0.62, 0.17), (0.32, 0.34, 0.17), k=0.12, bind=S['meta.L'], name='heel',
                                region='foot.L')))
    # keratinous sole: an interior shape that only colours the ground-contact surface
    left.append(b.add(Ellipsoid((0.10, 0.63, 0.0), (0.42, 0.30, 0.03), k=0.005, tag='keratin', bind=S['meta.L'],
                                name='sole', region='foot.L', detail=0.3)))
    # toes: I-III carry sickle claws pointing forwards and outwards; IV-V are clawless nubs
    hind_toes = [  # base, tip, radius, claw length, claw radius
        (V(0.40, 0.42, 0.13), V(0.60, 0.40, 0.10), 0.09, 0.26, 0.07),
        (V(0.45, 0.55, 0.13), V(0.65, 0.56, 0.09), 0.085, 0.22, 0.062),
        (V(0.43, 0.69, 0.12), V(0.61, 0.73, 0.08), 0.08, 0.18, 0.055),
        (V(0.36, 0.80, 0.10), V(0.48, 0.85, 0.07), 0.075, 0.0, 0.0),
        (V(0.22, 0.88, 0.09), V(0.30, 0.92, 0.07), 0.065, 0.0, 0.0),
    ]
    claws = []
    for base, tip, r, cl, cr in hind_toes:
        left.append(b.add(RoundCone(base, tip, r, r * 0.85, k=0.05, bind=S['toe.L'], name='toe', region='foot.L',
                                    detail=0.8)))
        if cl:
            d = normalize(V(0.85, 0.45, 0.0))
            claws.append(claw(tip + d * 0.02 + V(0, 0, 0.02), d, cl, cr, V(0, 0, -1), side=(-d[1], d[0], 0), bind=S['toe.L']))

    # ------------------------------------------------------------------ forelimb (left; mirrored)
    arm = [
        sec((4.06, 0.55, 4.45), 0.40, 0.50, 0.50),
        sec(Sh, 0.48, 0.56, 0.56),
        sec((3.97, 0.85, 3.30), 0.44, 0.47, 0.52),
        sec((3.93, 0.88, 2.55), 0.36, 0.37, 0.41),
        sec(El, 0.33, 0.32, 0.39),
        sec((3.96, 0.89, 1.75), 0.32, 0.34, 0.32),
        sec((3.99, 0.885, 1.30), 0.285, 0.295, 0.28),
        sec(Wr, 0.27, 0.28, 0.265),
        sec((4.03, 0.875, 0.55), 0.27, 0.285, 0.26),
        sec((4.04, 0.87, 0.24), 0.30, 0.315, 0.28),
    ]
    left.append(smooth_chain(b, arm, [S['upperarm.L'], S['forearm.L'], S['hand.L']], [El, Wr], blend=0.25, k=0.45,
                             side=(0, 1, 0), samples=16, name='arm'))
    # manus: a vertical tube of metacarpals on a crescent (horseshoe) pad
    left.append(b.add(Ellipsoid((4.07, 0.87, 0.12), (0.32, 0.34, 0.12), k=0.1, bind=S['hand.L'], name='manus',
                                region='manus.L')))
    left.append(b.add(Ellipsoid((4.07, 0.87, 0.0), (0.27, 0.28, 0.03), k=0.005, tag='keratin', bind=S['hand.L'],
                                name='msole', region='manus.L', detail=0.3)))
    # thumb (digit I) claw on the inner front of the manus
    td = normalize(V(0.6, -0.72, -0.2))
    claws.append(claw(V(4.29, 0.64, 0.15), td, 0.19, 0.055, V(0, 0, -1), side=(-td[1], td[0], 0), bind=S['hand.L']))
    b.mirror_y(left)

    # ------------------------------------------------------------------ cuts, then uncut small parts
    for m in (1, -1):
        # the open back of the manus' U
        b.add(Ellipsoid((3.77, 0.87 * m, 0.16), (0.09, 0.12, 0.22), k=0.06, op='sub', name='manus_u'))
    # flat soles: everything below the ground is shaved off
    b.add(Box((0, 0, -0.5), (12.0, 4.0, 0.5), k=0.03, op='sub', name='ground'))
    for c in claws:
        b.add(c)
    b.mirror_y(claws)

    # ------------------------------------------------------------------ metadata
    b.meta = dict(
        name='Brachiosaurus altithorax', common='Brachiosaurus', length=22.0, mass_t=30.0,
        voxel=0.03, jaw_open=JAW_OPEN, tail_split=-1.6, faces=70000, tex=4096,
        palette=dict(back='#56553f', flank='#76735c', belly='#a99f86', pattern='#3d3c2e', accent='#9A6B4F',
                     keratin='#3B3631', claw='#3B3631', mouth='#7E5248', eye='#4A3A28'),
        # low-contrast vertical banding over the back and upper flanks (the palette's pattern colour is
        # close to the back colour, so a high strength still reads as subtle), plus a mild dapple
        pattern=dict(kind='bands', count=26, start=-8.0, end=10.4, strength=0.8, mottle=0.3, low=-0.45,
                     high=0.3),
        scales=dict(base=0.05, feature=0.12, border=0.4, folds=0.55),
        feature_on_body=0.5, feature_on_limbs=1.0,
        # display skin: a flush on the throat and the cheeks below the eyes
        accent=[(hp(0.02, -0.16).tolist(), (0.45, 0.24, 0.22), 0.35),
                (hp(0.30, 0.04, 0.13).tolist(), (0.16, 0.08, 0.12), 0.3),
                (hp(0.30, 0.04, -0.13).tolist(), (0.16, 0.08, 0.12), 0.3)],
        gait=dict(kind='quad', stride=4.0, duty=0.65, speed=1.1, offsets=(0.0, 0.25, 0.5, 0.75), gauge=1.0,
                  elbow_out=0.1, plantigrade_hind=True, bob=0.03, sway=0.03, extra=['browse'],
                  neck_browse=-0.25, neck_graze=0.9, head_graze=0.35),
        rest_stand=True,
    )
    return b
