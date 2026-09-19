"""Schematic female reproductive system for the Anatomy Studio: procedurally built in Blender 4.5 and exported like the
Z-Anatomy pieces (same frame, same extras). Shapes and positions follow textbook dimensions; this is a teaching
reconstruction, not scan data. Usage: blender -b --factory-startup -P blender-female.py -- --work <dir>
Frame while modelling: Z-Anatomy source frame (Z up, front = -Y, subject's left = +X, metres), normalised on export."""
import bpy, bmesh, sys, os, json, math, random
from mathutils import Vector, Matrix, noise
argv = sys.argv[sys.argv.index('--') + 1:]; args = dict(zip(argv[::2], argv[1::2])); WORK = args['--work']
NORM = json.load(open(os.path.join(WORK, 'normalize.json'))); Mn = Matrix.Translation(Vector(NORM['translate'])) @ Matrix.Scale(NORM['scale'], 4)
bpy.ops.wm.read_factory_settings(use_empty=True)
random.seed(7)
pieces = []

def finish(bm, name, side, description, parent, path, smooth_iters=2):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free(); me.shade_smooth()
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o)
    if smooth_iters:
        b2 = bmesh.new(); b2.from_mesh(me); bmesh.ops.smooth_vert(b2, verts=b2.verts, factor=.5, use_axis_x=True, use_axis_y=True, use_axis_z=True); bmesh.ops.recalc_face_normals(b2, faces=b2.faces); b2.to_mesh(me); b2.free()
    pieces.append(dict(obj=o, name=name, side=side, description=description, parent=parent, path=path)); return o

def ellipsoid(center, radii, segs=48, rings=32, bumps=0):
    bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=segs, v_segments=rings, radius=1)
    for v in bm.verts:
        n = v.co.copy(); r = 1 + bumps * (noise.noise(n * 3.1) * .5 + noise.noise(n * 7.3) * .25)
        v.co = Vector((n.x * radii[0] * r, n.y * radii[1] * r, n.z * radii[2] * r)) + Vector(center)
    return bm

def tube(points, radius_fn, segs=20):
    """Sweep a circle along a polyline (points already smooth)."""
    bm = bmesh.new(); rings = []
    for i, p in enumerate(points):
        t = i / (len(points) - 1); d = (points[min(i + 1, len(points) - 1)] - points[max(i - 1, 0)]).normalized()
        u = d.cross(Vector((0, 0, 1))); u = u.normalized() if u.length > 1e-4 else d.cross(Vector((1, 0, 0))).normalized(); w = d.cross(u).normalized(); r = radius_fn(t)
        rings.append([bm.verts.new(p + (u * math.cos(a) + w * math.sin(a)) * r) for a in [k / segs * 2 * math.pi for k in range(segs)]])
    for a, b in zip(rings, rings[1:]):
        for k in range(segs): bm.faces.new((a[k], a[(k + 1) % segs], b[(k + 1) % segs], b[k]))
    bm.faces.new(rings[0][::-1]); bm.faces.new(rings[-1]); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); return bm

def bezier(p0, p1, p2, p3, n=40):
    return [Vector(p0) * (1 - t) ** 3 + Vector(p1) * 3 * t * (1 - t) ** 2 + Vector(p2) * 3 * t * t * (1 - t) + Vector(p3) * t ** 3 for t in [i / n for i in range(n + 1)]]

def pelvic_axis_transform(center, tilt_deg):
    """Uterine axis: anteverted, fundus pointing forward-up over the bladder (front = -Y)."""
    return Matrix.Translation(Vector(center)) @ Matrix.Rotation(math.radians(tilt_deg), 4, 'X')

PATH = 'Genital systems / Female genital system'
# ---- Uterus: pear-shaped body, 7.5 x 5 x 2.5 cm, fundus forward-up
bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=64, v_segments=48, radius=1)
for v in bm.verts:
    t = (v.co.z + 1) / 2; s = .5 + .5 * t ** .6                       # narrows toward the cervix (bottom)
    v.co = Vector((v.co.x * .025 * s, v.co.y * .0125 * s, v.co.z * .0375 * (1 - .12 * (1 - t))))
T = pelvic_axis_transform((0, .028, .885), -62); bm.transform(T)
finish(bm, 'Uterus', 'M', 'Schematic uterus: a pear-shaped, thick-walled organ about 7.5 cm long lying over the bladder, anteverted and anteflexed, with the fundus facing forward and the cervix opening into the vagina. Dimensions and position are textbook values, not scan data.', 'Female genital system', PATH)
# ---- Cervix: short cylinder continuing the uterine axis downward
bm = bmesh.new(); bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=40, radius1=.013, radius2=.011, depth=.026)
bm.transform(T @ Matrix.Translation(Vector((0, 0, -.045))))
finish(bm, 'Cervix of uterus', 'M', 'Schematic cervix: the lower, narrower part of the uterus, about 2.5 cm long, projecting into the upper vagina. A teaching reconstruction.', 'Uterus', PATH + ' / Uterus')
# ---- Vagina: flattened tube from the cervix down and forward to the vestibule, about 8.5 cm
vag = bezier((0, .034, .855), (0, .028, .825), (0, .012, .795), (0, -.012, .772), 36)
bm = tube(vag, lambda t: .016 - .004 * t, 28)
for v in bm.verts: v.co.y = (v.co.y - vag[0].y) * .55 + vag[0].y if False else v.co.y   # keep simple round tube
finish(bm, 'Vagina', 'M', 'Schematic vagina: a distensible muscular canal about 8 to 9 cm long running down and forward from the cervix to the vestibule, between the bladder and urethra in front and the rectum behind. A teaching reconstruction.', 'Female genital system', PATH)
# ---- Uterine tubes with fimbriae, and ovaries
for side, sx in (('L', 1), ('R', -1)):
    pts = bezier((sx * .022, .012, .905), (sx * .055, -.004, .918), (sx * .082, .012, .905), (sx * .068, .036, .889), 48)
    bm = tube(pts, lambda t: .0035 + .003 * max(0, t - .6), 18)
    tip = pts[-1]; toward = (Vector((sx * .058, .04, .884)) - tip).normalized()
    for k in range(7):
        a = k / 7 * 2 * math.pi; spread = Vector((math.cos(a), math.sin(a), 0)).cross(toward).normalized() * .006 + toward * .012
        fb = bmesh.new(); bmesh.ops.create_cone(fb, cap_ends=True, segments=10, radius1=.0018, radius2=.0004, depth=.014)
        rot = Vector((0, 0, 1)).rotation_difference((toward + spread).normalized()).to_matrix().to_4x4(); fb.transform(Matrix.Translation(tip + (toward + spread).normalized() * .007) @ rot)
        fb.to_mesh(tmp := bpy.data.meshes.new('f')); bm.from_mesh(tmp); bpy.data.meshes.remove(tmp)
    finish(bm, 'Uterine tube', side, 'Schematic uterine (Fallopian) tube: about 10 cm long, running from the upper corner of the uterus out toward the ovary, widening into the ampulla and ending in the fringed fimbriae that gather the released oocyte. A teaching reconstruction.', 'Female genital system', PATH)
    bm = ellipsoid((sx * .056, .04, .883), (.017, .009, .011), bumps=.04)
    finish(bm, 'Ovary', side, 'Schematic ovary: an almond-shaped gland about 3 cm long beside the pelvic wall, suspended near the open end of the uterine tube. It releases oocytes and produces oestrogen and progesterone. A teaching reconstruction.', 'Female genital system', PATH)
# ---- Female urethra: short tube from the bladder neck to the vestibule
ure = bezier((0, .006, .842), (0, .0, .825), (0, -.008, .805), (0, -.014, .785), 24)
finish(tube(ure, lambda t: .0035, 16), 'Female urethra', 'M', 'Schematic female urethra: about 4 cm long, running from the neck of the bladder down and forward to open into the vestibule just in front of the vaginal opening. A teaching reconstruction.', 'Urinary system', 'Urinary system')
# ---- Mammary glands: lobulated dome under the pectoral region, nipple forward (front = -Y)
for side, sx in (('L', 1), ('R', -1)):
    # Dome lying on the pectoral wall: flat back, wide base, about 4 cm deep, slight sag and a nipple at the apex.
    c = Vector((sx * .102, -.094, 1.276)); bm = bmesh.new(); bmesh.ops.create_uvsphere(bm, u_segments=72, v_segments=44, radius=1)
    for v in bm.verts:
        n = v.co.copy(); front = max(0.0, -n.y); back = max(0.0, n.y)
        lob = 1 + .035 * noise.noise(n * 3.5 + Vector((sx, 0, 0))) + .02 * noise.noise(n * 8.0)
        sag = -.008 * front
        v.co = Vector((n.x * .066 * lob, (back * .004 - front * .042) * lob, n.z * .060 * lob + sag)) + c
    apex = c + Vector((0, -.042, -.008))
    for v in bm.verts:
        d = (v.co - apex).length
        if d < .014: v.co.y -= (.014 - d) * .4
    finish(bm, 'Mammary gland', side, 'Schematic mammary gland: the glandular and fatty tissue of the breast lying on the pectoralis major, with lobes draining by lactiferous ducts to the nipple. Size and shape vary widely; this is a teaching reconstruction placed on the shared base body.', 'Mammary gland', 'Regions of thorax / Mammary gland')

# ---- normalise, centre origins, extras, export
def slug(s): import re; return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')
report = []
for p in pieces:
    o = p['obj']; me = o.data
    me.transform(Mn); me.calc_loop_triangles()
    xs = [v.co.x for v in me.vertices]; ys = [v.co.y for v in me.vertices]; zs = [v.co.z for v in me.vertices]
    c = Vector(((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2))
    for v in me.vertices: v.co -= c
    o.location = c; tris = len(me.loop_triangles)
    pid = f"female/{slug(p['name'])}" + ('' if p['side'] == 'M' else '-' + p['side'].lower())
    o['id'] = pid; o['name'] = p['name']; o['system'] = 'female'; o['file'] = 'female'; o['side'] = p['side']; o['parent'] = p['parent']; o['path'] = p['path']; o['merged'] = '[]'; o['tris'] = tris; o['schematic'] = 1; o['description'] = p['description']
    o.name = pid.replace('/', '__'); o.select_set(True)
    report.append(dict(id=pid, tris=tris, center=[round(c.x, 4), round(c.z, 4), round(-c.y, 4)]))
out = os.path.join(WORK, 'raw', 'female.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_apply=True, export_extras=True, export_yup=True, export_materials='NONE', export_texcoords=False, export_normals=True, export_tangents=False, export_animations=False, export_skins=False, export_morph=False, export_lights=False, export_cameras=False, export_attributes=False, export_shared_accessors=False)
json.dump(dict(system='female', files={'female': dict(pieces=len(pieces), trisAfter=sum(r['tris'] for r in report), bytes=os.path.getsize(out))}, pieces=report), open(os.path.join(WORK, 'female-report.json'), 'w'), indent=1)
print('[female] wrote', out, len(pieces), 'pieces', sum(r['tris'] for r in report), 'tris'); [print('  ', r) for r in report]
