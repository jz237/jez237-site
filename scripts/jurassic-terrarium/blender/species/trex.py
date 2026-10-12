"""Tyrannosaurus rex — adult, after the FMNH PR 2081 ("Sue") proportions.

Total length 12.3 m, skull 1.40 m, femur 1.32 m, tibia 1.14 m, metatarsus 0.67 m, humerus 0.39 m.
Horizontal back, S-curved neck, tail held level. Lipped jaws (Cullen et al. 2023): the teeth are
covered when the mouth is shut. Fine pebbly scales (Bell et al. 2017); no feathers on the adult.
"""
import math
import numpy as np
from anatomy import Body, sec, claw, V
from sdf import Loft, SmoothLoft, Ellipsoid, RoundCone, Xform, rot_euler, normalize, Group, chain_binding

JAW_OPEN = math.radians(4.0)  # rest pose opens the jaw a little so the lips separate cleanly


def smooth_chain(b, sections, bones, joint_points, blend=0.05, side=(0, 1, 0), k=0.1, tag='skin', samples=10,
                 detail=1.0, name='', region=None):
    """Body.loft_chain with an sdf.SmoothLoft: same binding, no ribs or creases at bends and joints."""
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
    b = Body('trex')
    S = b.skel
    # ------------------------------------------------------------------ skeleton
    root = b.bone('root', V(0, 0, 0), V(0, 0, 0.6))
    b.bone('pelvis', V(0, 0, 3.08), V(0.6, 0, 3.07), 'root')
    b.bone('spine1', V(0.6, 0, 3.07), V(1.25, 0, 3.04), 'pelvis')
    b.bone('spine2', V(1.25, 0, 3.04), V(1.9, 0, 3.02), 'spine1')
    b.bone('spine3', V(1.9, 0, 3.02), V(2.5, 0, 3.02), 'spine2')
    b.bone('neck1', V(2.5, 0, 3.02), V(2.92, 0, 3.12), 'spine3')
    b.bone('neck2', V(2.92, 0, 3.12), V(3.35, 0, 3.38), 'neck1')
    b.bone('neck3', V(3.35, 0, 3.38), V(3.82, 0, 3.74), 'neck2')
    b.bone('head', V(3.82, 0, 3.74), V(5.2, 0, 3.66), 'neck2')
    jaw_pivot = V(3.98, 0, 3.52)
    Rj = rot_euler(ry=JAW_OPEN)
    chin = (V(5.22, 0, 3.40) - jaw_pivot) @ Rj.T + jaw_pivot
    b.bone('jaw', jaw_pivot, chin, 'head')
    tail_pts = [V(0, 0, 3.08), V(-1.0, 0, 3.04), V(-2.0, 0, 2.96), V(-3.0, 0, 2.86), V(-4.0, 0, 2.74),
                V(-5.0, 0, 2.62), V(-6.0, 0, 2.47), V(-7.0, 0, 2.30)]
    tails = b.chain('tail', tail_pts, 'pelvis')

    H, K, A, Bl = V(0.0, 0.44, 2.98), V(0.36, 0.50, 1.72), V(-0.10, 0.48, 0.68), V(0.13, 0.46, 0.07)
    T3 = V(0.72, 0.46, 0.03)
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'thigh.{s}', f(H), f(K), 'pelvis', z=(1, 0, 0))
        b.bone(f'shin.{s}', f(K), f(A), f'thigh.{s}', z=(1, 0, 0))
        b.bone(f'meta.{s}', f(A), f(Bl), f'shin.{s}', z=(1, 0, 0))
        b.bone(f'toe.{s}', f(Bl), f(T3), f'meta.{s}', z=(0, 0, 1))
    Sh, El, Wr, Fi = V(2.45, 0.42, 2.40), V(2.30, 0.56, 2.05), V(2.52, 0.58, 1.95), V(2.66, 0.56, 1.82)
    for s in ('L', 'R'):
        m = 1 if s == 'L' else -1
        f = lambda v: V(v[0], v[1] * m, v[2])
        b.bone(f'upperarm.{s}', f(Sh), f(El), 'spine3', z=(1, 0, 0))
        b.bone(f'forearm.{s}', f(El), f(Wr), f'upperarm.{s}', z=(0, 0, 1))
        b.bone(f'hand.{s}', f(Wr), f(Fi), f'forearm.{s}', z=(0, 0, 1))

    # ------------------------------------------------------------------ axial body (tail tip -> neck)
    ax = [
        sec((-7.00, 0, 2.30), 0.018, 0.02, 0.02),
        sec((-6.30, 0, 2.43), 0.05, 0.055, 0.06),
        sec((-5.30, 0, 2.60), 0.095, 0.10, 0.12),
        sec((-4.20, 0, 2.74), 0.16, 0.17, 0.21, 1.9, 1.9),
        sec((-3.20, 0, 2.86), 0.23, 0.25, 0.31, 1.9, 1.9),
        sec((-2.20, 0, 2.96), 0.32, 0.35, 0.45, 1.95, 1.9),
        sec((-1.30, 0, 3.03), 0.43, 0.47, 0.60, 2.0, 1.95),
        sec((-0.50, 0, 3.08), 0.55, 0.62, 0.78, 2.0, 2.0),
        sec((0.20, 0, 3.10), 0.62, 0.72, 0.98, 2.1, 2.0),
        sec((0.90, 0, 3.06), 0.66, 0.73, 1.14, 2.1, 2.1),
        sec((1.60, 0, 3.01), 0.66, 0.70, 1.19, 2.1, 2.1),
        sec((2.20, 0, 2.99), 0.60, 0.66, 1.08, 2.1, 2.0),
        sec((2.70, 0, 3.06), 0.50, 0.57, 0.88, 2.0, 2.0),
        sec((3.15, 0, 3.27), 0.41, 0.47, 0.68, 2.0, 2.0),
        sec((3.55, 0, 3.52), 0.35, 0.40, 0.50, 2.0, 2.0),
        sec((3.92, 0, 3.76), 0.31, 0.34, 0.38, 2.0, 2.0),
    ]
    axial_bones = [S[f'tail{i}'] for i in range(7, 0, -1)] + [S['pelvis'], S['spine1'], S['spine2'], S['spine3'],
                                                              S['neck1'], S['neck2'], S['neck3'], S['head']]
    joints = [tail_pts[i] for i in range(6, 0, -1)] + [V(0.0, 0, 3.08)]  # ... tail1|pelvis (at the hip)
    joints += [V(0.6, 0, 3.07), V(1.25, 0, 3.04), V(1.9, 0, 3.02), V(2.5, 0, 3.02), V(2.92, 0, 3.12),
               V(3.35, 0, 3.38), V(3.82, 0, 3.74)]
    smooth_chain(b, ax, axial_bones, joints, blend=0.32, k=0.0, samples=12, name='axial')
    # muscle masses that give the silhouette its anatomy
    # neck: the deep, muscular base and the throat beneath it
    b.add(Ellipsoid((3.05, 0, 2.95), (0.55, 0.38, 0.42), R=rot_euler(ry=-0.45), k=0.22, bind=S['neck1'], name='neckbase'))
    b.add(Ellipsoid((3.45, 0, 3.25), (0.40, 0.27, 0.30), R=rot_euler(ry=-0.6), k=0.18, bind=S['neck3'], name='throat'))
    # shoulder girdle: the coracoids bulge in front of and above the arms
    for m in (1, -1):
        b.add(Ellipsoid((2.42, 0.36 * m, 2.62), (0.34, 0.16, 0.28), R=rot_euler(ry=0.35), k=0.18, bind=S['spine3'],
                        name='coracoid'))
        # thigh muscle (iliotibialis): a broad oval mass on the flank, standing proud of the body wall
        b.add(Ellipsoid((0.12, 0.52 * m, 2.62), (0.62, 0.20, 0.55), R=rot_euler(ry=-0.15), k=0.2,
                        bind=[(S['thigh.L' if m > 0 else 'thigh.R'], 0.7), (S['pelvis'], 0.3)], name='iliotib'))
        # caudofemoralis: the great tail-base muscle that pulls the thigh back
        b.add(Ellipsoid((-0.85, 0.30 * m, 2.82), (0.85, 0.24, 0.36), R=rot_euler(ry=0.06), k=0.25,
                        bind=[(S['tail1'], 0.7), (S['pelvis'], 0.3)], name='caudofem'))
    # pubic boot: the deep keel at the bottom of the hips
    b.add(Ellipsoid((0.45, 0, 1.98), (0.42, 0.24, 0.16), k=0.25, bind=S['pelvis'], name='pubic'))
    # chest / pectoral mass
    b.add(Ellipsoid((2.15, 0, 2.38), (0.45, 0.42, 0.45), k=0.25, bind=S['spine3'], name='chest'))

    # ------------------------------------------------------------------ head
    head_secs = [
        sec((3.78, 0, 3.86), 0.36, 0.30, 0.30),
        sec((4.00, 0, 3.90), 0.44, 0.35, 0.36, 2.4, 3.0),
        sec((4.26, 0, 3.87), 0.37, 0.33, 0.36, 2.6, 3.2),
        sec((4.56, 0, 3.80), 0.27, 0.31, 0.33, 3.0, 3.3),
        sec((4.88, 0, 3.75), 0.215, 0.29, 0.31, 3.2, 3.3),
        sec((5.12, 0, 3.70), 0.185, 0.27, 0.28, 3.2, 3.2),
        sec((5.27, 0, 3.66), 0.15, 0.22, 0.23, 2.9, 2.9),
        sec((5.35, 0, 3.64), 0.09, 0.13, 0.15, 2.4, 2.4),
    ]
    head = S['head']
    b.add(Loft(head_secs, samples_per_seg=10, k=0.12, bind=head, name='cranium'))
    # jaw-closing muscles bulging over the back of the skull, and the neck's attachment
    for m in (1, -1):
        b.add(Ellipsoid((4.02, 0.22 * m, 4.08), (0.22, 0.16, 0.13), R=rot_euler(rz=0.25 * m), k=0.1, bind=head,
                        name='adductor'))
        # postorbital boss (brow horn) and lacrimal ridge
        b.add(Ellipsoid((4.14, 0.29 * m, 4.11), (0.12, 0.075, 0.08), k=0.05, bind=head, detail=1.6, name='postorb'))
        b.add(Ellipsoid((4.40, 0.21 * m, 4.07), (0.10, 0.045, 0.05), R=rot_euler(rz=-0.3 * m), k=0.05, bind=head,
                        detail=1.6, name='lacrimal'))
        # cheek / jugal flare
        b.add(Ellipsoid((4.12, 0.36 * m, 3.66), (0.24, 0.10, 0.12), k=0.1, bind=head, name='jugal'))
    # rugose nasal bumps along the top of the snout
    for i, x in enumerate(np.linspace(4.55, 5.12, 6)):
        z = np.interp(x, [4.56, 4.88, 5.12], [4.10, 4.03, 3.96])
        b.add(Ellipsoid((x, 0.0, z), (0.05, 0.07, 0.03), k=0.04, bind=head, detail=1.8, name='nasal'))

    # lower jaw, sculpted closed and then opened by JAW_OPEN about the jaw joint
    jaw = S['jaw']
    jaw_secs = [
        sec((3.88, 0, 3.47), 0.40, 0.09, 0.40, 2.2, 2.4),
        sec((4.22, 0, 3.44), 0.33, 0.08, 0.37, 2.4, 2.4),
        sec((4.60, 0, 3.41), 0.24, 0.07, 0.31, 2.6, 2.3),
        sec((4.95, 0, 3.40), 0.18, 0.06, 0.27, 2.6, 2.3),
        sec((5.10, 0, 3.40), 0.145, 0.05, 0.24, 2.5, 2.2),
        sec((5.22, 0, 3.41), 0.10, 0.04, 0.15, 2.2, 2.2),
    ]
    jaw_prims = [Loft(jaw_secs, samples_per_seg=10, k=0.06, bind=jaw, name='mandible')]
    # tongue trough and tongue (pink)
    jaw_prims.append(Ellipsoid((4.62, 0, 3.53), (0.62, 0.15, 0.08), k=0.03, op='sub', tag='mouth', name='trough'))
    jaw_prims.append(Ellipsoid((4.45, 0, 3.47), (0.48, 0.12, 0.05), k=0.04, tag='mouth', bind=jaw, name='tongue'))
    # the mouth slit: a thin sheet along the lip line from the corner of the mouth to the front
    slit = Loft([sec((4.05, 0, 3.535), 0.6, 0.009, 0.009, 4, 4), sec((4.6, 0, 3.475), 0.6, 0.009, 0.009, 4, 4),
                 sec((5.5, 0, 3.43), 0.6, 0.009, 0.009, 4, 4)], k=0.01, op='sub', tag='mouth', name='slit')
    b.add(slit)
    for p in jaw_prims:
        b.add(Xform(p, R=Rj, pivot=jaw_pivot))
    # palate vault (pink roof of the mouth)
    b.add(Ellipsoid((4.62, 0, 3.47), (0.66, 0.15, 0.07), k=0.03, op='sub', tag='mouth', name='palate'))

    # nostrils, ear openings
    for m in (1, -1):
        b.add(Ellipsoid((5.16, 0.10 * m, 3.78), (0.06, 0.025, 0.028), R=rot_euler(rz=0.25 * m), k=0.012, op='sub',
                        name='nostril'))
        b.add(Ellipsoid((3.83, 0.36 * m, 3.77), (0.035, 0.03, 0.05), k=0.015, op='sub', name='ear'))

    # eyes: socket + lids are field shapes; the eyeball itself is a separate mesh
    eye_r = 0.058
    for m, s in ((1, 'L'), (-1, 'R')):
        c = V(4.29, 0.285 * m, 3.98)
        look = normalize(V(0.55, 0.83 * m, 0.05))
        b.add(Ellipsoid(c + look * 0.005, (0.095, 0.085, 0.078), k=0.03, bind=head, name='lids'))
        # heavy brow: a ridge over the eye from the lacrimal to the postorbital boss
        b.add(Ellipsoid(c + V(-0.02, 0.025 * m, 0.085), (0.14, 0.06, 0.045), R=rot_euler(rz=0.35 * m, rx=-0.25 * m), k=0.04,
                        bind=head, detail=1.6, name='brow'))
        b.add(Ellipsoid(c, (eye_r + 0.004,) * 3, k=0.004, op='sub', name='socket'))
        # almond-shaped opening between the lids, facing 'look'
        R = np.stack([look, normalize(np.cross(V(0, 0, 1), look)), normalize(np.cross(look, np.cross(V(0, 0, 1), look)))], axis=1)
        b.add(Ellipsoid(c + look * 0.075, (0.055, 0.062, 0.03), R=R, k=0.012, op='sub', name='aperture'))
        b.attachments.append(dict(kind='eye', center=c.tolist(), radius=eye_r, look=look.tolist(), bone='head',
                                  iris=[0.72, 0.52, 0.18], pupil='round'))

    # teeth: separate meshes inside the lips (visible when the jaw opens)
    teeth = []
    for m in (1, -1):
        for i, x in enumerate(np.linspace(4.40, 5.18, 10)):
            u = (x - 4.40) / 0.78
            half_w = np.interp(x, [4.0, 4.6, 4.95, 5.18], [0.40, 0.22, 0.17, 0.12]) - 0.035
            base = V(x, half_w * m, 3.55 - 0.03 * u)
            L = 0.035 + 0.028 * math.sin(math.pi * min(1, u * 1.25))
            teeth.append(dict(base=base.tolist(), dir=[0.12, -0.05 * m, -1], length=L, radius=0.022, bone='head'))
        for i, x in enumerate(np.linspace(4.42, 5.04, 9)):
            u = (x - 4.42) / 0.7
            half_w = np.interp(x, [3.9, 4.6, 4.95, 5.18], [0.38, 0.20, 0.155, 0.12]) - 0.05
            base = (V(x, half_w * m, 3.47) - jaw_pivot) @ Rj.T + jaw_pivot
            d = V(0.1, 0.05 * m, 1) @ Rj.T
            teeth.append(dict(base=base.tolist(), dir=d.tolist(), length=0.035 + 0.02 * u, radius=0.017, bone='jaw'))
    b.attachments.append(dict(kind='teeth', items=teeth))

    # ------------------------------------------------------------------ hind limbs (left; mirrored)
    left = []
    leg = [
        sec(H + V(0.02, -0.02, 0.05), 0.24, 0.40, 0.44),
        sec((0.20, 0.50, 2.40), 0.28, 0.44, 0.48),
        sec((0.32, 0.52, 1.98), 0.20, 0.26, 0.26),
        sec(K, 0.16, 0.18, 0.19),
        sec((0.26, 0.51, 1.46), 0.205, 0.18, 0.30),
        sec((0.10, 0.50, 1.14), 0.16, 0.14, 0.21),
        sec((-0.02, 0.49, 0.85), 0.115, 0.10, 0.115),
        sec(A, 0.10, 0.09, 0.095),
        sec((0.01, 0.47, 0.37), 0.085, 0.08, 0.072),
        sec(Bl + V(0, 0, 0.02), 0.11, 0.085, 0.08),
    ]
    left.append(smooth_chain(b, leg, [S['thigh.L'], S['shin.L'], S['meta.L']], [K, A], blend=0.12, k=0.28,
                             side=(0, 1, 0), samples=10, name='leg'))
    # gastrocnemius / calf
    left.append(b.add(Ellipsoid((0.19, 0.50, 1.40), (0.15, 0.13, 0.30), R=rot_euler(ry=-0.42), k=0.1,
                                bind=S['shin.L'], name='calf')))
    # ball-of-foot pad
    left.append(b.add(Ellipsoid((0.16, 0.46, 0.075), (0.16, 0.13, 0.065), k=0.06, bind=S['meta.L'], name='pad',
                                region='foot.L')))
    # toes II, III, IV: knuckled lofts, then claws
    toes = [  # base, tip, half width, side offset of the base
        (V(0.14, 0.40, 0.07), V(0.55, 0.30, 0.035), 0.058),
        (V(0.17, 0.46, 0.075), V(0.70, 0.465, 0.035), 0.066),
        (V(0.14, 0.52, 0.07), V(0.50, 0.61, 0.035), 0.058),
    ]
    for base, tip, w in toes:
        d = tip - base
        pts = [base + d * t for t in (0.0, 0.3, 0.55, 0.78, 1.0)]
        ws = [w, w * 0.92, w * 0.85, w * 0.75, w * 0.6]
        knuckle = [1.0, 1.12, 0.95, 1.08, 0.9]
        secs = [sec(p + V(0, 0, 0.012 * kk), ww * kk, ww * 0.85 * kk, ww * 0.9) for p, ww, kk in zip(pts, ws, knuckle)]
        left.append(smooth_chain(b, secs, [S['meta.L'], S['toe.L']], [base + d * 0.12], blend=0.06, k=0.04,
                                 side=(-d[1], d[0], 0), samples=8, name='toe', detail=0.8, region='foot.L'))
        left.append(b.add(claw(tip + normalize(d) * 0.01 + V(0, 0, 0.012), d, 0.14, 0.04, V(0, 0, -1),
                               side=(-d[1], d[0], 0), bind=S['toe.L'])))
    # hallux (dew claw) high on the inner side of the metatarsus
    hb = V(-0.03, 0.41, 0.30)
    ht = V(-0.10, 0.37, 0.19)
    left.append(b.add(RoundCone(hb, ht, 0.04, 0.03, k=0.04, bind=S['meta.L'], name='hallux')))
    left.append(b.add(claw(ht, ht - hb, 0.07, 0.025, V(0, 0, -1), side=(0, 1, 0), bind=S['meta.L'])))

    # ------------------------------------------------------------------ arms (tiny, two-fingered)
    arm = [
        sec(Sh + V(0.02, -0.10, 0.08), 0.15, 0.16, 0.16),
        sec(Sh, 0.13, 0.14, 0.14),
        sec((Sh + El) / 2, 0.11, 0.12, 0.105),
        sec(El, 0.08, 0.085, 0.075),
        sec((El + Wr) / 2, 0.07, 0.065, 0.062),
        sec(Wr, 0.055, 0.05, 0.048),
    ]
    left.append(smooth_chain(b, arm, [S['upperarm.L'], S['forearm.L'], S['hand.L']], [El, Wr], blend=0.05, k=0.07,
                             side=(0, 1, 0), samples=8, name='arm'))
    for dy, L in ((0.022, 0.17), (-0.024, 0.15)):
        f0 = Wr + V(0.01, dy, -0.01)
        f1 = f0 + V(0.09, -0.005, -0.06) * (L / 0.11)
        left.append(b.add(RoundCone(f0, f1, 0.028, 0.02, k=0.02, bind=S['hand.L'], name='finger')))
        left.append(b.add(claw(f1, f1 - f0, 0.07, 0.022, V(0, 0, -1), side=(0, 1, 0), bind=S['hand.L'])))
    b.mirror_y(left)

    # ------------------------------------------------------------------ metadata
    b.meta = dict(
        name='Tyrannosaurus rex', common='Tyrannosaurus', length=12.3, mass_t=8.4,
        voxel=0.016, jaw_open=JAW_OPEN, jaw_seal=0.035, tail_split=-2.4, faces=64000, tex=2048,
        palette=dict(back='#3b2c1c', flank='#74552f', belly='#c9b28a', pattern='#211810', accent='#8a4a30',
                     keratin='#2d2823', claw='#221e1a', mouth='#8f4545', eye='#c99a3b'),
        pattern=dict(kind='bands', count=17, start=-6.8, end=3.4, strength=0.85, mottle=0.4, low=-0.35, high=0.35),
        scales=dict(base=0.028, feature=0.07, border=0.18, folds=0.75, tubercle=0.09, tubercle_density=0.22,
                    tubercle_from=0.35),
        accent=[((4.05, 0.3, 3.62), (0.32, 0.12, 0.2), 0.45), ((4.05, -0.3, 3.62), (0.32, 0.12, 0.2), 0.45)],
        gait=dict(kind='biped', stride=3.6, duty=0.62, speed=1.4, bob=0.06, sway=0.05),
    )
    return b
