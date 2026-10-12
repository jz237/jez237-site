"""Build the den rock: grid -> sculpture -> game mesh -> baked basalt material -> static GLB.

    python3 grid.py den && blender -b -P den_build.py
"""
import sys, os, math, importlib
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [HERE, os.path.join(HERE, 'species')]
import numpy as np
import bpy
import blib, material
from material import NB, hex2rgb

WORK = os.path.expanduser('~/.cache/jurassic-terrarium/work/den')
OUT = os.path.join(HERE, '..', '..', '..', 'demos', 'jurassic-terrarium', 'models')
meta = importlib.import_module('den').build().meta


def rock_material():
    mat = bpy.data.materials.new('basalt_src')
    mat.use_nodes = True
    g = NB(mat)
    g.n.clear()
    out = g.node('ShaderNodeOutputMaterial')
    bsdf = g.node('ShaderNodeBsdfPrincipled')
    g.link(bsdf.outputs[0], out.inputs['Surface'])
    tc = g.node('ShaderNodeTexCoord')
    geo = g.node('ShaderNodeNewGeometry')
    sep = g.node('ShaderNodeSeparateXYZ')
    g.link(geo.outputs['Normal'], sep.inputs[0])
    nz = sep.outputs['Z']
    obj = tc.outputs['Object']

    def noise(scale, detail=5, rough=0.6):
        n = g.node('ShaderNodeTexNoise', noise_dimensions='3D')
        g.link(obj, n.inputs['Vector'])
        n.inputs['Scale'].default_value = scale
        n.inputs['Detail'].default_value = detail
        n.inputs['Roughness'].default_value = rough
        return n.outputs['Fac']

    # strata: horizontal bands of slightly different basalt
    wv = g.node('ShaderNodeTexWave', wave_type='BANDS', bands_direction='Z', wave_profile='SIN')
    g.link(obj, wv.inputs['Vector'])
    wv.inputs['Scale'].default_value = 0.35
    wv.inputs['Distortion'].default_value = 3.0
    col = g.mix(wv.outputs['Fac'], hex2rgb('#4d4844'), hex2rgb('#6f6962'))
    col = g.mix(g.math('MULTIPLY', g.smooth(noise(0.6), 0.45, 0.7), 0.6), col, hex2rgb('#3a3632'))
    # cracks: Voronoi edges, darkened
    vo = g.node('ShaderNodeTexVoronoi', feature='DISTANCE_TO_EDGE', voronoi_dimensions='3D')
    g.link(obj, vo.inputs['Vector'])
    vo.inputs['Scale'].default_value = 0.7
    vo.inputs['Randomness'].default_value = 1.0
    wob = noise(1.2, 3)
    # sparse fractures: only some cell edges crack, and they fade in and out along their length
    crack = g.math('MULTIPLY', g.math('SUBTRACT', 1.0, g.smooth(vo.outputs['Distance'], 0.0, 0.02)),
                   g.smooth(wob, 0.5, 0.7))
    col = g.mix(g.math('MULTIPLY', crack, 0.55), col, hex2rgb('#24211e'))
    # lichen spots on the steep faces
    vl = g.node('ShaderNodeTexVoronoi', feature='F1', voronoi_dimensions='3D')
    g.link(obj, vl.inputs['Vector'])
    vl.inputs['Scale'].default_value = 3.0
    lich = g.math('MULTIPLY', g.math('SUBTRACT', 1.0, g.smooth(vl.outputs['Distance'], 0.1, 0.35)),
                  g.smooth(noise(0.9), 0.55, 0.75))
    col = g.mix(g.math('MULTIPLY', lich, 0.7), col, hex2rgb('#a4a083'))
    # moss on the upward faces and ledges
    moss = g.math('MULTIPLY', g.smooth(nz, 0.45, 0.85), g.smooth(noise(0.5), 0.35, 0.6))
    mcol = g.mix(noise(4.0), hex2rgb('#3c4f26'), hex2rgb('#6a7d3c'))
    col = g.mix(moss, col, mcol)
    g.link(col, bsdf.inputs['Base Color'])
    rough = g.mixf(moss, 0.82, 0.95)
    g.link(rough, bsdf.inputs['Roughness'])
    h = g.math('ADD', g.math('MULTIPLY', noise(2.5, 6), 0.6), g.math('MULTIPLY', crack, -0.5))
    h = g.math('ADD', h, g.math('MULTIPLY', moss, g.math('MULTIPLY', noise(9.0, 4), 0.5)))
    bump = g.node('ShaderNodeBump')
    bump.inputs['Strength'].default_value = 0.8
    bump.inputs['Distance'].default_value = 0.12
    g.link(h, bump.inputs['Height'])
    g.link(bump.outputs['Normal'], bsdf.inputs['Normal'])
    return mat


blib.reset_scene()
high = blib.grid_mesh(WORK, name='sculpt')
low = high.copy()
low.data = high.data.copy()
low.name = low.data.name = 'den'
bpy.context.scene.collection.objects.link(low)
dec = low.modifiers.new('dec', 'DECIMATE')
dec.ratio = min(1.0, meta['faces'] / max(1, len(high.data.polygons) * 2))
bpy.context.view_layer.objects.active = low
bpy.ops.object.modifier_apply(modifier='dec')
bpy.ops.object.select_all(action='DESELECT')
low.select_set(True)
bpy.context.view_layer.objects.active = low
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.smart_project(angle_limit=math.radians(55), island_margin=0.004)
bpy.ops.uv.select_all(action='SELECT')
bpy.ops.uv.pack_islands(rotate=True, margin=0.004)
bpy.ops.object.mode_set(mode='OBJECT')
print('DEN', len(high.data.polygons), '->', len(low.data.polygons), flush=True)
src = rock_material()
high.data.materials.clear()
high.data.materials.append(src)
mat, imgs = material.bake_targets(low, meta['tex'], 'den_rock')
os.makedirs(os.path.join(WORK, 'tex'), exist_ok=True)
material.bake(high, low, imgs, extrusion=0.15, ray=0.3, save_dir=os.path.join(WORK, 'tex'))
# final material: albedo x occlusion, normals, roughness
tex = os.path.join(WORK, 'tex')


def load(kind, cs):
    im = bpy.data.images.load(os.path.join(tex, f'{kind}.png'), check_existing=False)
    im.colorspace_settings.name = cs
    im.reload()
    _ = im.pixels[0]
    return im


col, nrm, rgh, ao = load('color', 'sRGB'), load('normal', 'Non-Color'), load('rough', 'Non-Color'), load('ao', 'Non-Color')
n = col.size[0] * col.size[1] * 4
a = np.empty(n, np.float32); col.pixels.foreach_get(a)
o = np.empty(n, np.float32); ao.pixels.foreach_get(o)
a = a.reshape(-1, 4); o = o.reshape(-1, 4)
a[:, :3] *= (1 - 0.8 * (1 - o[:, :1]))  # deep, dark shade inside the hollow
final = bpy.data.images.new('den_albedo', col.size[0], col.size[1], alpha=False)
final.pixels.foreach_set(a.ravel())
m2 = bpy.data.materials.new('den_rock')
m2.use_nodes = True
nt = m2.node_tree
bsdf = nt.nodes['Principled BSDF']
t1 = nt.nodes.new('ShaderNodeTexImage'); t1.image = final
t2 = nt.nodes.new('ShaderNodeTexImage'); t2.image = nrm
t3 = nt.nodes.new('ShaderNodeTexImage'); t3.image = rgh
nm = nt.nodes.new('ShaderNodeNormalMap')
sp = nt.nodes.new('ShaderNodeSeparateColor')
nt.links.new(t1.outputs['Color'], bsdf.inputs['Base Color'])
nt.links.new(t2.outputs['Color'], nm.inputs['Color'])
nt.links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])
nt.links.new(t3.outputs['Color'], sp.inputs[0])
nt.links.new(sp.outputs[1], bsdf.inputs['Roughness'])
low.data.materials[0] = m2
bpy.data.objects.remove(high, do_unlink=True)
bpy.ops.object.select_all(action='DESELECT')
low.select_set(True)
os.makedirs(OUT, exist_ok=True)
path = os.path.join(OUT, 'den.glb')
bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True,
                          export_image_format='WEBP', export_image_quality=85, export_materials='EXPORT',
                          export_animations=False)
print('DEN exported', path, os.path.getsize(path) // 1024, 'KB', flush=True)
