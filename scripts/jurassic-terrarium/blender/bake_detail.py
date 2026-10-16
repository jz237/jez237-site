"""Sculpted anatomical detail, rebaked into a finished species without rebuilding its rig or animation.

    blender -b -P bake_detail.py -- <species>

On the high-res sculpture (work/<species>/mesh.blend) this works out an 'anat' attribute from the
skeleton: skin folds round every joint (neck, shoulders, elbows, wrists, hips, knees, ankles, tail root)
with the distance along the joint's bone for the creases; muscle masses on the flanks, thighs, upper arms
and neck; a ridge of keeled scutes down the spine. The skin material (material.py) turns these into relief.
It bakes a new normal map and a crevice map, darkens the exported albedo in the crevices (so the folds
read at any distance, not only under raking light), and writes both as WebP for tools/swap-skin.mjs to
put into the species' GLB in place of the old ones.
"""
import sys, os, importlib, time
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, 'species')]
import numpy as np
import bpy
import material

SP = sys.argv[sys.argv.index('--') + 1]
WORK = os.path.expanduser(f'~/.cache/jurassic-terrarium/work/{SP}')
body = importlib.import_module(SP).build()
meta = body.meta
L = meta['length']
T0 = time.time()


def log(*a):
    print(f'[{SP} detail {time.time() - T0:6.1f}s]', *a, flush=True)


def color_attr(me, name):
    a = me.color_attributes[name]
    v = np.empty(len(a.data) * 4, np.float32)
    a.data.foreach_get('color', v)
    return v.reshape(-1, 4)


def seg_closest(P, a, b):
    ab = b - a
    t = np.clip(((P - a) @ ab) / max(ab @ ab, 1e-9), 0, 1)
    C = a + t[:, None] * ab
    return C, t


bpy.ops.wm.open_mainfile(filepath=os.path.join(WORK, 'mesh.blend'))
high = bpy.data.objects['sculpt']
low = bpy.data.objects['body']
me = high.data
n = len(me.vertices)
P = np.empty(n * 3, np.float32); me.vertices.foreach_get('co', P); P = P.reshape(-1, 3).astype(np.float64)
N = np.empty(n * 3, np.float32); me.vertices.foreach_get('normal', N); N = N.reshape(-1, 3).astype(np.float64)
mA, mB = color_attr(me, 'mA'), color_attr(me, 'mB')
hard = np.clip(mA[:, 0] + mA[:, 1] + mA[:, 2] + mA[:, 3] + mB[:, 0] + mB[:, 1], 0, 1)  # keratin mouth claw eye osteo tooth
log('verts', n)

S = body.skel
H = np.array(S.head, float)
Tl = np.array(S.tail, float)
names = S.names
blen = np.linalg.norm(Tl - H, axis=1)
up = np.array([0.0, 0.0, 1.0])

# nearest bone (segment) for every vertex
best = np.full(n, 1e9)
bi = np.zeros(n, int)
for i in range(len(names)):
    if blen[i] < 1e-6:
        continue
    C, _ = seg_closest(P, H[i], Tl[i])
    d = np.linalg.norm(P - C, axis=1)
    m = d < best
    best[m] = d[m]
    bi[m] = i
base = lambda nm: nm[:-2] if nm[-2:] in ('.L', '.R') else nm

# folds round the joints: the head of each bone where it meets its parent
fmask = np.zeros(n)
fphase = np.zeros(n)
JOINT = ('neck', 'head', 'upperarm', 'forearm', 'hand', 'thigh', 'shin', 'meta', 'tail1')
for i, nm in enumerate(names):
    b = base(nm)
    if not any(b.startswith(k) for k in JOINT) or blen[i] < 1e-6:
        continue
    ax = (Tl[i] - H[i]) / blen[i]
    r = np.clip(0.5 * blen[i], 0.025 * L, 0.11 * L)
    d = np.linalg.norm(P - H[i], axis=1)
    w = np.exp(-(d / r) ** 2)
    m = w > fmask
    fmask[m] = w[m]
    fphase[m] = ((P[m] - H[i]) @ ax)
fmask *= (1 - hard)
log('folds', float((fmask > 0.3).mean()))

# muscle masses: the sides of the thighs, upper arms, shins, trunk and neck
MUS = ('thigh', 'upperarm', 'shin', 'spine', 'pelvis', 'neck', 'forearm')
inset = np.array([any(base(names[i]).startswith(k) for k in MUS) for i in range(len(names))])[bi]
side = 1 - np.abs(N @ up)
mmask = inset * np.clip((side - 0.2) / 0.6, 0, 1) ** 0.8 * (1 - hard)

# a ridge of scutes down the spine, neck and the first half of the tail
ridge = np.zeros(n)
RID = [i for i, nm in enumerate(names) if base(nm).startswith(('spine', 'neck', 'pelvis')) or nm in ('tail1', 'tail2', 'tail3')]
w0 = 0.022 * L
for i in RID:
    if blen[i] < 1e-6:
        continue
    ax = (Tl[i] - H[i]) / blen[i]
    C, t = seg_closest(P, H[i], Tl[i])
    o = P - C
    sd = np.cross(ax, up)
    sl = np.linalg.norm(sd)
    if sl < 1e-6:
        continue
    sd /= sl
    lat = np.abs(o @ sd)
    rr = np.exp(-(lat / w0) ** 2) * np.clip((N @ up - 0.55) / 0.35, 0, 1) * (o @ up > 0)
    ridge = np.maximum(ridge, rr)
ridge *= (1 - hard) * meta.get('scales', {}).get('ridge_on', 1.0)
log('ridge', float((ridge > 0.3).mean()), 'muscle', float((mmask > 0.3).mean()))

anat = np.stack([fmask, fphase, mmask, ridge], 1).astype(np.float32)
if 'anat' in me.color_attributes:
    me.color_attributes.remove(me.color_attributes['anat'])
at = me.color_attributes.new('anat', 'FLOAT_COLOR', 'POINT')
at.data.foreach_set('color', anat.ravel())

# bake: the new normal map, then the crevices as emission
src = material.skin_material(meta)
high.data.materials.clear()
high.data.materials.append(src)
alb_path = os.path.join(WORK, 'tex', 'albedo.png')
alb = bpy.data.images.load(alb_path, check_existing=False)
size = alb.size[0]
mat, imgs = material.bake_targets(low, size, f'{SP}_detail')
cav_im = bpy.data.images.new(f'{SP}_cav', size, size, alpha=False, float_buffer=False)
cav_im.colorspace_settings.name = 'Non-Color'
cnd = low.data.materials[0].node_tree.nodes.new('ShaderNodeTexImage')
cnd.image = cav_im
imgs['cav'] = (cav_im, cnd)
ext, ray = 0.012 * L / 12 + 0.01, 0.03 * L / 12 + 0.02
material.bake(high, low, imgs, extrusion=ext, ray=ray, kinds=('normal',))
log('baked normal')
bsdf = src.node_tree.nodes['Principled BSDF']
bsdf.inputs['Emission Strength'].default_value = 1.0
scn = bpy.context.scene
for nd in low.data.materials[0].node_tree.nodes:
    nd.select = False
cnd.select = True
low.data.materials[0].node_tree.nodes.active = cnd
scn.cycles.samples = 2
bpy.ops.object.bake(type='EMIT', use_selected_to_active=True, cage_extrusion=ext, max_ray_distance=ray, margin=12)
log('baked crevices')

# write PNGs (no colour management on the way out); tools/swap-skin.mjs converts and swaps them in
out = os.path.join(WORK, 'tex')
nrm = imgs['normal'][0]
nrm.filepath_raw = os.path.join(out, 'normal_detail.png')
nrm.file_format = 'PNG'
nrm.save()
a = np.empty(size * size * 4, np.float32); alb.pixels.foreach_get(a); a = a.reshape(-1, 4)
c = np.empty(size * size * 4, np.float32); cav_im.pixels.foreach_get(c); c = c.reshape(-1, 4)
log('crevice coverage', float((c[:, 0] > 0.3).mean()))
a[:, :3] *= (1 - meta.get('scales', {}).get('crease_dark', 0.42) * np.clip(c[:, :1], 0, 1))
fin = bpy.data.images.new(f'{SP}_albedo_detail', size, size, alpha=False)
fin.pixels.foreach_set(a.ravel())
fin.filepath_raw = os.path.join(out, 'albedo_detail.png')
fin.file_format = 'PNG'
fin.save()
log('wrote', out)
