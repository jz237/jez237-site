"""Mesozoic plants for the terrarium, modelled procedurally and exported as GLBs.

    blender -b -P flora.py -- [out_dir]

Each plant is built in real metres (y-up export; the runtime scales by 1/8). Geometry carries vertex
colours (base darker, tips lighter, a few red young fronds) and a 'sway' attribute in the alpha channel
(0 at the root, 1 at the tips) that the runtime's wind shader bends by. Several variants per species
are packed as separate meshes in one GLB; the runtime instances them.

    fern       pinnate ground fern clumps (Osmunda/Dicksonia-like), 0.6-1.4 m
    treefern   tree ferns (Dicksonia-like), trunk 2.5-5 m, fronds 2-3 m
    cycad      cycads (Cycas-like), stout trunk 0.6-1.8 m, stiff fronds 1.2-1.8 m
    horsetail  Equisetum stands, stems 0.8-1.8 m with whorls
    araucaria  monkey-puzzle conifers, 11-17 m (miniature-scale)
"""
import sys, os, math
import numpy as np
import bpy
import bmesh
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = argv[0] if argv else os.path.join(HERE, '..', '..', '..', 'demos', 'jurassic-terrarium', 'models')
rng = np.random.default_rng(1871)


def hexc(h, a=1.0):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [a]


def lerp(a, b, t):
    return [a[i] + (b[i] - a[i]) * t for i in range(4)]


class Builder:
    """Accumulates triangles with per-vertex colour (rgb) + sway (alpha)."""

    def __init__(self):
        self.V, self.C, self.F = [], [], []

    def tri(self, a, b, c, ca, cb, cc):
        i = len(self.V)
        self.V += [a, b, c]
        self.C += [ca, cb, cc]
        self.F.append((i, i + 1, i + 2))

    def quad(self, a, b, c, d, ca, cb, cc, cd):
        i = len(self.V)
        self.V += [a, b, c, d]
        self.C += [ca, cb, cc, cd]
        self.F.append((i, i + 1, i + 2, i + 3))

    def tube(self, pts, radii, col_fn, sides=6, cap=True, sway_fn=None, noise=0.0):
        """A tapered tube along pts (N,3) with ring radii; col_fn(t)->rgba; sway_fn(t)->0..1."""
        pts = np.asarray(pts, float)
        n = len(pts)
        T = np.gradient(pts, axis=0)
        T /= np.linalg.norm(T, axis=1, keepdims=True) + 1e-12
        ref = np.array([0.0, 0.0, 1.0]) if abs(T[0][2]) < 0.9 else np.array([1.0, 0.0, 0.0])
        rings = []
        for i in range(n):
            t = T[i]
            u = np.cross(t, ref)
            u /= np.linalg.norm(u) + 1e-12
            v = np.cross(t, u)
            ring = []
            for k in range(sides):
                a = 2 * math.pi * k / sides
                r = radii[i] * (1 + noise * (rng.random() - 0.5))
                ring.append(pts[i] + (math.cos(a) * u + math.sin(a) * v) * r)
            rings.append(ring)
        base = len(self.V)
        for i in range(n):
            tt = i / (n - 1)
            c = list(col_fn(tt))
            c[3] = sway_fn(tt) if sway_fn else c[3]
            for k in range(sides):
                self.V.append(rings[i][k])
                self.C.append(c)
        for i in range(n - 1):
            for k in range(sides):
                a = base + i * sides + k
                b = base + i * sides + (k + 1) % sides
                self.F.append((a, b, b + sides, a + sides))
        if cap:
            top = base + (n - 1) * sides
            self.F.append(tuple(top + k for k in range(sides)))

    def mesh(self, name):
        me = bpy.data.meshes.new(name)
        me.from_pydata([tuple(v) for v in self.V], [], self.F)
        me.update()
        col = me.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
        col.data.foreach_set('color', np.array(self.C, np.float32).ravel())
        for p in me.polygons:
            p.use_smooth = True
        ob = bpy.data.objects.new(name, me)
        bpy.context.scene.collection.objects.link(ob)
        return ob


def bez(p0, p1, p2, n):
    t = np.linspace(0, 1, n)[:, None]
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t * t * p2


def frond(B, base, direction, length, width, droop, cols, n=18, sway0=0.0, sway1=1.0, stiff=False, keel=0.25,
          start=0.12, leaflet=0.9, red=False):
    """A pinnate frond: rachis along an arching curve, paired leaflets (pinnae) along it."""
    d = np.asarray(direction, float)
    d /= np.linalg.norm(d)
    side = np.cross(d, [0, 0, 1])
    if np.linalg.norm(side) < 1e-6:
        side = np.array([1.0, 0, 0])
    side /= np.linalg.norm(side)
    up = np.cross(side, d)
    p0 = np.asarray(base, float)
    p1 = p0 + d * length * 0.55 + up * length * 0.12
    p2 = p0 + d * length * (0.85 if not stiff else 0.95) - np.array([0, 0, 1.0]) * length * droop
    pts = bez(p0, p1, p2, n)
    c_base, c_mid, c_tip = cols
    if red:
        c_mid = lerp(c_mid, hexc('#8c3a24'), 0.75)
        c_tip = lerp(c_tip, hexc('#b8542e'), 0.85)
    # rachis
    rr = [max(0.004, width * 0.05 * (1 - i / (n - 1)) + 0.003) for i in range(n)]
    B.tube(pts, rr, lambda t: lerp(c_base, c_mid, t), sides=4, cap=False,
           sway_fn=lambda t: sway0 + (sway1 - sway0) * t)
    T = np.gradient(pts, axis=0)
    T /= np.linalg.norm(T, axis=1, keepdims=True)
    for i in range(1, n - 1):
        t = i / (n - 1)
        if t < start:
            continue
        # ovate outline: widest a third of the way up, tapering to the tip
        prof = math.sin(math.pi * min(1, (t - start) / (1 - start)) ** 0.75) * (1.0 - 0.35 * t)
        L = width * prof * leaflet
        if L < 0.01:
            continue
        tang = T[i]
        s = np.cross(tang, up)
        s /= np.linalg.norm(s) + 1e-12
        w_ = width * 0.12 * (0.6 + 0.4 * prof)
        col0 = lerp(c_mid, c_tip, t * 0.6)
        col1 = lerp(c_mid, c_tip, min(1, t * 0.6 + 0.3))
        sw = sway0 + (sway1 - sway0) * t
        for sg in (1, -1):
            root = pts[i]
            # leaflets angle forward and droop/keel slightly (a shallow V)
            dirv = s * sg * math.cos(0.45) + tang * math.sin(0.45)
            tip = root + dirv * L - up * L * keel
            mid1 = root + dirv * L * 0.45 + tang * w_ - up * L * keel * 0.3
            mid2 = root + dirv * L * 0.45 - tang * w_ - up * L * keel * 0.3
            c0 = list(col0); c0[3] = sw
            c1 = list(col1); c1[3] = sw + 0.04
            B.quad(root, mid1, tip, mid2, c0, c1, c1, c1)
    return pts


def make_fern(name, size, red=False, seed=0):
    B = Builder()
    nf = int(rng.integers(9, 15))
    cols = (hexc('#2c4220'), hexc('#4c7535'), hexc('#86ad55'))
    for k in range(nf):
        a = 2 * math.pi * k / nf + rng.normal(0, 0.25)
        elev = rng.uniform(0.6, 1.15)
        d = [math.cos(a) * math.cos(elev), math.sin(a) * math.cos(elev), math.sin(elev)]
        L = size * rng.uniform(0.75, 1.1)
        frond(B, [0, 0, 0.02], d, L, L * 0.32, droop=rng.uniform(0.15, 0.4), cols=cols, n=16,
              red=(red and rng.random() < 0.45))
    return B.mesh(name)


def make_treefern(name, height, seed=0):
    B = Builder()
    # fibrous trunk, slightly leaning, wider at the base (root mantle)
    lean = rng.normal(0, 0.06, 2)
    pts = np.array([[lean[0] * t * height, lean[1] * t * height, t * height] for t in np.linspace(0, 1, 9)])
    radii = [0.2 * (1.25 - 0.45 * t) for t in np.linspace(0, 1, 9)]
    trunk_lo, trunk_hi = hexc('#2b1e15'), hexc('#4a3424')
    B.tube(pts, radii, lambda t: lerp(trunk_lo, trunk_hi, t), sides=9, noise=0.25, sway_fn=lambda t: 0.25 * t * t)
    top = pts[-1]
    cols = (hexc('#33502a'), hexc('#4f7b37'), hexc('#8cb15c'))
    nf = int(rng.integers(11, 16))
    for k in range(nf):
        a = 2 * math.pi * k / nf + rng.normal(0, 0.15)
        elev = rng.uniform(0.25, 0.75)
        d = [math.cos(a) * math.cos(elev), math.sin(a) * math.cos(elev), math.sin(elev)]
        L = rng.uniform(2.5, 3.4)
        frond(B, top, d, L, L * 0.34, droop=rng.uniform(0.35, 0.6), cols=cols, n=20, sway0=0.3, sway1=1.0)
    # a few unfurling croziers in the centre
    for k in range(3):
        a = rng.uniform(0, 2 * math.pi)
        c = top + np.array([math.cos(a) * 0.05, math.sin(a) * 0.05, 0])
        pts = np.array([c + np.array([0, 0, 0.12 * i]) + np.array([math.cos(a), math.sin(a), 0]) * 0.04 * i * i
                        for i in range(5)])
        B.tube(pts, [0.03, 0.028, 0.026, 0.03, 0.035], lambda t: lerp(hexc('#5d6b2e'), hexc('#8c7a3a'), t), sides=5,
               sway_fn=lambda t: 0.35)
    return B.mesh(name)


def make_cycad(name, height, cone=False):
    B = Builder()
    pts = np.array([[0, 0, t * height] for t in np.linspace(0, 1, 7)])
    radii = [0.19 * (1.15 - 0.25 * t) for t in np.linspace(0, 1, 7)]
    # diamond leaf-base armour: alternate ring colours
    B.tube(pts, radii, lambda t: hexc('#3a2c1d') if int(t * 12) % 2 else hexc('#5a4630'), sides=10, noise=0.2,
           sway_fn=lambda t: 0.05 * t)
    top = pts[-1]
    cols = (hexc('#2a4224'), hexc('#3d6a33'), hexc('#6e9a48'))
    nf = int(rng.integers(20, 28))
    for k in range(nf):
        a = 2 * math.pi * k / nf + rng.normal(0, 0.1)
        elev = rng.uniform(0.35, 0.95)
        d = [math.cos(a) * math.cos(elev), math.sin(a) * math.cos(elev), math.sin(elev)]
        L = rng.uniform(1.5, 2.2)
        frond(B, top, d, L, L * 0.3, droop=rng.uniform(0.05, 0.22), cols=cols, n=22, stiff=True, keel=0.08,
              leaflet=1.0, start=0.18, sway0=0.15, sway1=0.75)
    if cone:
        cp = np.array([top + np.array([0, 0, 0.05 + 0.08 * i]) for i in range(5)])
        B.tube(cp, [0.12, 0.16, 0.15, 0.1, 0.03], lambda t: lerp(hexc('#8a6a2a'), hexc('#c09a45'), t), sides=8,
               sway_fn=lambda t: 0.05)
    return B.mesh(name)


def make_horsetail(name, size):
    B = Builder()
    ns = int(rng.integers(6, 12))
    for s in range(ns):
        a = rng.uniform(0, 2 * math.pi)
        r0 = rng.uniform(0, 0.18) * size
        h = size * rng.uniform(0.6, 1.0)
        base = np.array([math.cos(a) * r0, math.sin(a) * r0, 0])
        lean = np.array([math.cos(a), math.sin(a), 0]) * rng.uniform(0.02, 0.12) * h
        pts = np.array([base + lean * t * t + np.array([0, 0, h * t]) for t in np.linspace(0, 1, 10)])
        segs = 7
        B.tube(pts, [0.014 * size * (1 - 0.4 * t) for t in np.linspace(0, 1, 10)],
               lambda t: hexc('#25321a') if (t * segs) % 1 < 0.08 else lerp(hexc('#56733a'), hexc('#7d9a4c'), t),
               sides=5, sway_fn=lambda t: t)
        # whorls of needle branches at the nodes
        for j in range(1, segs):
            t = j / segs
            p = base + lean * t * t + np.array([0, 0, h * t])
            nb = 9
            for k in range(nb):
                b = 2 * math.pi * k / nb
                L = 0.09 * size * (1 - t * 0.7)
                d = np.array([math.cos(b), math.sin(b), 0.45])
                q = p + d * L
                w = np.array([-math.sin(b), math.cos(b), 0]) * 0.004 * size
                c = hexc('#6f8f45', t)
                B.quad(p - w, p + w, q + w * 0.2, q - w * 0.2, c, c, c, c)
    return B.mesh(name)


def make_araucaria(name, height):
    B = Builder()
    pts = np.array([[0, 0, t * height] for t in np.linspace(0, 1, 12)])
    radii = [0.3 * (1.0 - 0.8 * t) + 0.03 for t in np.linspace(0, 1, 12)]
    B.tube(pts, radii, lambda t: lerp(hexc('#3b2a1f'), hexc('#5a4433'), t), sides=8, noise=0.15,
           sway_fn=lambda t: 0.15 * t * t)
    leaf = (hexc('#1f3a22'), hexc('#2f5530'), hexc('#4e7a45'))
    # whorls of 5 branches over the upper part, upturned at the tips, shorter towards the top (umbrella)
    nw = int(rng.integers(7, 10))
    for w in range(nw):
        t = 0.45 + 0.55 * w / (nw - 1)
        z = height * t
        L = height * (0.22 * (1.0 - t) + 0.07) * rng.uniform(0.85, 1.15)
        for k in range(5):
            a = 2 * math.pi * k / 5 + w * 0.6 + rng.normal(0, 0.12)
            d = np.array([math.cos(a), math.sin(a), 0.0])
            p0 = np.array([0, 0, z])
            p1 = p0 + d * L * 0.6 - np.array([0, 0, 0.05 * L])
            p2 = p0 + d * L + np.array([0, 0, 0.18 * L])
            bp = bez(p0, p1, p2, 8)
            # the branch is a 'rope' of scale leaves: a fat bumpy tube
            B.tube(bp, [0.11 * (1 - 0.5 * i / 7) + 0.04 for i in range(8)],
                   lambda tt: lerp(leaf[0], leaf[2], tt), sides=6, noise=0.5, sway_fn=lambda tt: (0.3 + 0.7 * t) * tt)
            # side branchlets
            for j in range(2, 7):
                q = bp[j]
                for sg in (1, -1):
                    sd = np.cross(d, [0, 0, 1]) * sg
                    q2 = q + sd * L * 0.16 + np.array([0, 0, 0.04 * L])
                    B.tube([q, (q + q2) / 2, q2], [0.05, 0.045, 0.02], lambda tt: lerp(leaf[1], leaf[2], tt), sides=5,
                           noise=0.5, cap=False, sway_fn=lambda tt: (0.3 + 0.7 * t))
    # crown tuft
    B.tube(np.array([[0, 0, height * (0.97 + 0.03 * i)] for i in range(4)]), [0.25, 0.22, 0.14, 0.02],
           lambda t: lerp(leaf[1], leaf[2], t), sides=7, noise=0.5, sway_fn=lambda t: 0.3)
    return B.mesh(name)


def make_fernlet(name, size, red=False):
    """A cheap carpet fern: few fronds, few leaflets, so thousands can be planted."""
    B = Builder()
    nf = int(rng.integers(5, 8))
    cols = (hexc('#243a1b'), hexc('#3f6a2c'), hexc('#7aa64c'))
    for k in range(nf):
        a = 2 * math.pi * k / nf + rng.normal(0, 0.3)
        elev = rng.uniform(0.55, 1.1)
        d = [math.cos(a) * math.cos(elev), math.sin(a) * math.cos(elev), math.sin(elev)]
        L = size * rng.uniform(0.8, 1.1)
        frond(B, [0, 0, 0.01], d, L, L * 0.34, droop=rng.uniform(0.2, 0.45), cols=cols, n=8,
              red=(red and rng.random() < 0.6))
    return B.mesh(name)


def make_redplant(name, size):
    """A bromeliad-like rosette of strap leaves, crimson with a green heart (the concept's red plants)."""
    B = Builder()
    nl = int(rng.integers(12, 18))
    for k in range(nl):
        a = 2 * math.pi * k / nl + rng.normal(0, 0.15)
        elev = rng.uniform(0.35, 1.2)
        L = size * rng.uniform(0.6, 1.0) * (1.1 - 0.3 * (elev - 0.35))
        d = np.array([math.cos(a) * math.cos(elev), math.sin(a) * math.cos(elev), math.sin(elev)])
        side = np.cross(d, [0, 0, 1])
        side /= np.linalg.norm(side) + 1e-9
        up = np.cross(side, d)
        n = 6
        pts = [d * L * (i / (n - 1)) - np.array([0, 0, 1.0]) * L * 0.35 * (i / (n - 1)) ** 2 for i in range(n)]
        w0 = size * 0.07
        c_in, c_mid, c_out = hexc('#2f5a2a'), hexc('#a3242a'), hexc('#d84a3a')
        for i in range(n - 1):
            t0, t1 = i / (n - 1), (i + 1) / (n - 1)
            wa = w0 * (1 - t0 * 0.85)
            wb = w0 * (1 - t1 * 0.85)
            # leaves are channelled (a shallow V across the blade)
            a0, a1 = pts[i] + side * wa + up * wa * 0.25, pts[i] - side * wa + up * wa * 0.25
            b0, b1 = pts[i + 1] + side * wb + up * wb * 0.25, pts[i + 1] - side * wb + up * wb * 0.25
            ca = lerp(c_in, c_mid, min(1, t0 * 2.2)) if t0 < 0.5 else lerp(c_mid, c_out, (t0 - 0.5) * 2)
            cb = lerp(c_in, c_mid, min(1, t1 * 2.2)) if t1 < 0.5 else lerp(c_mid, c_out, (t1 - 0.5) * 2)
            B.quad(a0, a1, b1, b0, ca, ca, cb, cb)
    return B.mesh(name)


def material():
    m = bpy.data.materials.new('plant')
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes['Principled BSDF']
    at = nt.nodes.new('ShaderNodeVertexColor')
    at.layer_name = 'Col'
    nt.links.new(at.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.62
    m.use_backface_culling = False
    return m


def export(name, objs):
    mat = material()
    for o in objs:
        o.data.materials.append(mat)
    bpy.ops.object.select_all(action='DESELECT')
    for o in objs:
        o.select_set(True)
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f'{name}.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True,
                              export_apply=True, export_materials='EXPORT', export_vertex_color='ACTIVE',
                              export_normals=True, export_texcoords=False, export_animations=False)
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objs)
    print(f'FLORA {name}: {len(objs)} variants, {tris} triangles, {os.path.getsize(path) // 1024} KB', flush=True)
    for o in objs:
        bpy.data.objects.remove(o, do_unlink=True)


bpy.ops.wm.read_factory_settings(use_empty=True)
export('fern', [make_fern(f'fern{i}', rng.uniform(0.7, 1.3), red=(i == 3)) for i in range(4)])
export('treefern', [make_treefern(f'treefern{i}', h) for i, h in enumerate([2.8, 3.9, 5.2, 6.5])])
export('cycad', [make_cycad(f'cycad{i}', rng.uniform(0.5, 1.6), cone=(i == 1)) for i in range(3)])
export('horsetail', [make_horsetail(f'horsetail{i}', rng.uniform(1.0, 1.7)) for i in range(2)])
export('fernlet', [make_fernlet(f'fernlet{i}', rng.uniform(0.6, 1.0), red=(i == 2)) for i in range(3)])
export('redplant', [make_redplant(f'redplant{i}', rng.uniform(0.6, 0.9)) for i in range(2)])
