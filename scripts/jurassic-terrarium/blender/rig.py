"""Armature, skin weights and rigid attachments (eyes, teeth) for a species' game mesh."""
import math
import numpy as np
import bpy
import bmesh
from mathutils import Vector, Matrix, Quaternion
import blib

C3 = np.array([[0, 1, 0], [-1, 0, 0], [0, 0, 1]], dtype=np.float64)  # animal -> blender


def a2b(v):
    return Vector(blib.animal_to_blender(np.asarray(v, float)))


def make_armature(body, name='rig'):
    arm = bpy.data.armatures.new(name)
    ob = bpy.data.objects.new(name, arm)
    bpy.context.scene.collection.objects.link(ob)
    bpy.context.view_layer.objects.active = ob
    bpy.ops.object.select_all(action='DESELECT')
    ob.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    sk = body.skel
    ebs = []
    for i, nm in enumerate(sk.names):
        eb = arm.edit_bones.new(nm)
        eb.head = a2b(sk.head[i])
        eb.tail = a2b(sk.tail[i])
        ebs.append(eb)
    for i, eb in enumerate(ebs):
        p = sk.parent[i]
        if p >= 0:
            eb.parent = ebs[p]
            eb.use_connect = False
        eb.align_roll(a2b(sk.zhint[i]))
        eb.use_deform = True
    bpy.ops.object.mode_set(mode='OBJECT')
    for pb in ob.pose.bones:
        pb.rotation_mode = 'QUATERNION'
    return ob


def skin(body, mesh_ob, arm_ob, sigma, max_inf=4):
    """Vertex groups from the field's bone bindings (top max_inf influences, normalised)."""
    me = mesh_ob.data
    n = len(me.vertices)
    co = np.empty(n * 3, np.float32)
    me.vertices.foreach_get('co', co)
    P = blib.blender_to_animal(co.reshape(-1, 3).astype(np.float64))
    _, bones, _ = body.field.tag_weights(P, sigma=sigma)
    names = body.skel.names
    nb = len(names)
    W = np.zeros((n, nb))
    for bi, w in bones.items():
        W[:, bi] += w
    # vertices with no binding at all (shouldn't happen) go to the nearest bone
    lost = W.sum(1) <= 1e-9
    if lost.any():
        mids = np.array([0.5 * (h + t) for h, t in zip(body.skel.head, body.skel.tail)])
        d = np.linalg.norm(P[lost][:, None, :] - mids[None], axis=2)
        W[np.nonzero(lost)[0], np.argmin(d, axis=1)] = 1.0
    # keep the strongest influences
    order = np.argsort(-W, axis=1)[:, :max_inf]
    rows = np.arange(n)[:, None]
    top = W[rows, order]
    top = np.where(top < 0.02 * top[:, :1], 0, top)
    top /= np.maximum(top.sum(1, keepdims=True), 1e-12)
    for nm in names:
        if nm not in mesh_ob.vertex_groups:
            mesh_ob.vertex_groups.new(name=nm)
    groups = [mesh_ob.vertex_groups[nm] for nm in names]
    for k in range(max_inf):
        bi = order[:, k]
        wk = top[:, k]
        for b in np.unique(bi):
            sel = np.nonzero((bi == b) & (wk > 0))[0]
            if len(sel) == 0:
                continue
            # group by weight value is slow; add one by one in chunks
            g = groups[b]
            for v, w in zip(sel.tolist(), wk[sel].tolist()):
                g.add([v], w, 'REPLACE')
    mod = mesh_ob.modifiers.new('rig', 'ARMATURE')
    mod.object = arm_ob
    mesh_ob.parent = arm_ob
    return W


def _orient(from_axis, to_vec):
    return Vector(from_axis).rotation_difference(Vector(to_vec).normalized())


def iris_image(name, iris_rgb, pupil='round', size=256, sclera=(0.06, 0.04, 0.03)):
    """Equirectangular texture for a UV sphere whose +Z pole looks out of the head."""
    v, u = np.mgrid[0:size, 0:size]
    lat = (v + 0.5) / size * math.pi - math.pi / 2  # -pi/2 (bottom) .. pi/2 (top pole)
    lon = (u + 0.5) / size * 2 * math.pi
    r = (math.pi / 2 - lat)  # angular distance from the pole
    iris_r = 0.95
    pup_r = 0.16
    # pupil shape: round or vertical slit (squash across longitude)
    x = r * np.cos(lon)
    y = r * np.sin(lon)
    if pupil == 'slit':
        pmask = (x / (pup_r * 0.35)) ** 2 + (y / (pup_r * 1.4)) ** 2 < 1
    else:
        pmask = r < pup_r
    rng = np.random.default_rng(7)
    fib = 0.8 + 0.2 * np.sin(lon * 70 + rng.normal(0, 0.5, lon.shape)) * np.exp(-((r - 0.5) ** 2) / 0.08)
    fib = fib * (1.0 - 0.35 * np.clip((r - 0.2) / 0.75, 0, 1))  # warmer, brighter round the pupil
    base = np.array(iris_rgb)[None, None, :] * fib[..., None]
    ring = np.clip((r - iris_r * 0.82) / (iris_r * 0.18), 0, 1)[..., None]
    base = base * (1 - 0.65 * ring)
    col = np.where((r < iris_r)[..., None], base, np.array(sclera)[None, None, :])
    col = np.where(pmask[..., None], np.array([0.01, 0.01, 0.012])[None, None, :], col)
    img = bpy.data.images.new(name, size, size, alpha=False)
    rgba = np.concatenate([col, np.ones((size, size, 1))], axis=2).astype(np.float32)
    img.pixels.foreach_set(rgba.ravel())
    img.pack()
    return img


def simple_material(name, rgb, rough=0.5, image=None, clearcoat=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*rgb, 1)
    bsdf.inputs['Roughness'].default_value = rough
    if clearcoat:
        bsdf.inputs['Coat Weight'].default_value = clearcoat
    if image is not None:
        tex = mat.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image = image
        mat.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    return mat


def add_attachments(body, mesh_ob, arm_ob, meta):
    """Eyes and teeth as extra geometry in the body mesh, rigidly skinned to one bone each."""
    sk = body.skel
    bm = bmesh.new()
    bm.loops.layers.uv.verify()  # primitives only write UVs into an existing layer
    pieces = []  # (bmesh verts list, bone name, material index)
    mats = []

    def mat_index(m):
        if m.name not in [x.name for x in mesh_ob.data.materials]:
            mesh_ob.data.materials.append(m)
        return [x.name for x in mesh_ob.data.materials].index(m.name)

    tooth_mat = None
    for att in body.attachments:
        if att['kind'] == 'eye':
            if 'eye_mat' not in locals():
                eye_mat = simple_material(f'{body.name}_eye', (1, 1, 1), 0.08,
                                          image=iris_image(f'{body.name}_iris', att.get('iris', [0.7, 0.5, 0.2]),
                                                           att.get('pupil', 'round')), clearcoat=1.0)
            mi = mat_index(eye_mat)
            ret = bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=16, radius=att['radius'],
                                            calc_uvs=True)
            vs = ret['verts']
            q = _orient((0, 0, 1), a2b(att['look']))
            M = Matrix.Translation(a2b(att['center'])) @ q.to_matrix().to_4x4()
            bmesh.ops.transform(bm, matrix=M, verts=vs)
            pieces.append((vs, att['bone'], mi))
        elif att['kind'] == 'teeth':
            if tooth_mat is None:
                tooth_mat = simple_material(f'{body.name}_tooth', (0.78, 0.72, 0.58), 0.35)
            mi = mat_index(tooth_mat)
            for t in att['items']:
                ret = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=True, segments=8,
                                            radius1=t['radius'], radius2=t['radius'] * 0.12, depth=t['length'],
                                            calc_uvs=True)
                vs = ret['verts']
                # cone is centred on the origin along Z: move its base to z = 0
                for v in vs:
                    v.co.z += t['length'] / 2
                q = _orient((0, 0, 1), a2b(t['dir']))
                M = Matrix.Translation(a2b(t['base'])) @ q.to_matrix().to_4x4()
                bmesh.ops.transform(bm, matrix=M, verts=vs)
                pieces.append((vs, t['bone'], mi))
    if not pieces:
        bm.free()
        return
    # material indices per face
    vmap = {}
    for vs, bone, mi in pieces:
        for v in vs:
            vmap[v] = (bone, mi)
    for f in bm.faces:
        f.material_index = vmap[f.verts[0]][1]
        f.smooth = True
    tmp = bpy.data.meshes.new('att')
    bm.to_mesh(tmp)
    order = [vmap[v][0] for v in bm.verts]
    bm.free()
    tob = bpy.data.objects.new('att', tmp)
    bpy.context.scene.collection.objects.link(tob)
    # material slots must match the body's so the indices survive the join
    for m in mesh_ob.data.materials:
        tmp.materials.append(m)
    # UV layer name must match for the join
    if tmp.uv_layers and mesh_ob.data.uv_layers:
        tmp.uv_layers[0].name = mesh_ob.data.uv_layers[0].name
    for nm in sk.names:
        tob.vertex_groups.new(name=nm)
    for i, bone in enumerate(order):
        tob.vertex_groups[bone].add([i], 1.0, 'REPLACE')
    bpy.ops.object.select_all(action='DESELECT')
    tob.select_set(True)
    mesh_ob.select_set(True)
    bpy.context.view_layer.objects.active = mesh_ob
    bpy.ops.object.join()
