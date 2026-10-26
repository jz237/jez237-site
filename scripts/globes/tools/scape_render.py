# Blender side of tools/scape-preview.mjs: imports the furnishings' OBJ (y up, the bowl's frame) into
# a stand-in of the betta bowl (its sand bed, optionally its glass, a blue studio and a top light
# like the lid's) and renders it with Cycles from the views asked for.
#   blender -b --factory-startup -P scape_render.py -- <obj> <out-dir> <views> <glass 0|1> <samples> <WxH> <bed level> <bed radius>
import math
import os
import sys

import bmesh
import bpy
from mathutils import Vector

obj_path, out_dir, views, glass, samples, size, bed_level, bed_radius = sys.argv[sys.argv.index('--') + 1:]
glass = glass == '1'
width, height = (int(x) for x in size.split('x'))
bed_level = float(bed_level)
bed_radius = float(bed_radius)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# (Our frame is y up; Blender's z up: (x, y, z) -> (x, -z, y).)
def B(x, y, z):
    return Vector((x, -z, y))


# ---- materials --------------------------------------------------------------------------------
COLOURS = {
    1: ((0.20, 0.11, 0.05), 0.75, 0.0),   # bark
    2: ((0.42, 0.30, 0.18), 0.7, 0.0),    # broken wood
    3: ((0.10, 0.10, 0.10), 0.55, 0.0),   # rock
    4: ((0.22, 0.55, 0.06), 0.35, 0.35),  # big leaves
    5: ((0.20, 0.50, 0.07), 0.35, 0.35),  # small leaves
    6: ((0.17, 0.38, 0.06), 0.4, 0.15),   # stems
    7: ((0.25, 0.22, 0.12), 0.7, 0.0),    # roots
    8: ((0.02, 0.02, 0.022), 0.4, 0.0),   # the heater's plastic
    9: ((0.9, 0.35, 0.04), 0.15, 0.0),    # its light
    10: ((0.035, 0.035, 0.035), 0.95, 0.0),  # the filter's sponge
    11: ((0.025, 0.025, 0.027), 0.35, 0.0),  # its tubing and base
    12: ((0.55, 0.6, 0.58), 0.3, 0.3),    # the suction cups and clips
}


def make_material(name, colour, rough, translucent, use_vc=True):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (*colour, 1)
    bsdf.inputs['Roughness'].default_value = rough
    out = nt.nodes['Material Output']
    shader = bsdf
    if use_vc:
        attr = nt.nodes.new('ShaderNodeVertexColor')
        attr.layer_name = 'Color'
        mix = nt.nodes.new('ShaderNodeMix')
        mix.data_type = 'RGBA'
        mix.blend_type = 'MULTIPLY'
        mix.inputs['Factor'].default_value = 1.0
        mix.inputs[6].default_value = (*colour, 1)
        nt.links.new(attr.outputs['Color'], mix.inputs[7])
        nt.links.new(mix.outputs[2], bsdf.inputs['Base Color'])
    if translucent > 0:
        tr = nt.nodes.new('ShaderNodeBsdfTranslucent')
        tr.inputs['Color'].default_value = (colour[0] * 1.6, colour[1] * 1.6, colour[2] * 1.2, 1)
        mixs = nt.nodes.new('ShaderNodeMixShader')
        mixs.inputs[0].default_value = translucent
        nt.links.new(bsdf.outputs[0], mixs.inputs[1])
        nt.links.new(tr.outputs[0], mixs.inputs[2])
        shader = mixs
    nt.links.new(shader.outputs[0], out.inputs['Surface'])
    return m


bpy.ops.wm.obj_import(filepath=obj_path, forward_axis='NEGATIVE_Z', up_axis='Y')
for ob in list(scene.objects):
    if ob.type != 'MESH':
        continue
    for slot in ob.material_slots:
        if slot.material and slot.material.name.startswith('mat_'):
            k = int(slot.material.name.split('_')[1].split('.')[0])
            c, r, t = COLOURS.get(k, ((0.8, 0.0, 0.8), 0.5, 0.0))
            slot.material = make_material(f'scape_{k}', c, r, t)
    for poly in ob.data.polygons:
        poly.use_smooth = True

# ---- the bowl ---------------------------------------------------------------------------------
def sphere_part(name, radius, keep_below=None, keep_above=None):
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=128, v_segments=64, radius=radius)
    if keep_below is not None:
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        res = bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, keep_below), plane_no=(0, 0, 1), clear_outer=True)
        edges = [e for e in res['geom_cut'] if isinstance(e, bmesh.types.BMEdge)]
        bmesh.ops.edgeloop_fill(bm, edges=edges)
    if keep_above is not None:
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        bmesh.ops.bisect_plane(bm, geom=geom, plane_co=(0, 0, keep_above), plane_no=(0, 0, 1), clear_inner=True)
    bm.to_mesh(me)
    bm.free()
    ob = bpy.data.objects.new(name, me)
    scene.collection.objects.link(ob)
    for poly in me.polygons:
        poly.use_smooth = True
    return ob


sand = sphere_part('sand', 0.9905, keep_below=bed_level)
sand.data.materials.append(make_material('sand', (0.76, 0.62, 0.40), 0.9, 0.0, use_vc=False))
if glass:
    shell = sphere_part('glass', 1.0, keep_above=None)
    gm = bpy.data.materials.new('glass')
    gm.use_nodes = True
    nt = gm.node_tree
    nt.nodes.remove(nt.nodes['Principled BSDF'])
    g = nt.nodes.new('ShaderNodeBsdfGlass')
    g.inputs['IOR'].default_value = 1.33
    g.inputs['Roughness'].default_value = 0.0
    tp = nt.nodes.new('ShaderNodeBsdfTransparent')
    mx = nt.nodes.new('ShaderNodeMixShader')
    mx.inputs[0].default_value = 0.15
    nt.links.new(tp.outputs[0], mx.inputs[1])
    nt.links.new(g.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], nt.nodes['Material Output'].inputs['Surface'])
    shell.data.materials.append(gm)

# ---- the studio -------------------------------------------------------------------------------
world = bpy.data.worlds.new('studio')
scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.03, 0.12, 0.22, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.7


def light(name, kind, loc, energy, size=0.3, colour=(1, 0.95, 0.85), aim=None):
    ld = bpy.data.lights.new(name, kind)
    ld.energy = energy
    ld.color = colour
    if kind == 'AREA':
        ld.size = size
    ob = bpy.data.objects.new(name, ld)
    ob.location = loc
    scene.collection.objects.link(ob)
    if aim is not None:
        d = aim - ob.location
        ob.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return ob


light('lid', 'AREA', B(0, 0.95, 0), 22, size=0.35, aim=B(0, -1, 0))
light('key', 'AREA', B(-2.5, 2.5, 3.0), 70, size=2.0, colour=(0.9, 0.95, 1.0), aim=B(0, -0.4, 0))
light('fill', 'AREA', B(3.0, 0.5, 2.0), 18, size=2.0, colour=(0.7, 0.85, 1.0), aim=B(0, -0.4, 0))

# ---- views ------------------------------------------------------------------------------------
VIEWS = {
    'front': ((0, 0.15, 3.9), (0, -0.38, 0), 30),
    'three': ((2.5, 0.7, 2.9), (0, -0.42, 0), 30),
    'top': ((0, 3.6, 0.45), (0, -0.55, 0), 30),
    'side': ((3.9, 0.1, 0), (0, -0.4, 0), 30),
    'back': ((0, 0.4, -3.9), (0, -0.4, 0), 30),
    'app': ((0, 0.91, 6.52), (0, -0.12, 0), 30),
}

scene.render.engine = 'CYCLES'
scene.cycles.samples = int(samples)
scene.cycles.use_denoising = True
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    for kind in ('OPTIX', 'CUDA'):
        try:
            prefs.compute_device_type = kind
            prefs.get_devices()
            if any(d.type == kind for d in prefs.devices):
                for d in prefs.devices:
                    d.use = d.type == kind
                scene.cycles.device = 'GPU'
                break
        except TypeError:
            continue
except KeyError:
    pass
scene.render.resolution_x = width
scene.render.resolution_y = height
scene.render.film_transparent = False
scene.view_settings.view_transform = 'AgX'

cam_data = bpy.data.cameras.new('cam')
cam_data.sensor_fit = 'VERTICAL'
cam = bpy.data.objects.new('cam', cam_data)
scene.collection.objects.link(cam)
scene.camera = cam
for name in views.split(','):
    pos, target, fov = VIEWS[name]
    cam.location = B(*pos)
    cam_data.angle = math.radians(fov)
    d = B(*target) - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    scene.render.filepath = os.path.join(out_dir, f'{name}.png')
    bpy.ops.render.render(write_still=True)
