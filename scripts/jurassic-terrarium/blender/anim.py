"""Procedural animation: a small FK/IK pose solver and gait/behaviour clips, keyed into Blender actions.

All matrices are in Blender armature space (the armature object sits at the origin). The animal faces
-Y, its left is +X, up is +Z. Clips are in place: the runtime moves the animal over the ground at
the clip's speed (meta['gait'] stride / period), so planted feet do not slide.
"""
import math
import numpy as np
import bpy
from mathutils import Matrix, Quaternion

FWD = np.array([0.0, -1.0, 0.0])
LEFT = np.array([1.0, 0.0, 0.0])
UP = np.array([0.0, 0.0, 1.0])


def rot(axis, ang):
    a = np.asarray(axis, float)
    a = a / max(np.linalg.norm(a), 1e-12)
    x, y, z = a
    c, s = math.cos(ang), math.sin(ang)
    C = 1 - c
    return np.array([[c + x * x * C, x * y * C - z * s, x * z * C + y * s],
                     [y * x * C + z * s, c + y * y * C, y * z * C - x * s],
                     [z * x * C - y * s, z * y * C + x * s, c + z * z * C]])


def rot_between(a, b):
    a = a / np.linalg.norm(a)
    b = b / np.linalg.norm(b)
    v = np.cross(a, b)
    s = np.linalg.norm(v)
    c = float(np.dot(a, b))
    if s < 1e-9:
        if c > 0:
            return np.eye(3)
        perp = np.cross(a, [1, 0, 0]) if abs(a[0]) < 0.9 else np.cross(a, [0, 1, 0])
        return rot(perp, math.pi)
    return rot(v, math.atan2(s, c))


def smoothstep(x):
    x = min(1.0, max(0.0, x))
    return x * x * (3 - 2 * x)


class Rig:
    def __init__(self, arm_ob):
        self.ob = arm_ob
        bones = arm_ob.data.bones
        self.names = [b.name for b in bones]
        self.idx = {n: i for i, n in enumerate(self.names)}
        self.parent = [self.idx[b.parent.name] if b.parent else -1 for b in bones]
        self.A = [np.array(b.matrix_local) for b in bones]
        self.rel = []
        for i, p in enumerate(self.parent):
            self.rel.append(self.A[i] if p < 0 else np.linalg.inv(self.A[p]) @ self.A[i])
        self.length = [b.length for b in bones]
        # evaluation order: parents first (Blender lists bones in hierarchy order already)
        self.order = list(range(len(self.names)))

    def has(self, n):
        return n in self.idx

    def head(self, n):
        return self.A[self.idx[n]][:3, 3].copy()

    def tail(self, n):
        i = self.idx[n]
        return (self.A[i] @ np.array([0, self.length[i], 0, 1.0]))[:3]

    def solve(self, local=None, world=None, aims=None, hooks=None):
        """local: name -> 3x3 rotation about rest-world axes (applied in the parent's frame)
        world: name -> 4x4 full world matrix override (for the body)
        aims:  name -> world direction for the bone's Y axis (minimal rotation from its FK pose)
        hooks: name -> fn(rig, M_parent, M_list) -> dict of extra aims (computed when reached)
        Returns (world matrices, basis matrices)."""
        local = local or {}
        world = world or {}
        aims = dict(aims or {})
        hooks = hooks or {}
        n = len(self.names)
        M = [None] * n
        B = [None] * n
        for i in self.order:
            nm = self.names[i]
            p = self.parent[i]
            Mp = np.eye(4) if p < 0 else M[p]
            if nm in hooks:
                aims.update(hooks[nm](self, Mp, M) or {})
            base = Mp @ self.rel[i]
            Rr = self.A[i][:3, :3]
            if nm in world:
                Mi = world[nm].copy()
            else:
                Mi = base.copy()
                if nm in local:
                    # rotate about rest-world axes, expressed in the bone's rest frame
                    Lr = Rr.T @ local[nm] @ Rr
                    Mi[:3, :3] = base[:3, :3] @ Lr
                if nm in aims:
                    y = Mi[:3, 1]
                    Mi[:3, :3] = rot_between(y, np.asarray(aims[nm], float)) @ Mi[:3, :3]
            M[i] = Mi
            B[i] = np.linalg.inv(base) @ Mi
        return M, B


def leg_ik(rig, side, target_ball, toe_dir, knee_fwd, chain=('thigh', 'shin', 'meta', 'toe'), plantigrade=False):
    """Hook for a digitigrade leg: the metatarsus is kept parallel to the femur (a pantograph), which
    turns the 3-bone leg into a 2-bone problem with lengths (femur + metatarsus) and tibia."""
    th, sh, me, to = [f'{c}.{side}' for c in chain]
    Lf, Lt, Lm = rig.length[rig.idx[th]], rig.length[rig.idx[sh]], rig.length[rig.idx[me]]

    def hook(rig_, Mp, M):
        H = (Mp @ rig.rel[rig.idx[th]])[:3, 3]
        D = np.asarray(target_ball) - H
        d = np.linalg.norm(D)
        if plantigrade:
            a1, a2 = Lf, Lt
        else:
            a1, a2 = Lf + Lm, Lt
        d = min(max(d, abs(a1 - a2) + 1e-3), a1 + a2 - 1e-3)
        Dh = D / max(np.linalg.norm(D), 1e-9)
        cosA = (a1 * a1 + d * d - a2 * a2) / (2 * a1 * d)
        A = math.acos(max(-1, min(1, cosA)))
        k = np.asarray(knee_fwd, float)
        k = k - np.dot(k, Dh) * Dh
        k /= max(np.linalg.norm(k), 1e-9)
        f = math.cos(A) * Dh + math.sin(A) * k
        P1 = H + a1 * f
        t = (H + Dh * d - P1)
        t /= max(np.linalg.norm(t), 1e-9)
        aims = {th: f, sh: t, me: f}
        if plantigrade:
            aims = {th: f, sh: t}
        if toe_dir is not None and rig.has(to):
            aims[to] = toe_dir
        return aims

    return th, hook


def arm_ik(rig, side, target, elbow_back, chain=('upperarm', 'forearm', 'hand'), hand_dir=None):
    """Two-bone IK for a supporting forelimb: humerus + forearm reach the wrist; the hand aims down."""
    ua, fa, ha = [f'{c}.{side}' for c in chain]
    L1, L2 = rig.length[rig.idx[ua]], rig.length[rig.idx[fa]]

    def hook(rig_, Mp, M):
        S = (Mp @ rig.rel[rig.idx[ua]])[:3, 3]
        D = np.asarray(target) - S
        d = min(max(np.linalg.norm(D), abs(L1 - L2) + 1e-3), L1 + L2 - 1e-3)
        Dh = D / max(np.linalg.norm(D), 1e-9)
        cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)
        A = math.acos(max(-1, min(1, cosA)))
        k = np.asarray(elbow_back, float)
        k = k - np.dot(k, Dh) * Dh
        k /= max(np.linalg.norm(k), 1e-9)
        f = math.cos(A) * Dh + math.sin(A) * k
        E = S + L1 * f
        t = S + Dh * d - E
        t /= max(np.linalg.norm(t), 1e-9)
        aims = {ua: f, fa: t}
        if hand_dir is not None:
            aims[ha] = hand_dir
        return aims

    return ua, hook


# --------------------------------------------------------------------------- keying
def key_clip(rig, name, frames, fps=30, loop=True):
    """frames: list of basis-matrix lists (one per bone). Creates an action with quaternion and
    location keys for every bone."""
    ob = rig.ob
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    ob.animation_data_create()
    ob.animation_data.action = act
    pbs = ob.pose.bones
    prevq = [None] * len(rig.names)
    for fi, Bs in enumerate(frames):
        for i, nm in enumerate(rig.names):
            m = Matrix(Bs[i].tolist())
            loc, q, _ = m.decompose()
            if prevq[i] is not None and q.dot(prevq[i]) < 0:
                q = -q
            prevq[i] = q
            pb = pbs[nm]
            pb.rotation_quaternion = q
            pb.location = loc
            pb.keyframe_insert('rotation_quaternion', frame=fi + 1)
            pb.keyframe_insert('location', frame=fi + 1)
    act['loop'] = loop
    act['fps'] = fps
    # keep it on an NLA track so the exporter picks it up
    tr = ob.animation_data.nla_tracks.new()
    tr.name = name
    tr.strips.new(name, 1, act)
    tr.mute = True
    ob.animation_data.action = None
    return act


# --------------------------------------------------------------------------- biped clips
class Biped:
    """Gait + behaviour clips for a bipedal dinosaur with the standard bone names."""

    def __init__(self, rig, meta):
        self.r = rig
        self.meta = meta
        g = meta['gait']
        self.g = g
        self.tails = [n for n in rig.names if n.startswith('tail')]
        self.spines = [n for n in rig.names if n.startswith('spine')]
        self.necks = [n for n in rig.names if n.startswith('neck')]
        self.jaw_rest = meta.get('jaw_open', 0.0) + meta.get('jaw_seal', 0.02)  # close a little past the sculpt
        self.pel_A = rig.A[rig.idx['pelvis']]
        self.hip_h = self.pel_A[2, 3]
        self.ball = {s: rig.tail(f'meta.{s}') for s in 'LR'}
        self.toe_rest = {s: rig.tail(f'toe.{s}') - rig.tail(f'meta.{s}') for s in 'LR'}

    # ----- helpers
    def pelvis(self, dz=0.0, dx=0.0, dy=0.0, yaw=0.0, roll=0.0, pitch=0.0):
        R = rot(UP, yaw) @ rot(FWD, roll) @ rot(LEFT, pitch)
        M = self.pel_A.copy()
        M[:3, :3] = R @ self.pel_A[:3, :3]
        M[:3, 3] = self.pel_A[:3, 3] + LEFT * dx + FWD * dy + UP * dz
        return M

    def body_locals(self, t, yaw_wave=0.0, pitch=0.0, neck_pitch=0.0, head_yaw=0.0, head_pitch=0.0, tail_yaw=0.0,
                    tail_phase=0.0, tail_pitch=0.0, jaw=0.0, breath=0.0):
        loc = {}
        for i, s in enumerate(self.spines):
            loc[s] = rot(UP, -yaw_wave * 0.35) @ rot(LEFT, pitch / max(1, len(self.spines)) + breath * 0.01)
        for i, s in enumerate(self.necks):
            loc[s] = rot(UP, head_yaw * 0.25 + yaw_wave * 0.2) @ rot(LEFT, neck_pitch / max(1, len(self.necks)))
        loc['head'] = rot(UP, head_yaw * 0.5) @ rot(LEFT, head_pitch)
        n = len(self.tails)
        for i, s in enumerate(self.tails):
            f = (i + 1) / n
            w = tail_yaw * (0.35 + 0.65 * f) * math.sin(tail_phase - i * 0.55)
            loc[s] = rot(UP, w / n * 2.2) @ rot(LEFT, -tail_pitch / n)
        if self.r.has('jaw'):
            loc['jaw'] = rot(LEFT, -self.jaw_rest + jaw)
        return loc

    def arms(self, loc, swing=0.0, fold=0.0):
        for s, sg in (('L', 1), ('R', -1)):
            if self.r.has(f'upperarm.{s}'):
                loc[f'upperarm.{s}'] = rot(LEFT, -swing * sg * 0.15 - fold)
                loc[f'forearm.{s}'] = rot(LEFT, -fold * 0.8)
                loc[f'hand.{s}'] = rot(LEFT, -fold * 0.5)

    def stand_hooks(self, M_pel, gauge=1.0, feet=None):
        hooks = {}
        fwd = M_pel[:3, :3] @ np.linalg.inv(self.pel_A[:3, :3]) @ FWD
        fwd[2] = 0
        fwd /= np.linalg.norm(fwd)
        for s in 'LR':
            b = self.ball[s].copy() if feet is None else feet[s][0]
            if feet is None:
                b[0] *= gauge
            toe = self.toe_rest[s] if feet is None else feet[s][1]
            nm, hk = leg_ik(self.r, s, b, toe, fwd)
            hooks[nm] = hk
        return hooks

    # ----- clips
    def walk(self, speed=None, stride=None, duty=None, fps=30, bob=None, lift=None, name='walk'):
        g = self.g
        v = speed or g['speed']
        S = stride or g['stride']
        beta = duty or g['duty']
        T = S / v
        N = max(8, int(round(T * fps)))
        bob = g.get('bob', 0.05) if bob is None else bob
        lift = lift if lift is not None else g.get('lift', 0.12 * self.hip_h / 3)
        gauge = g.get('gauge', 0.55)
        crouch = g.get('crouch', 0.04 * self.hip_h)
        frames = []
        for f in range(N):
            p = f / N
            feet = {}
            for s, off in (('L', 0.0), ('R', 0.5)):
                q = (p + off) % 1.0
                b = self.ball[s].copy()
                b[0] *= gauge
                if q < beta:
                    x = S * (beta / 2 - q)
                    z = 0.0
                    toe = self.toe_rest[s]
                else:
                    u = (q - beta) / (1 - beta)
                    e = smoothstep(u)
                    x = S * (-beta / 2 + beta * e)
                    z = lift * math.sin(math.pi * u) ** 0.8
                    # toes trail at lift-off, reach forward before touchdown
                    ang = -0.6 * math.sin(math.pi * min(1, u * 1.4))
                    toe = rot(LEFT, -ang) @ self.toe_rest[s]
                b = b + FWD * x + UP * z
                feet[s] = (b, toe)
            # body: highest at mid-stance, swaying over the stance foot
            ph = 2 * math.pi * p
            dz = -crouch + bob * math.cos(2 * (ph - math.pi * beta))
            dx = g.get('sway', 0.04) * math.sin(ph - math.pi * beta + math.pi / 2)
            yaw = 0.035 * math.sin(ph)
            roll = 0.03 * math.sin(ph + math.pi / 2)
            Mp = self.pelvis(dz=dz, dx=dx, yaw=yaw, roll=roll, pitch=g.get('pitch', 0.0))
            loc = self.body_locals(p, yaw_wave=yaw, neck_pitch=-0.6 * bob * math.cos(2 * ph) / max(self.hip_h, 1) * 3,
                                   head_yaw=-yaw * 0.8, head_pitch=0.0, tail_yaw=g.get('tail', 0.12),
                                   tail_phase=ph + 0.9, tail_pitch=0.02 * math.cos(2 * ph))
            self.arms(loc, swing=math.sin(ph), fold=0.1)
            hooks = self.stand_hooks(Mp, feet=feet)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=True, speed=v, stride=S, period=N / fps)

    def idle(self, seconds=8.0, fps=30, name='idle'):
        N = int(seconds * fps)
        frames = []
        for f in range(N):
            t = f / fps
            w = 2 * math.pi * t / seconds
            breath = math.sin(2 * math.pi * t / 4.0)
            look = 0.25 * math.sin(w) + 0.12 * math.sin(3 * w + 1)
            Mp = self.pelvis(dz=-0.03 * self.hip_h + 0.01 * breath, dx=0.03 * math.sin(w), yaw=0.03 * math.sin(w),
                             roll=0.01 * math.sin(w))
            loc = self.body_locals(t, head_yaw=look, head_pitch=0.08 * math.sin(2 * w + 0.5), neck_pitch=0.04 * breath,
                                   tail_yaw=0.06, tail_phase=w * 2, tail_pitch=0.02 * math.sin(w), breath=breath)
            self.arms(loc, swing=0.2 * math.sin(w), fold=0.12)
            hooks = self.stand_hooks(Mp, gauge=self.g.get('stand_gauge', 0.9))
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=True)

    def roar(self, seconds=3.4, fps=30, name='roar'):
        N = int(seconds * fps)
        frames = []
        for f in range(N):
            t = f / N
            up = smoothstep(t / 0.22) * (1 - smoothstep((t - 0.8) / 0.2))
            jaw = 0.62 * smoothstep((t - 0.12) / 0.15) * (1 - smoothstep((t - 0.75) / 0.18))
            shake = 0.04 * math.sin(t * 60) * jaw
            Mp = self.pelvis(dz=-0.05 * self.hip_h * up, pitch=-0.06 * up)
            loc = self.body_locals(t, neck_pitch=-0.35 * up, head_pitch=-0.15 * up + shake, head_yaw=shake,
                                   tail_yaw=0.05, tail_phase=t * 6, tail_pitch=0.25 * up, jaw=jaw)
            self.arms(loc, fold=0.1 + 0.3 * up)
            hooks = self.stand_hooks(Mp, gauge=0.9)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=False)

    def sniff(self, seconds=4.0, fps=30, name='sniff'):
        N = int(seconds * fps)
        frames = []
        for f in range(N):
            t = f / N
            down = smoothstep(t / 0.3) * (1 - smoothstep((t - 0.75) / 0.25))
            sn = 0.03 * math.sin(t * 40) * down
            Mp = self.pelvis(dz=-0.1 * self.hip_h * down, pitch=0.18 * down)
            loc = self.body_locals(t, neck_pitch=0.65 * down, head_pitch=0.25 * down + sn, head_yaw=0.15 * math.sin(t * 7) * down,
                                   tail_yaw=0.05, tail_phase=t * 5, tail_pitch=-0.12 * down)
            self.arms(loc, fold=0.15)
            hooks = self.stand_hooks(Mp, gauge=0.9)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=False)

    def rest(self, seconds=6.0, fps=30, name='rest'):
        """Lying down (looping breath): the pubic boot rests on the ground, legs folded beneath."""
        N = int(seconds * fps)
        frames = []
        drop = self.meta.get('rest_drop', 0.58) * self.hip_h
        for f in range(N):
            t = f / fps
            breath = math.sin(2 * math.pi * t / 5.0)
            Mp = self.pelvis(dz=-drop + 0.01 * breath, pitch=0.05)
            loc = self.body_locals(t, neck_pitch=0.35, head_pitch=0.25, tail_yaw=0.02, tail_phase=t,
                                   tail_pitch=-0.25, breath=breath)
            self.arms(loc, fold=0.3)
            feet = {}
            for s in 'LR':
                b = self.ball[s].copy()
                b = b + FWD * (0.35 * self.hip_h) + UP * 0.0
                feet[s] = (b, self.toe_rest[s])
            hooks = self.stand_hooks(Mp, feet=feet)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=True)

    def all(self):
        g = self.g
        clips = [self.idle(), self.walk(),
                 self.walk(speed=g.get('run_speed', g['speed'] * 2.4), stride=g.get('run_stride', g['stride'] * 1.5),
                           duty=g.get('run_duty', 0.45), bob=g.get('bob', 0.05) * 1.6,
                           lift=g.get('lift', 0.12 * self.hip_h / 3) * 1.6, name='run'),
                 self.roar(), self.sniff(), self.rest()]
        return clips


# --------------------------------------------------------------------------- quadruped clips
class Quadruped(Biped):
    """Lateral-sequence walk on four legs: left hind, left fore, right hind, right fore.

    gait meta: stride (m per full cycle), duty, speed, offsets (phase of LH, LF, RH, RF),
    gauge, lift, elbow_out (semi-erect forelimbs), neck_graze (rad down for grazing),
    plantigrade_hind (bool), run_* overrides, extra (list of extra clip names)."""

    def __init__(self, rig, meta):
        super().__init__(rig, meta)
        self.wrist = {s: rig.head(f'hand.{s}') for s in 'LR'}
        self.hand_vec = {s: rig.tail(f'hand.{s}') - rig.head(f'hand.{s}') for s in 'LR'}
        self.fcontact = {s: rig.tail(f'hand.{s}') for s in 'LR'}
        self.last_spine = self.spines[-1] if self.spines else 'pelvis'

    def legs(self, M_pel, feet_h, feet_f, elbow_out=None):
        g = self.g
        hooks = {}
        fwd = M_pel[:3, :3] @ np.linalg.inv(self.pel_A[:3, :3]) @ FWD
        fwd[2] = 0
        fwd /= np.linalg.norm(fwd)
        side = np.cross(UP, fwd)  # animal's left in the ground plane... (UP x FWD)
        for s, sg in (('L', 1), ('R', -1)):
            b, toe = feet_h[s]
            nm, hk = leg_ik(self.r, s, b, toe, fwd, plantigrade=g.get('plantigrade_hind', False))
            hooks[nm] = hk
            c, hand_dir = feet_f[s]
            wrist = c - hand_dir * np.linalg.norm(self.hand_vec[s])
            eo = g.get('elbow_out', 0.15) if elbow_out is None else elbow_out
            elbow = -fwd + side * sg * eo
            nm, hk = arm_ik(self.r, s, wrist, elbow, hand_dir=hand_dir)
            hooks[nm] = hk
        return hooks

    def _rest_feet(self, gauge=1.0):
        fh = {}
        ff = {}
        for s in 'LR':
            b = self.ball[s].copy()
            b[0] *= gauge
            fh[s] = (b, self.toe_rest[s])
            c = self.fcontact[s].copy()
            c[0] *= gauge
            ff[s] = (c, self.hand_vec[s] / np.linalg.norm(self.hand_vec[s]))
        return fh, ff

    def walk(self, speed=None, stride=None, duty=None, fps=30, bob=None, lift=None, name='walk'):
        g = self.g
        v = speed or g['speed']
        S = stride or g['stride']
        beta = duty or g['duty']
        T = S / v
        N = max(8, int(round(T * fps)))
        bob = g.get('bob', 0.03) if bob is None else bob
        lift = lift if lift is not None else g.get('lift', 0.07 * self.hip_h)
        gauge = g.get('gauge', 0.9)
        offs = g.get('offsets', (0.0, 0.22, 0.5, 0.72))  # LH, LF, RH, RF
        frames = []
        down = -UP
        for f in range(N):
            p = f / N
            fh, ff = {}, {}
            for (s, oh, of) in (('L', offs[0], offs[1]), ('R', offs[2], offs[3])):
                for kind, off in (('h', oh), ('f', of)):
                    q = (p + off) % 1.0
                    if kind == 'h':
                        base = self.ball[s].copy()
                    else:
                        base = self.fcontact[s].copy()
                    base[0] *= gauge
                    if q < beta:
                        x = S * (beta / 2 - q)
                        z = 0.0
                        u = None
                    else:
                        u = (q - beta) / (1 - beta)
                        x = S * (-beta / 2 + beta * smoothstep(u))
                        z = lift * math.sin(math.pi * u) ** 0.8
                    pos = base + FWD * x + UP * z
                    if kind == 'h':
                        toe = self.toe_rest[s]
                        if u is not None:
                            toe = rot(LEFT, 0.5 * math.sin(math.pi * min(1, u * 1.3))) @ toe
                        fh[s] = (pos, toe)
                    else:
                        hd = self.hand_vec[s] / np.linalg.norm(self.hand_vec[s])
                        if u is not None:  # wrist flexes back as the hand lifts
                            hd = rot(LEFT, -0.6 * math.sin(math.pi * u)) @ hd
                        ff[s] = (pos, hd)
            ph = 2 * math.pi * p
            dz = bob * math.cos(2 * ph) - g.get('crouch', 0.01 * self.hip_h)
            dx = g.get('sway', 0.02) * math.sin(ph)
            yaw = 0.02 * math.sin(ph)
            roll = 0.025 * math.sin(ph + math.pi / 2)
            Mp = self.pelvis(dz=dz, dx=dx, yaw=yaw, roll=roll)
            loc = self.body_locals(p, yaw_wave=-yaw, neck_pitch=g.get('neck_walk', 0.0) + 0.02 * math.cos(2 * ph),
                                   head_yaw=0.6 * yaw, head_pitch=0.0, tail_yaw=g.get('tail', 0.1),
                                   tail_phase=ph + 1.2, tail_pitch=0.0)
            hooks = self.legs(Mp, fh, ff)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=True, speed=v, stride=S, period=N / fps)

    def _still(self, seconds, fps, fn, name, loop):
        """Stationary clip: fn(t01, t_sec) -> (pelvis kwargs, body_locals kwargs, gauge)."""
        N = int(seconds * fps)
        frames = []
        for f in range(N):
            t = f / N
            pk, lk, gauge = fn(t, f / fps)
            Mp = self.pelvis(**pk)
            loc = self.body_locals(t, **lk)
            fh, ff = self._rest_feet(gauge)
            hooks = self.legs(Mp, fh, ff)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=loop)

    def idle(self, seconds=8.0, fps=30, name='idle'):
        def fn(t, ts):
            w = 2 * math.pi * t
            br = math.sin(2 * math.pi * ts / 4.5)
            return (dict(dz=0.004 * br * self.hip_h, dx=0.015 * math.sin(w), yaw=0.02 * math.sin(w)),
                    dict(head_yaw=0.3 * math.sin(w) + 0.1 * math.sin(3 * w), head_pitch=0.05 * math.sin(2 * w),
                         neck_pitch=0.03 * br, tail_yaw=0.05, tail_phase=2 * w, breath=br), 0.95)
        return self._still(seconds, fps, fn, name, True)

    def graze(self, seconds=6.0, fps=30, name='graze'):
        g = self.g
        down = g.get('neck_graze', 0.6)

        def fn(t, ts):
            d = smoothstep(t / 0.18) * (1 - smoothstep((t - 0.85) / 0.15))
            chew = 0.08 * max(0, math.sin(ts * 9)) * d
            return (dict(dz=-0.03 * self.hip_h * d, pitch=g.get('pitch_graze', 0.06) * d),
                    dict(neck_pitch=down * d, head_pitch=g.get('head_graze', 0.25) * d + 0.03 * math.sin(ts * 3) * d,
                         head_yaw=0.15 * math.sin(ts * 0.9) * d, tail_yaw=0.05, tail_phase=ts, jaw=chew), 0.95)
        return self._still(seconds, fps, fn, name, False)

    def drink(self, seconds=6.0, fps=30, name='drink'):
        g = self.g
        down = g.get('neck_drink', g.get('neck_graze', 0.6) * 1.15)

        def fn(t, ts):
            d = smoothstep(t / 0.2) * (1 - smoothstep((t - 0.85) / 0.15))
            lap = 0.04 * math.sin(ts * 5) * d
            return (dict(dz=-0.05 * self.hip_h * d, pitch=g.get('pitch_graze', 0.06) * 1.3 * d),
                    dict(neck_pitch=down * d, head_pitch=g.get('head_graze', 0.25) * 1.2 * d + lap,
                         tail_yaw=0.04, tail_phase=ts, jaw=0.05 * d), 0.95)
        return self._still(seconds, fps, fn, name, False)

    def browse(self, seconds=7.0, fps=30, name='browse'):
        """Neck raised to feed high (sauropods)."""
        g = self.g
        up = g.get('neck_browse', -0.35)

        def fn(t, ts):
            d = smoothstep(t / 0.25) * (1 - smoothstep((t - 0.8) / 0.2))
            chew = 0.07 * max(0, math.sin(ts * 7)) * d
            return (dict(dz=0.0, pitch=-0.03 * d),
                    dict(neck_pitch=up * d, head_pitch=0.15 * d, head_yaw=0.2 * math.sin(ts * 1.1) * d,
                         tail_yaw=0.04, tail_phase=ts, jaw=chew), 0.95)
        return self._still(seconds, fps, fn, name, False)

    def alert(self, seconds=4.0, fps=30, name='alert'):
        def fn(t, ts):
            d = smoothstep(t / 0.15) * (1 - smoothstep((t - 0.8) / 0.2))
            return (dict(dz=0.01 * self.hip_h * d),
                    dict(neck_pitch=-0.15 * d, head_pitch=-0.05 * d, head_yaw=0.45 * math.sin(ts * 1.6) * d,
                         tail_yaw=0.06, tail_phase=ts * 3, tail_pitch=0.08 * d), 0.95)
        return self._still(seconds, fps, fn, name, False)

    def threat(self, seconds=3.5, fps=30, name='threat'):
        """Head lowered, horns/plates presented, with a stamp and head toss (ceratopsians)."""
        def fn(t, ts):
            d = smoothstep(t / 0.15) * (1 - smoothstep((t - 0.8) / 0.2))
            toss = 0.18 * math.sin(ts * 6) * smoothstep((t - 0.3) / 0.1) * (1 - smoothstep((t - 0.7) / 0.1))
            return (dict(dz=-0.04 * self.hip_h * d, pitch=0.08 * d, dx=0.02 * math.sin(ts * 6) * d),
                    dict(neck_pitch=0.35 * d, head_pitch=0.25 * d + toss, head_yaw=0.1 * math.sin(ts * 4) * d,
                         tail_yaw=0.1, tail_phase=ts * 4, tail_pitch=0.1 * d), 0.95)
        return self._still(seconds, fps, fn, name, False)

    def tailswing(self, seconds=3.0, fps=30, name='tailswing'):
        """A defensive swing of the spiked tail (Stegosaurus)."""
        N = int(seconds * fps)
        frames = []
        n = len(self.tails)
        for f in range(N):
            t = f / N
            sw = math.sin(2 * math.pi * t) * smoothstep(t / 0.1) * (1 - smoothstep((t - 0.85) / 0.15))
            Mp = self.pelvis(yaw=-0.08 * sw, roll=0.04 * sw)
            loc = self.body_locals(t, head_yaw=0.3 * sw, neck_pitch=0.1)
            for i, s in enumerate(self.tails):
                fi = (i + 1) / n
                loc[s] = rot(UP, 1.1 * sw * (0.4 + fi) / n * 2.0 * math.cos(0.4 * i))
            fh, ff = self._rest_feet(1.0)
            hooks = self.legs(Mp, fh, ff)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=False)

    def rest(self, seconds=6.0, fps=30, name='rest'):
        """Lying down: body lowered onto the belly, legs folded."""
        N = int(seconds * fps)
        frames = []
        drop = self.meta.get('rest_drop', 0.45) * self.hip_h
        for f in range(N):
            ts = f / fps
            br = math.sin(2 * math.pi * ts / 5.0)
            Mp = self.pelvis(dz=-drop + 0.004 * br * self.hip_h)
            loc = self.body_locals(ts, neck_pitch=self.g.get('neck_rest', 0.25), head_pitch=0.15, tail_yaw=0.02,
                                   tail_phase=ts, breath=br)
            fh, ff = {}, {}
            for s in 'LR':
                b = self.ball[s].copy() + FWD * 0.25 * self.hip_h
                fh[s] = (b, self.toe_rest[s])
                c = self.fcontact[s].copy() - FWD * 0.15 * self.hip_h
                ff[s] = (c, rot(LEFT, -1.0) @ (self.hand_vec[s] / np.linalg.norm(self.hand_vec[s])))
            hooks = self.legs(Mp, fh, ff, elbow_out=0.4)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp}, hooks=hooks)
            frames.append(B)
        return name, frames, dict(loop=True)

    def all(self):
        g = self.g
        clips = [self.idle(), self.walk(),
                 self.walk(speed=g.get('run_speed', g['speed'] * 2.0), stride=g.get('run_stride', g['stride'] * 1.4),
                           duty=g.get('run_duty', 0.5), bob=g.get('bob', 0.03) * 1.6,
                           lift=g.get('lift', 0.07 * self.hip_h) * 1.5, name='run'),
                 self.graze(), self.drink(), self.alert(), self.rest()]
        for ex in g.get('extra', []):
            clips.append(getattr(self, ex)())
        return clips


# --------------------------------------------------------------------------- flyer clips
class Flyer(Biped):
    """Pterosaur flight: glide (wings spread, small corrections) and flap (wing beats). The rest pose
    is the glide; the runtime moves and banks the whole animal."""

    def __init__(self, rig, meta):
        self.r = rig
        self.meta = meta
        self.g = meta['gait']
        self.tails = [n for n in rig.names if n.startswith('tail')]
        self.spines = [n for n in rig.names if n.startswith('spine')]
        self.necks = [n for n in rig.names if n.startswith('neck')]
        self.jaw_rest = meta.get('jaw_open', 0.0) + meta.get('jaw_seal', 0.0)
        self.pel_A = rig.A[rig.idx['pelvis']]
        self.hip_h = self.pel_A[2, 3]

    def wing(self, loc, up, sweep=0.0, fold=0.0, twist=0.0):
        """up: wing elevation (rad, + = raise tips); fold: elbow/wrist flex; sweep: fore-aft."""
        for s, sg in (('L', 1), ('R', -1)):
            ua, fa, ha = f'upperarm.{s}', f'forearm.{s}', f'hand.{s}'
            # elevation about the body axis: rot(FWD, a) lifts +X (the left wing) for a > 0
            loc[ua] = rot(FWD, up * sg) @ rot(UP, sweep * sg) @ rot(LEFT, twist)
            loc[fa] = rot(UP, -fold * 0.6 * sg) @ rot(FWD, up * 0.2 * sg)
            loc[ha] = rot(UP, fold * 0.9 * sg) @ rot(FWD, up * 0.25 * sg)
            for i in (1, 2, 3):
                nm = f'wingfinger{i}.{s}'
                if self.r.has(nm):
                    loc[nm] = rot(FWD, up * 0.12 * i * sg) @ rot(UP, -fold * 0.3 * sg)

    def glide(self, seconds=6.0, fps=30, name='glide'):
        N = int(seconds * fps)
        frames = []
        for f in range(N):
            t = f / N
            w = 2 * math.pi * t
            loc = {}
            for i, s in enumerate(self.necks):
                loc[s] = rot(UP, 0.08 * math.sin(w)) @ rot(LEFT, 0.03 * math.sin(2 * w))
            loc['head'] = rot(UP, 0.15 * math.sin(w + 0.5))
            self.wing(loc, up=0.05 + 0.03 * math.sin(2 * w), twist=0.02 * math.sin(w))
            Mp = self.pelvis(dz=0.0)
            _, B = self.r.solve(local=loc, world={'pelvis': Mp})
            frames.append(B)
        return name, frames, dict(loop=True, speed=self.g.get('speed', 10.0))

    def flap(self, fps=30, name='flap'):
        period = self.g.get('flap_period', 1.0)
        N = max(12, int(round(period * fps)))
        frames = []
        amp = self.g.get('flap_amp', 0.55)
        for f in range(N):
            p = f / N
            ph = 2 * math.pi * p
            up = amp * math.cos(ph)  # starts at the top of the upstroke
            fold = 0.35 * max(0.0, math.sin(ph))  # flex on the upstroke (second half)
            loc = {}
            for i, s in enumerate(self.necks):
                loc[s] = rot(LEFT, -0.04 * math.cos(ph))
            loc['head'] = rot(LEFT, 0.05 * math.cos(ph))
            self.wing(loc, up=up, fold=fold, sweep=0.08 * math.sin(ph), twist=0.1 * math.sin(ph))
            Mp = self.pelvis(dz=-0.03 * math.cos(ph))
            _, B = self.r.solve(local=loc, world={'pelvis': Mp})
            frames.append(B)
        return name, frames, dict(loop=True, period=N / fps)

    def all(self):
        return [self.glide(), self.flap()]
