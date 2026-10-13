"""Full Blender stage for one species.

    python3 grid.py <species>                         # dense distance grid (all cores)
    blender -b -P build.py -- <species> [--faces N] [--tex 2048] [--stages mesh,bake,rig,anim,export]

Stages (results saved in ~/.cache/jurassic-terrarium/work/<species>/):
    mesh   grid -> high-res sculpture (attributes from the field) + decimated, unwrapped game mesh
    bake   procedural skin on the sculpture baked to colour / normal / roughness / AO textures
    rig    armature from the skeleton, skin weights from the field's bone bindings, eyes and teeth
    anim   procedural actions (idle, walk, run, ...) from anim.py
    export GLB (+ preview renders)
"""
import sys, os, json, math, importlib, time, argparse
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, 'species')]
import numpy as np
import bpy
import bmesh
from mathutils import Vector, Matrix
import blib, material, sdf, rig as rigmod, anim

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ap = argparse.ArgumentParser()
ap.add_argument('species')
ap.add_argument('--faces', type=int, default=None)
ap.add_argument('--tex', type=int, default=None)
ap.add_argument('--stages', default='mesh,bake,rig,anim,export')
ap.add_argument('--out', default=None)
A = ap.parse_args(argv)
SP = A.species
WORK = os.path.expanduser(f'~/.cache/jurassic-terrarium/work/{SP}')
OUT = A.out or os.path.join(HERE, '..', '..', '..', 'demos', 'jurassic-terrarium', 'models')
stages = A.stages.split(',')
body = importlib.import_module(SP).build()
meta = body.meta
FACES = A.faces or meta.get('faces', 60000)
TEX = A.tex or meta.get('tex', 2048)
T0 = time.time()


def log(*a):
    print(f'[{SP} {time.time() - T0:6.1f}s]', *a, flush=True)


def mesh_np(ob):
    me = ob.data
    n = len(me.vertices)
    co = np.empty(n * 3, np.float32)
    me.vertices.foreach_get('co', co)
    no = np.empty(n * 3, np.float32)
    me.vertices.foreach_get('normal', no)
    return co.reshape(-1, 3).astype(np.float64), no.reshape(-1, 3).astype(np.float64)


def set_color_attr(ob, name, arr):
    me = ob.data
    if name in me.color_attributes:
        me.color_attributes.remove(me.color_attributes[name])
    at = me.color_attributes.new(name, 'FLOAT_COLOR', 'POINT')
    at.data.foreach_set('color', np.clip(arr, -1e3, 1e3).astype(np.float32).ravel())


def surface_attrs(P, N):
    """Material zones + pattern coordinates for animal-space points P with normals N."""
    sig = meta.get('tag_sigma', 0.012 * meta['length'] / 12.0 + 0.004)
    tagw, bones, detail = body.field.tag_weights(P, sigma=sig)
    T = sdf.TAG
    mA = np.stack([tagw[:, T['keratin']], tagw[:, T['mouth']], tagw[:, T['claw']], tagw[:, T['eye']]], 1)
    det = np.clip(detail, 0, 2) / 2
    mB = np.stack([tagw[:, T['osteo']], tagw[:, T['tooth']], tagw[:, T['feather']], det], 1)
    # countershading coordinate: around the axial loft where the body is, the surface normal elsewhere
    ax = [p for p in body.field.prims if p.name == 'axial'][0]
    j, t = ax._candidates(P, 1)
    j, t = j[:, 0], t[:, 0]
    tt = t[:, None]
    C = ax.S[j] * (1 - tt) + ax.S[j + 1] * tt
    Up = ax.Up[j] * (1 - tt) + ax.Up[j + 1] * tt
    V = ax.V[j] * (1 - tt) + ax.V[j + 1] * tt
    y = np.einsum('ij,ij->i', P - C, Up)
    h = np.where(y > 0, V[:, 1], V[:, 2])
    dl = np.clip(y / np.maximum(h, 1e-6), -1, 1)
    dax = ax.dist(P)
    w = np.exp(-np.maximum(dax, 0) / (0.08 * meta['length'] / 12))
    dn = np.clip(N[:, 2] * 1.2, -1, 1)
    dors = w * dl + (1 - w) * dn
    along = P[:, 0]
    accent = np.clip(body.field.last_accent, 0, 1)
    for c, r, s in meta.get('accent', []):
        q = (P - np.asarray(c)) / np.asarray(r)
        accent = np.maximum(accent, s * np.clip(1.2 - np.linalg.norm(q, axis=1), 0, 1))
    scalef = np.clip(w * meta.get('feature_on_body', 1.0) + (1 - w) * meta.get('feature_on_limbs', 0.35), 0, 1)
    pat = np.stack([dors, along, accent, scalef], 1)
    return mA, mB, pat, bones



REGION_OF_BONE = [('thigh', 'leg'), ('shin', 'leg'), ('meta', 'leg'), ('toe', 'foot'), ('upperarm', 'arm'),
                  ('forearm', 'arm'), ('hand', 'arm'), ('jaw', 'jaw'), ('head', 'head'), ('frill', 'head'),
                  ('wing', 'wing'), ('finger', 'wing')]
CAP_REGIONS = ('head', 'jaw', 'foot')


def prim_region(p):
    if p.region:
        return p.region
    inner = getattr(p, 'inner', None)
    if getattr(p, 'mirrored', False) and inner is not None:
        r = prim_region(inner)
        return r[:-2] + '.R' if r.endswith('.L') else r
    if inner is not None:
        return prim_region(inner)
    bones = getattr(p, 'chain', None) or ([p.bind] if isinstance(p.bind, int) else [])
    if not bones:
        return 'body'
    nm = body.skel.names[bones[0]]
    side = nm[-2:] if nm[-2:] in ('.L', '.R') else ''
    base = nm[:-2] if side else nm
    for key, reg in REGION_OF_BONE:
        if base.startswith(key):
            return reg + side
    return 'body'


def region_membership(P, sigma):
    names = []
    best = np.full(len(P), -1.0)
    lab = np.zeros(len(P), np.int64)
    for p in body.field.prims:
        if p.op != 'union':
            continue
        r = prim_region(p)
        if r not in names:
            names.append(r)
        ri = names.index(r)
        lo, hi = p.bbox()
        g = 8 * sigma + p.k
        m = np.all((P >= lo - g) & (P <= hi + g), axis=1)
        if not m.any():
            continue
        idx = np.nonzero(m)[0]
        w = np.exp(-np.maximum(p.dist(P[idx]), 0) / sigma)
        upd = w > best[idx]
        best[idx[upd]] = w[upd]
        lab[idx[upd]] = ri
    return names, lab


def main_loft(region):
    """The biggest loft of a tube-like region, used for its longitudinal seam."""
    best, bv = None, 0
    for p in body.field.prims:
        if p.op != 'union' or prim_region(p) != region:
            continue
        inner = p.inner if getattr(p, 'mirrored', False) else p
        if not isinstance(inner, sdf.Loft):
            continue
        lo, hi = inner.bbox()
        v = np.prod(hi - lo)
        if v > bv:
            best, bv = p, v
    return best


def tube_angle(p, P):
    """Angle around a loft at points P (0 = the loft's 'up', +-pi/2 = its side axis)."""
    mir = getattr(p, 'mirrored', False)
    lf = p.inner if mir else p
    Q = P.copy()
    if mir:
        Q[:, 1] = -Q[:, 1]
    j, t = lf._candidates(Q, 1)
    j, t = j[:, 0], t[:, 0]
    tt = t[:, None]
    C = lf.S[j] * (1 - tt) + lf.S[j + 1] * tt
    Sd = lf.Sd[j] * (1 - tt) + lf.Sd[j + 1] * tt
    Up = lf.Up[j] * (1 - tt) + lf.Up[j + 1] * tt
    x = np.einsum('ij,ij->i', Q - C, Sd)
    y = np.einsum('ij,ij->i', Q - C, Up)
    return np.arctan2(x, y)


def mark_seams(ob):
    """Seams on region borders, plus one longitudinal cut per tube region: the belly midline for the
    body, the inner (medial) side for limbs."""
    me = ob.data
    bm = bmesh.new()
    bm.from_mesh(me)
    bm.faces.ensure_lookup_table()
    fc = np.array([f.calc_center_median() for f in bm.faces])
    Pf = blib.blender_to_animal(fc)
    sig = 0.01 * meta['length'] / 12 + 0.004
    names, lab = region_membership(Pf, sig)
    split = meta.get('tail_split')
    if split is not None and 'body' in names:
        bi = names.index('body')
        names.append('tail')
        lab[(lab == bi) & (Pf[:, 0] < split)] = len(names) - 1
    cut_of = {}
    for ri, nm in enumerate(names):
        base = nm.split('.')[0]
        if base in CAP_REGIONS:
            continue
        lf = main_loft('body' if nm == 'tail' else nm)
        if lf is None:
            continue
        cut = math.pi if base in ('body', 'tail') else (-math.pi / 2)
        cut_of[ri] = (lf, cut)
    phi = np.zeros(len(Pf))
    for ri, (lf, cut) in cut_of.items():
        m = lab == ri
        if m.any():
            ang = tube_angle(lf, Pf[m])
            phi[m] = (ang - cut + math.pi) % (2 * math.pi) - math.pi  # 0 at the cut, +-pi opposite
    # cap regions (head, jaw) are split down the sagittal midline so the snout and chin don't stretch
    mid_cut = {ri for ri, nm in enumerate(names) if nm in ('head', 'jaw')}
    n_seam = 0
    for e in bm.edges:
        lf_ = e.link_faces
        if len(lf_) != 2:
            continue
        a, c = lf_[0].index, lf_[1].index
        if lab[a] != lab[c]:
            e.seam = True
            n_seam += 1
            continue
        if lab[a] in mid_cut and (Pf[a, 1] > 0) != (Pf[c, 1] > 0):
            e.seam = True
            n_seam += 1
            continue
        elif lab[a] in cut_of:
            # faces on opposite sides of the cut line, close to it
            if phi[a] * phi[c] < 0 and abs(phi[a]) < 1.2 and abs(phi[c]) < 1.2:
                e.seam = True
                n_seam += 1
    bm.to_mesh(me)
    bm.free()
    return names, lab, n_seam


# ------------------------------------------------------------------------------- stage: mesh
def stage_mesh():
    blib.reset_scene()
    high = blib.grid_mesh(WORK, name='sculpt')
    log('sculpt', len(high.data.vertices), 'verts')
    # game mesh: decimate a copy. Not symmetric: on the smooth SmoothLoft sculpts, symmetric collapse
    # folds triangles over (139 on the Brachiosaurus against 6 without), which bake to dark specks
    low = high.copy()
    low.data = high.data.copy()
    low.name = low.data.name = 'body'
    bpy.context.scene.collection.objects.link(low)
    dec = low.modifiers.new('dec', 'DECIMATE')
    dec.ratio = min(1.0, FACES / max(1, len(high.data.polygons) * 2))
    dec.use_symmetry = False
    bpy.context.view_layer.objects.active = low
    bpy.ops.object.modifier_apply(modifier='dec')
    log('game mesh', len(low.data.polygons), 'faces')
    # attributes on the sculpture
    co, no = mesh_np(high)
    P = blib.blender_to_animal(co)
    Nn = blib.blender_to_animal(no)
    mA, mB, pat, _ = surface_attrs(P, Nn)
    set_color_attr(high, 'mA', mA)
    set_color_attr(high, 'mB', mB)
    set_color_attr(high, 'pat', pat)
    # optional (meta 'fine_zone'): where the skin takes a finer scale pattern (e.g. a small head)
    if meta.get('fine_zone'):
        fine = np.zeros(len(P))
        for c, r, s in meta['fine_zone']:
            q = (P - np.asarray(c)) / np.asarray(r)
            fine = np.maximum(fine, s * np.clip(1.25 - np.linalg.norm(q, axis=1), 0, 1) * 2)
        fine = np.clip(fine, 0, 1)
        # optional (meta 'fine_mask'): parts inside the zone that keep their own surface. 'hard' = the
        # shader's smooth parts (keratin, mouth, claw, eye, osteo, tooth); 'accent' = display skin such
        # as a frill. (The shader's fine scales replace the relief outright, smooth mask included.)
        fm = meta.get('fine_mask', ())
        if 'hard' in fm:
            fine *= 1 - np.clip(mA.sum(1) + mB[:, 0] + mB[:, 1], 0, 1)
        if 'accent' in fm:
            fine *= 1 - np.clip(pat[:, 2] * 1.5, 0, 1)
        set_color_attr(high, 'mC', np.stack([fine, np.zeros_like(fine), np.zeros_like(fine), np.ones_like(fine)], 1))
    log('attributes')
    # UVs on the game mesh: anatomical seams, conformal unwrap, packed
    names, lab, ns = mark_seams(low)
    log('regions', names, 'seam edges', ns)
    bpy.ops.object.select_all(action='DESELECT')
    low.select_set(True)
    bpy.context.view_layer.objects.active = low
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.unwrap(method='CONFORMAL', margin=0.002)
    bpy.ops.uv.select_all(action='SELECT')
    bpy.ops.uv.average_islands_scale()
    bpy.ops.uv.pack_islands(rotate=True, rotate_method='ANY', scale=True, margin_method='SCALED', margin=0.004,
                            shape_method='CONCAVE')
    bpy.ops.object.mode_set(mode='OBJECT')
    log('uv')
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'mesh.blend'))


# ------------------------------------------------------------------------------- stage: bake
def stage_bake():
    bpy.ops.wm.open_mainfile(filepath=os.path.join(WORK, 'mesh.blend'))
    high = bpy.data.objects['sculpt']
    low = bpy.data.objects['body']
    src = material.skin_material(meta)
    high.data.materials.clear()
    high.data.materials.append(src)
    mat, imgs = material.bake_targets(low, TEX, f'{SP}_skin')
    L = meta['length']
    os.makedirs(os.path.join(WORK, 'tex'), exist_ok=True)
    material.bake(high, low, imgs, extrusion=0.012 * L / 12 + 0.01, ray=0.03 * L / 12 + 0.02,
                  save_dir=os.path.join(WORK, 'tex'))
    log('baked textures')
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'baked.blend'))



# ------------------------------------------------------------------------------- stage: rig
def stage_rig():
    bpy.ops.wm.open_mainfile(filepath=os.path.join(WORK, 'baked.blend'))
    high = bpy.data.objects.get('sculpt')
    if high:
        bpy.data.objects.remove(high, do_unlink=True)
    low = bpy.data.objects['body']
    arm = rigmod.make_armature(body)
    sig = meta.get('skin_sigma', 0.012 * meta['length'] / 12 + 0.004)
    rigmod.skin(body, low, arm, sig)
    log('skinned')
    rigmod.add_attachments(body, low, arm, meta)
    low = bpy.data.objects['body']
    log('attachments; materials', [m.name for m in low.data.materials])
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'rigged.blend'))


# ------------------------------------------------------------------------------- stage: anim
def stage_anim():
    bpy.ops.wm.open_mainfile(filepath=os.path.join(WORK, 'rigged.blend'))
    arm = bpy.data.objects['rig']
    R = anim.Rig(arm)
    kind = meta['gait']['kind']
    if kind == 'biped':
        gen = anim.Biped(R, meta)
    elif kind == 'flyer':
        gen = anim.Flyer(R, meta)
    else:
        gen = getattr(anim, meta['gait'].get('generator', 'Quadruped'))(R, meta)
    info = {}
    for name, frames, ci in gen.all():
        anim.key_clip(R, name, frames, loop=ci.get('loop', True))
        info[name] = {k: (round(v, 4) if isinstance(v, float) else v) for k, v in ci.items()}
        info[name]['frames'] = len(frames)
        log('clip', name, len(frames), 'frames', ci)
    json.dump(info, open(os.path.join(WORK, 'clips.json'), 'w'), indent=1)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'anim.blend'))


def build_skin_material(low):
    tex = os.path.join(WORK, 'tex')
    def load(kind, cs):
        im = bpy.data.images.load(os.path.join(tex, f'{kind}.png'), check_existing=False)
        im.colorspace_settings.name = cs
        im.reload()  # changing the colour space drops the pixel buffer; reload before reading it
        _ = im.pixels[0]
        return im
    col, nrm, rgh, ao = load('color', 'sRGB'), load('normal', 'Non-Color'), load('rough', 'Non-Color'), load('ao', 'Non-Color')
    # albedo *= mix(1, ao, 0.55): the occlusion of folds and pits survives at any lighting
    n = col.size[0] * col.size[1] * 4
    a = np.empty(n, np.float32); col.pixels.foreach_get(a)
    o = np.empty(n, np.float32); ao.pixels.foreach_get(o)
    a = a.reshape(-1, 4); o = o.reshape(-1, 4)
    assert a[:, :3].mean() > 0.01, 'albedo read back empty'
    a[:, :3] *= (1 - 0.55 * (1 - o[:, :1]))
    final = bpy.data.images.new(f'{SP}_albedo', col.size[0], col.size[1], alpha=False)
    # (setting a colour space after writing pixels regenerates the image blank: new images are sRGB)
    final.pixels.foreach_set(a.ravel())
    final.filepath_raw = os.path.join(tex, 'albedo.png')
    final.file_format = 'PNG'
    final.save()
    mat = bpy.data.materials.new(f'{SP}_skin')
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes['Principled BSDF']
    t1 = nt.nodes.new('ShaderNodeTexImage'); t1.image = final
    t2 = nt.nodes.new('ShaderNodeTexImage'); t2.image = nrm
    t3 = nt.nodes.new('ShaderNodeTexImage'); t3.image = rgh
    nm = nt.nodes.new('ShaderNodeNormalMap')
    sep = nt.nodes.new('ShaderNodeSeparateColor')
    nt.links.new(t1.outputs['Color'], bsdf.inputs['Base Color'])
    nt.links.new(t2.outputs['Color'], nm.inputs['Color'])
    nt.links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])
    nt.links.new(t3.outputs['Color'], sep.inputs[0])
    nt.links.new(sep.outputs[1], bsdf.inputs['Roughness'])  # glTF reads roughness from G
    bsdf.inputs['Specular IOR Level'].default_value = 0.45
    low.data.materials[0] = mat
    return mat


# ------------------------------------------------------------------------------- stage: export
def stage_export():
    bpy.ops.wm.open_mainfile(filepath=os.path.join(WORK, 'anim.blend'))
    low = bpy.data.objects['body']
    arm = bpy.data.objects['rig']
    build_skin_material(low)
    os.makedirs(OUT, exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    low.select_set(True)
    arm.select_set(True)
    bpy.context.view_layer.objects.active = arm
    path = os.path.join(OUT, f'{SP}.glb')
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_animations=True,
                              export_animation_mode='NLA_TRACKS', export_skins=True, export_morph=False,
                              export_yup=True, export_apply=False, export_image_format='WEBP',
                              export_image_quality=88, export_texcoords=True, export_normals=True,
                              export_tangents=False, export_materials='EXPORT', export_extras=False,
                              export_optimize_animation_size=True, export_anim_single_armature=True)
    log('exported', path, os.path.getsize(path) // 1024, 'KB')
    clips = json.load(open(os.path.join(WORK, 'clips.json')))
    side = dict(id=SP, name=meta['name'], common=meta.get('common', meta['name']), length=meta['length'],
                mass_t=meta.get('mass_t'), height=float(max(h[2] for h in body.skel.head)),
                clips=clips, behaviour=meta.get('behaviour', {}), facts=meta.get('facts', []))
    json.dump(side, open(os.path.join(OUT, f'{SP}.json'), 'w'), indent=1)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(WORK, 'final.blend'))


# ------------------------------------------------------------------------------- stage: render
def stage_render():
    """Cycles 'museum plate': side view on a pale studio background, plus a three-quarter view, with
    the game mesh posed in a clip frame (default: idle frame 1)."""
    bpy.ops.wm.open_mainfile(filepath=os.path.join(WORK, 'final.blend'))
    scn = bpy.context.scene
    arm = bpy.data.objects['rig']
    clip = os.environ.get('POSE_CLIP', 'idle')
    frame = int(os.environ.get('POSE_FRAME', '1'))
    act = bpy.data.actions.get(clip)
    if act:
        arm.animation_data_create()
        for tr in arm.animation_data.nla_tracks:
            tr.mute = True
        arm.animation_data.action = act
        scn.frame_set(frame)
    scn.render.engine = 'CYCLES'
    scn.cycles.samples = int(os.environ.get('SPP', '64'))
    scn.cycles.use_denoising = True
    scn.render.resolution_x, scn.render.resolution_y = 1600, 900
    world = bpy.data.worlds.new('w'); scn.world = world
    world.use_nodes = True
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.75, 0.75, 0.76, 1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.55
    # ground + soft key light
    bpy.ops.mesh.primitive_plane_add(size=200)
    gnd = bpy.context.object
    gm = bpy.data.materials.new('ground'); gm.use_nodes = True
    gm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.62, 0.62, 0.63, 1)
    gnd.data.materials.append(gm)
    L = meta['length']
    key = bpy.data.lights.new('key', 'AREA'); key.energy = 4000 * (L / 12) ** 2; key.size = L * 0.8
    ko = bpy.data.objects.new('key', key); scn.collection.objects.link(ko)
    ko.location = (L * 0.6, -L * 0.5, L * 0.9); anim_look(ko, (0, 0, 1.5))
    rim = bpy.data.lights.new('rim', 'AREA'); rim.energy = 1500 * (L / 12) ** 2; rim.size = L * 0.5
    ro = bpy.data.objects.new('rim', rim); scn.collection.objects.link(ro)
    ro.location = (-L * 0.7, L * 0.6, L * 0.6); anim_look(ro, (0, 0, 1.5))
    low = bpy.data.objects['body']
    os.makedirs(os.path.join(WORK, 'render'), exist_ok=True)
    if os.environ.get('RENDER_HEAD'):
        # close-up of the head from the front-left, three-quarter view
        bpy.context.view_layer.update()
        hb = arm.pose.bones['head']
        hp = arm.matrix_world @ hb.head
        tp = arm.matrix_world @ hb.tail
        ctr = hp * 0.45 + tp * 0.55
        cam_data = bpy.data.cameras.new('hc'); cam_data.lens = 85
        cam = bpy.data.objects.new('hc', cam_data); scn.collection.objects.link(cam); scn.camera = cam
        d = (tp - hp).length
        cam.location = ctr + Vector((d * 2.6, -d * 2.4, d * 0.9))
        anim_look(cam, ctr)
        scn.render.resolution_x, scn.render.resolution_y = 1200, 900
        scn.render.filepath = os.path.join(WORK, 'render', f'{SP}-{clip}{frame}-head.png')
        bpy.ops.render.render(write_still=True)
    else:
        blib.preview([low], os.path.join(WORK, 'render', f'{SP}-{clip}{frame}'), views=('side', 'three'),
                     engine='cycles')
    log('rendered')


def anim_look(ob, target):
    d = Vector(target) - ob.location
    ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


if 'mesh' in stages:
    stage_mesh()
if 'bake' in stages:
    stage_bake()
if 'rig' in stages:
    stage_rig()
if 'anim' in stages:
    stage_anim()
if 'export' in stages:
    stage_export()
if 'render' in stages:
    stage_render()
log('done')
