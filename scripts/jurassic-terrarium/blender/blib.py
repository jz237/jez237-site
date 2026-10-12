"""Blender helpers: grid -> mesh, preview renders. Imported by the Blender-side scripts."""
import os, json, math
import numpy as np
import bpy
import bmesh
from mathutils import Vector, Matrix


def animal_to_blender(P):
    """(a forward, s left, u up) -> Blender (X = s, Y = -a, Z = u): the animal faces -Y, which the
    glTF exporter turns into +Z (Three.js 'forward' for lookAt)."""
    P = np.asarray(P, dtype=np.float64)
    return np.stack([P[..., 1], -P[..., 0], P[..., 2]], axis=-1)


def blender_to_animal(P):
    P = np.asarray(P, dtype=np.float64)
    return np.stack([-P[..., 1], P[..., 0], P[..., 2]], axis=-1)


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def grid_mesh(work, name='body', smooth_iters=0):
    import openvdb as vdb
    g = json.load(open(os.path.join(work, 'grid.json')))
    arr = np.load(os.path.join(work, 'grid.npy')).astype(np.float32)
    voxel = g['voxel']
    grid = vdb.FloatGrid(background=float(4 * voxel))
    # distances in voxel units so the iso surface is crisp; clamp the band to keep memory small
    a = np.clip(arr / voxel, -4.0, 4.0)
    grid.copyFromArray(a, tolerance=0.0)
    grid.prune(tolerance=0.0)
    pts, quads = grid.convertToQuads(isovalue=0.0)
    del grid, a, arr
    P = np.asarray(pts, dtype=np.float64) * voxel + np.asarray(g['origin'])
    V = animal_to_blender(P)
    F = np.asarray(quads, dtype=np.int64)
    me = bpy.data.meshes.new(name)
    me.vertices.add(len(V))
    me.vertices.foreach_set('co', V.astype(np.float32).ravel())
    me.loops.add(F.size)
    me.loops.foreach_set('vertex_index', F.ravel().astype(np.int32))
    me.polygons.add(len(F))
    me.polygons.foreach_set('loop_start', (np.arange(len(F)) * 4).astype(np.int32))
    me.update(calc_edges=True)
    me.validate()
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    # keep the biggest connected piece(s): drop tiny islands from numeric noise
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    islands = []
    seen = set()
    for f in bm.faces:
        if f.index in seen:
            continue
        stack, isl = [f], []
        seen.add(f.index)
        while stack:
            x = stack.pop()
            isl.append(x)
            for e in x.edges:
                for y in e.link_faces:
                    if y.index not in seen:
                        seen.add(y.index)
                        stack.append(y)
        islands.append(isl)
    islands.sort(key=len, reverse=True)
    drop = [f for isl in islands[1:] if len(isl) < 0.002 * len(islands[0]) for f in isl]
    if drop:
        bmesh.ops.delete(bm, geom=drop, context='FACES')
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    if smooth_iters:
        mod = ob.modifiers.new('smooth', 'SMOOTH')
        mod.iterations = smooth_iters
        mod.factor = 0.5
    return ob


def look_at(cam, target):
    d = Vector(target) - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()


def preview(objs, out_prefix, views=('side', 'three', 'front', 'top'), res=(1600, 900), engine='workbench',
            ortho_pad=1.08, studio=True):
    """Render quick shape-check views of objs (animal faces -Y)."""
    scn = bpy.context.scene
    lo = np.array([np.inf] * 3)
    hi = -lo
    for ob in objs:
        for c in ob.bound_box:
            w = ob.matrix_world @ Vector(c)
            lo = np.minimum(lo, w)
            hi = np.maximum(hi, w)
    ctr = (lo + hi) / 2
    size = hi - lo
    cam_data = bpy.data.cameras.new('cam')
    cam = bpy.data.objects.new('cam', cam_data)
    scn.collection.objects.link(cam)
    scn.camera = cam
    scn.render.resolution_x, scn.render.resolution_y = res
    scn.render.film_transparent = False
    if engine == 'workbench':
        scn.render.engine = 'BLENDER_WORKBENCH'
        sh = scn.display.shading
        sh.light = 'STUDIO'
        sh.color_type = 'SINGLE'
        sh.single_color = (0.62, 0.58, 0.52)
        sh.show_cavity = True
        sh.cavity_type = 'BOTH'
        sh.curvature_ridge_factor = 1.0
        sh.show_shadows = True
        sh.show_specular_highlight = True
    outs = []
    aspect = res[0] / res[1]
    for v in views:
        if v == 'side':  # animal's left side: camera on +X looking -X; snout (-Y) on the left of frame
            cam.location = (ctr[0] + 40, ctr[1], ctr[2])
            cam_data.type = 'ORTHO'
            cam_data.ortho_scale = max(size[1], size[2] * aspect) * ortho_pad
        elif v == 'top':
            cam.location = (ctr[0], ctr[1], ctr[2] + 40)
            cam_data.type = 'ORTHO'
            cam_data.ortho_scale = max(size[1], size[0] * aspect) * ortho_pad
        elif v == 'front':
            cam.location = (ctr[0], ctr[1] - 40, ctr[2])
            cam_data.type = 'ORTHO'
            cam_data.ortho_scale = max(size[0], size[2] * aspect) * ortho_pad
        else:  # three-quarter from the front-left, perspective
            r = max(size) * 1.25
            cam.location = (ctr[0] + r * 0.62, ctr[1] - r * 0.78, ctr[2] + r * 0.18)
            cam_data.type = 'PERSP'
            cam_data.lens = 50
        cam_data.clip_end = 500
        if v == 'top':
            cam.rotation_euler = (0, 0, math.radians(90))
        else:
            look_at(cam, ctr)
        path = f'{out_prefix}-{v}.png'
        scn.render.filepath = path
        bpy.ops.render.render(write_still=True)
        outs.append(path)
    bpy.data.objects.remove(cam)
    return outs
