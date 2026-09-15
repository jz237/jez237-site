# Builds the near-bank trees for the Ultra tier: real branch geometry with needle and leaf sprays on
# cards, exported as glTF. Two meshes per tree share two materials named `bark` and `foliage`; the
# game re-binds both to its own materials after loading, so the file carries no textures.
#
#   blender -b --python source/blender/build_trees.py -- --out assets/trees
#
# Everything is generated from a seeded random stream, so a rebuild reproduces the same trees.
import bpy, bmesh, math, random, sys, os
from mathutils import Vector, Quaternion

ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = ARGS[ARGS.index('--out') + 1] if '--out' in ARGS else 'assets/trees'


def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def basis(d):
    """An orthonormal frame with d as its length axis."""
    d = d.normalized()
    up = Vector((0, 0, 1)) if abs(d.z) < .9 else Vector((1, 0, 0))
    x = d.cross(up).normalized()
    return x, d.cross(x).normalized(), d


def tube(verts, faces, uvs, p0, p1, r0, r1, sides=8):
    """A tapered tube from p0 to p1; the bark UV runs around in u and along in v."""
    d = p1 - p0
    if d.length < 1e-5:
        return
    x, y, _ = basis(d)
    base = len(verts)
    for i, (p, r) in enumerate(((p0, r0), (p1, r1))):
        for j in range(sides):
            a = j / sides * math.tau
            verts.append(p + x * (math.cos(a) * r) + y * (math.sin(a) * r))
            uvs.append((j / sides * 2.0, i * d.length * .6))
    for j in range(sides):
        k = (j + 1) % sides
        faces.append((base + j, base + k, base + sides + k, base + sides + j))


def card(verts, faces, uvs, centre, along, up, w, h, crossed=True):
    """A quad (or a crossed pair) carrying a spray texture; `along` is the twig direction."""
    a = along.normalized()
    n = a.cross(up).normalized() if a.cross(up).length > 1e-4 else a.cross(Vector((0, 0, 1))).normalized()
    planes = [n, a.cross(n).normalized()] if crossed else [n]
    for pn in planes:
        s = a.cross(pn).normalized()
        base = len(verts)
        for (du, dv, u, v) in ((-.06, -.5, 0, 0), (1, -.5, 1, 0), (1, .5, 1, 1), (-.06, .5, 0, 1)):
            verts.append(centre + a * (du * w) + s * (dv * h))
            uvs.append((u, v))
        faces.append((base, base + 1, base + 2, base + 3))


def mesh_from(name, verts, faces, uvs, material):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    me.validate()
    layer = me.uv_layers.new(name='UVMap')
    for i, loop in enumerate(me.loops):
        layer.data[i].uv = uvs[loop.vertex_index]
    me.materials.append(material)
    me.shade_smooth() if material.name == 'bark' else None
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def material(name, colour, alpha=False):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    if bsdf:
        bsdf.inputs['Base Color'].default_value = (*colour, 1)
        bsdf.inputs['Roughness'].default_value = .85
    if alpha:
        m.blend_method = 'CLIP'
    return m


def conifer(seed, height=13.0, whorls=17, per_whorl=6, droop=.42, spray=1.25):
    """A white pine: a tapered trunk, whorls of branches drooping outward, needle sprays along each."""
    rnd = random.Random(seed)
    bv, bf, bu = [], [], []
    fv, ff, fu = [], [], []
    # the trunk, in segments so it can lean a little
    n = 10
    p = Vector((0, 0, 0))
    lean = Vector((rnd.uniform(-.04, .04), rnd.uniform(-.04, .04), 0))
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        p1 = Vector((0, 0, 0)) + lean * (t1 * height) + Vector((0, 0, t1 * height))
        tube(bv, bf, bu, p, p1, .17 * (1 - t0) ** .7 + .02, .17 * (1 - t1) ** .7 + .02, 8)
        p = p1
    for w in range(whorls):
        t = .2 + .78 * (w / (whorls - 1))
        base = lean * (t * height) + Vector((0, 0, t * height))
        length = (1.05 - t) ** 1.15 * 3.4 + .35
        for b in range(per_whorl):
            a = (w * 2.399 + b / per_whorl * math.tau) + rnd.uniform(-.2, .2)
            out = Vector((math.cos(a), math.sin(a), 0))
            rise = .22 - droop * t + rnd.uniform(-.06, .06)
            tip = base + out * length + Vector((0, 0, rise * length))
            mid = base + out * (length * .55) + Vector((0, 0, rise * length * .75 + .06 * length))
            tube(bv, bf, bu, base, mid, .028 * (1 - t) + .006, .018 * (1 - t) + .004, 5)
            tube(bv, bf, bu, mid, tip, .018 * (1 - t) + .004, .004, 5)
            # needle sprays along the outer two thirds
            steps = 4 if t < .6 else 3 if t < .85 else 2
            for s in range(steps):
                f = .35 + .65 * (s + .5) / steps
                c = base.lerp(tip, f)
                d = (tip - base).normalized()
                size = spray * (1 - t * .55) * (1.05 - .35 * f)
                card(fv, ff, fu, c, d, Vector((0, 0, 1)), size * 1.15, size * .8)
    bark = material('bark', (.19, .13, .09))
    foliage = material('foliage', (.16, .3, .14), alpha=True)
    return [mesh_from('trunk', bv, bf, bu, bark), mesh_from('leaves', fv, ff, fu, foliage)]


def broadleaf(seed, height=14.5, spray=1.7):
    """An oak: a short thick trunk that forks three times into a rounded crown of leaf sprays."""
    rnd = random.Random(seed)
    bv, bf, bu = [], [], []
    fv, ff, fu = [], [], []
    trunk_h = height * .5
    p = Vector((0, 0, 0))
    n = 6
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        p1 = Vector((rnd.uniform(-.05, .05) * i, rnd.uniform(-.05, .05) * i, t1 * trunk_h))
        tube(bv, bf, bu, p, p1, .3 * (1 - t0 * .45), .3 * (1 - t1 * .45), 9)
        p = p1
    def limb(start, direction, length, radius, depth):
        end = start + direction * length
        tube(bv, bf, bu, start, end, radius, radius * .62, max(4, 8 - depth * 2))
        if depth >= 4 or length < .55:
            # the crown: a puff of leaf sprays around the tip
            for _ in range(13):
                off = Vector((rnd.gauss(0, .5), rnd.gauss(0, .5), rnd.gauss(0, .55)))
                d = (direction + Vector((rnd.gauss(0, .5), rnd.gauss(0, .5), rnd.gauss(0, .3)))).normalized()
                size = spray * rnd.uniform(.85, 1.3)
                card(fv, ff, fu, end + off, d, Vector((0, 0, 1)), size, size * .75)
            return
        for _ in range(rnd.choice((2, 3, 3))):
            a = rnd.uniform(0, math.tau)
            spreadv = Vector((math.cos(a), math.sin(a), 0)) * rnd.uniform(.3, .62)
            d = (direction + spreadv).normalized()
            limb(end, d, length * rnd.uniform(.62, .8), radius * .66, depth + 1)
    for k in range(4):
        a = k / 4 * math.tau + rnd.uniform(-.4, .4)
        d = (Vector((math.cos(a), math.sin(a), 0)) * rnd.uniform(.3, .6) + Vector((0, 0, 1))).normalized()
        limb(p, d, height * .3, .2, 0)
    bark = material('bark', (.22, .17, .13))
    foliage = material('foliage', (.2, .34, .13), alpha=True)
    return [mesh_from('trunk', bv, bf, bu, bark), mesh_from('leaves', fv, ff, fu, foliage)]


def export(name, objs):
    for ob in bpy.context.scene.objects:
        ob.select_set(ob in objs)
    path = os.path.abspath(os.path.join(OUT, name + '.glb'))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True,
                              export_apply=True, export_yup=True, export_materials='EXPORT',
                              export_normals=True, export_texcoords=True)
    tris = sum(len(o.data.polygons) * 2 for o in objs)
    print('EXPORTED %s %s tris~%d bytes=%d' % (name, path, tris, os.path.getsize(path)))


for name, build in (('pine3d', lambda: conifer(11)),
                    ('spruce3d', lambda: conifer(29, height=15.0, whorls=20, per_whorl=7, droop=.55, spray=1.0)),
                    ('oak3d', lambda: broadleaf(41)),
                    ('maple3d', lambda: broadleaf(57, height=13.5, spray=1.6))):
    clear()
    export(name, build())
print('DONE')
