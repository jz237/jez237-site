"""Procedural skin material (Cycles) and the texture bake onto the game mesh.

The high-resolution sculpture carries per-vertex attributes computed from the distance field:
    mA = (keratin, mouth, claw, eye)        material membership
    mB = (osteo, tooth, feather, detail)    more membership + how much skin relief a region takes
    pat = (dorsal, along, band, scale)      countershading coordinate (-1 belly .. 1 back), position
                                            along the body in metres, band phase, scale-size factor
The shader turns those into albedo, roughness and relief; Cycles bakes them (plus the sculpture's
own shape) into the low-poly mesh's textures.
"""
import math, os
import bpy
import numpy as np


def hex2rgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1.0]


class NB:
    """Tiny node-graph builder."""

    def __init__(self, mat):
        self.nt = mat.node_tree
        self.n = self.nt.nodes
        self.l = self.nt.links
        self.x = 0

    def node(self, kind, **props):
        nd = self.n.new(kind)
        for k, v in props.items():
            if k.startswith('in_'):
                key = k[3:]
                key = int(key) if key.isdigit() else key.replace('__', ' ')
                nd.inputs[key].default_value = v
            else:
                setattr(nd, k, v)
        nd.location = (self.x, 0)
        self.x += 200
        return nd

    def link(self, a, b):
        self.l.new(a, b)

    def math(self, op, a, b=None, clamp=False):
        nd = self.node('ShaderNodeMath', operation=op, use_clamp=clamp)
        for i, v in enumerate((a, b)):
            if v is None:
                continue
            if isinstance(v, (int, float)):
                nd.inputs[i].default_value = v
            else:
                self.link(v, nd.inputs[i])
        return nd.outputs[0]

    def mix(self, fac, a, b, blend='MIX'):
        nd = self.node('ShaderNodeMix', data_type='RGBA', blend_type=blend)
        for sock, v in ((nd.inputs[0], fac), (nd.inputs[6], a), (nd.inputs[7], b)):
            if isinstance(v, (int, float)):
                sock.default_value = v
            elif isinstance(v, (list, tuple)):
                sock.default_value = v
            else:
                self.link(v, sock)
        return nd.outputs[2]

    def mixf(self, fac, a, b):
        nd = self.node('ShaderNodeMix', data_type='FLOAT')
        for sock, v in ((nd.inputs[0], fac), (nd.inputs[2], a), (nd.inputs[3], b)):
            if isinstance(v, (int, float)):
                sock.default_value = v
            else:
                self.link(v, sock)
        return nd.outputs[0]

    def smooth(self, a, e0, e1):
        nd = self.node('ShaderNodeMapRange', interpolation_type='SMOOTHSTEP')
        nd.inputs[1].default_value = e0
        nd.inputs[2].default_value = e1
        nd.inputs[3].default_value = 0.0
        nd.inputs[4].default_value = 1.0
        self.link(a, nd.inputs[0])
        return nd.outputs[0]


def skin_material(meta, name='skin_src'):
    """Procedural source material for the high-res sculpture.

    meta['palette']: back, flank, belly, pattern, accent, keratin, claw, mouth, eye (+ optional osteo,
                     accent2 for the accent gradient's far end)
    meta['pattern']: kind in bands | stripes | spots | mottle | none; count, start, end (metres along
                     the body), strength, mottle, spot (size m)
    meta['scales']:  base (pebbly scale size, m), feature (larger dorsal scales), tubercle (sparse raised
                     domes, m; 0 = none), tubercle_density (0..1), border (0..1 darkness of scale borders),
                     folds (strength of transverse skin folds)
    meta['accent_grad']: [z_lo, z_hi] metres: accent -> accent2 with height (plate rims, frill edges)
    """
    pal = {k: hex2rgb(v) for k, v in meta['palette'].items()}
    pat = meta.get('pattern', {})
    sc = meta.get('scales', {})
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    g = NB(mat)
    g.n.clear()
    out = g.node('ShaderNodeOutputMaterial')
    bsdf = g.node('ShaderNodeBsdfPrincipled')
    g.link(bsdf.outputs[0], out.inputs['Surface'])

    def attr(nm):
        a_ = g.node('ShaderNodeAttribute', attribute_name=nm, attribute_type='GEOMETRY')
        sep = g.node('ShaderNodeSeparateColor')
        g.link(a_.outputs['Color'], sep.inputs[0])
        return [sep.outputs[0], sep.outputs[1], sep.outputs[2], a_.outputs['Alpha']]

    kerat, mouth, claw, eye = attr('mA')
    osteo, tooth, feather, detail = attr('mB')
    dors, along, accent, scalef = attr('pat')
    tc = g.node('ShaderNodeTexCoord')
    obj = tc.outputs['Object']
    sepo = g.node('ShaderNodeSeparateXYZ')
    g.link(obj, sepo.inputs[0])
    oz = sepo.outputs['Z']

    def vor(size, feature='F1', jitter=1.0):
        v = g.node('ShaderNodeTexVoronoi', feature=feature, voronoi_dimensions='3D')
        g.link(obj, v.inputs['Vector'])
        v.inputs['Scale'].default_value = 1.0 / size
        v.inputs['Randomness'].default_value = jitter
        return v

    def noise(scale, detail=4, rough=0.55, dist=0.0):
        n = g.node('ShaderNodeTexNoise', noise_dimensions='3D')
        g.link(obj, n.inputs['Vector'])
        n.inputs['Scale'].default_value = scale
        n.inputs['Detail'].default_value = detail
        n.inputs['Roughness'].default_value = rough
        n.inputs['Distortion'].default_value = dist
        return n.outputs['Fac']

    base = sc.get('base', 0.03)
    feat = sc.get('feature', base * 2.2)
    border = sc.get('border', 0.2)
    # ---- relief
    vfe = vor(base, 'DISTANCE_TO_EDGE')
    bead = g.smooth(vfe.outputs['Distance'], 0.0, 0.28)
    vce = vor(feat, 'DISTANCE_TO_EDGE')
    vcc = vor(feat)
    feat_r = g.smooth(vce.outputs['Distance'], 0.0, 0.22)
    dmask = g.smooth(dors, -0.2, 0.45)
    fmask = g.math('MULTIPLY', dmask, scalef)
    relief = g.mixf(fmask, bead, feat_r)
    height = g.math('MULTIPLY', relief, 0.7)
    tub = sc.get('tubercle', 0.0)
    tubmask = None
    if tub:
        vt = vor(tub, 'F1', 0.85)
        sept = g.node('ShaderNodeSeparateColor')
        g.link(vt.outputs['Color'], sept.inputs[0])
        pick = g.math('LESS_THAN', sept.outputs[0], sc.get('tubercle_density', 0.2))
        dome = g.math('SUBTRACT', 1.0, g.smooth(vt.outputs['Distance'], 0.0, 0.36))
        tlo = sc.get('tubercle_from', -0.5)  # dorsal coordinate where tubercles begin
        tubmask = g.math('MULTIPLY', g.math('MULTIPLY', pick, dome), g.smooth(dors, tlo, tlo + 0.7))
        height = g.math('ADD', height, g.math('MULTIPLY', tubmask, 2.2))
    # transverse skin folds: waves across the body axis (Blender Y), warped by noise; where detail is high
    folds = sc.get('folds', 0.6)
    if folds:
        wv = g.node('ShaderNodeTexWave', wave_type='BANDS', bands_direction='Y', wave_profile='SIN')
        g.link(obj, wv.inputs['Vector'])
        wv.inputs['Scale'].default_value = 1.0 / max(base * 6, 0.02)
        wv.inputs['Distortion'].default_value = 6.0
        wv.inputs['Detail'].default_value = 3.0
        wv.inputs['Detail Scale'].default_value = 1.5
        fold = g.math('MULTIPLY', g.math('MULTIPLY', wv.outputs['Fac'], detail), folds)
        height = g.math('ADD', height, fold)
    smooth_mask = g.math('ADD', g.math('ADD', kerat, claw, clamp=True), g.math('ADD', mouth, eye, clamp=True), clamp=True)
    smooth_mask = g.math('ADD', smooth_mask, tooth, clamp=True)
    height = g.math('MULTIPLY', height, g.math('SUBTRACT', 1.0, g.math('MULTIPLY', smooth_mask, 0.9)))
    # keratin gets fine lengthwise striations instead
    kn = noise(1.0 / max(base * 0.6, 0.004), detail=2)
    height = g.math('ADD', height, g.math('MULTIPLY', g.math('MULTIPLY', kn, kerat), 0.25))
    bump = g.node('ShaderNodeBump')
    bump.inputs['Strength'].default_value = sc.get('bump', 0.85)
    bump.inputs['Distance'].default_value = base * 0.3
    g.link(height, bump.inputs['Height'])
    g.link(bump.outputs['Normal'], bsdf.inputs['Normal'])

    # ---- colour: countershading back -> flank -> belly
    cs = meta.get('countershade', (-0.88, -0.5, -0.25, 0.4))  # belly->flank, flank->back ramps (dors units)
    up = g.smooth(dors, cs[2], cs[3])
    lowr = g.smooth(dors, cs[0], cs[1])
    col = g.mix(lowr, pal['belly'], pal['flank'])
    col = g.mix(up, col, pal['back'])
    kind = pat.get('kind', 'bands')
    strength = pat.get('strength', 0.5)
    if kind in ('bands', 'stripes'):
        span = pat['end'] - pat['start']
        ph = g.math('MULTIPLY', g.math('SUBTRACT', along, pat['start']), pat['count'] * 2 * math.pi / span)
        ph = g.math('ADD', ph, g.math('MULTIPLY', noise(0.9, 3), 3.5 if kind == 'bands' else 2.0))
        s_ = g.math('SINE', ph)
        stripe = g.smooth(s_, 0.1 if kind == 'bands' else 0.45, 0.7 if kind == 'bands' else 0.85)
        # broken edges: modulate with fine noise so stripes dissolve into the scales
        stripe = g.math('MULTIPLY', stripe, g.smooth(noise(1.0 / max(feat * 3, 0.03), 3), 0.3, 0.6))
        sm = g.math('MULTIPLY', stripe, g.smooth(dors, pat.get('low', -0.35), pat.get('high', 0.4)))
        col = g.mix(g.math('MULTIPLY', sm, strength), col, pal['pattern'])
    elif kind == 'spots':
        vs = vor(pat.get('spot', 0.3), 'F1', 1.0)
        sp_ = g.math('SUBTRACT', 1.0, g.smooth(vs.outputs['Distance'], 0.15, 0.35))
        sepp = g.node('ShaderNodeSeparateColor')
        g.link(vs.outputs['Color'], sepp.inputs[0])
        sp_ = g.math('MULTIPLY', sp_, g.math('LESS_THAN', sepp.outputs[0], pat.get('density', 0.5)))
        sm = g.math('MULTIPLY', sp_, g.smooth(dors, -0.3, 0.3))
        col = g.mix(g.math('MULTIPLY', sm, strength), col, pal['pattern'])
    # mottling and large-scale tone drift
    mm = g.math('MULTIPLY', g.smooth(noise(1.6, 5), 0.48, 0.72), pat.get('mottle', 0.3))
    col = g.mix(mm, col, pal['pattern'])
    drift = noise(0.35, 2)
    hsv0 = g.node('ShaderNodeHueSaturation')
    g.link(g.math('ADD', 0.47, g.math('MULTIPLY', drift, 0.06)), hsv0.inputs['Hue'])
    g.link(g.math('ADD', 0.85, g.math('MULTIPLY', drift, 0.3)), hsv0.inputs['Saturation'])
    g.link(col, hsv0.inputs['Color'])
    col = hsv0.outputs['Color']
    # per-scale tone jitter (feature-scale cells), and subtly darker borders / lighter domes
    sepj = g.node('ShaderNodeSeparateColor')
    g.link(vcc.outputs['Color'], sepj.inputs[0])
    hsv = g.node('ShaderNodeHueSaturation')
    g.link(g.math('ADD', 1.0, g.math('MULTIPLY', g.math('SUBTRACT', sepj.outputs[0], 0.5), 0.22)), hsv.inputs['Value'])
    g.link(col, hsv.inputs['Color'])
    col = hsv.outputs['Color']
    edge = g.math('SUBTRACT', 1.0, relief)
    col = g.mix(g.math('MULTIPLY', edge, border * 0.35), col, pal['pattern'])
    if tubmask is not None:
        col = g.mix(g.math('MULTIPLY', tubmask, 0.35), col, pal['belly'])
    # accent regions (frills, plates, crests, throat flush), with an optional height gradient
    acc = pal['accent']
    if 'accent2' in pal and 'accent_grad' in meta:
        z0, z1 = meta['accent_grad']
        gz = g.smooth(oz, z0, z1)
        gz = g.math('ADD', gz, g.math('MULTIPLY', g.math('SUBTRACT', noise(2.5, 3), 0.5), 0.35))
        acc = g.mix(gz, pal['accent'], pal['accent2'])
    col = g.mix(accent, col, acc)
    # materials
    col = g.mix(kerat, col, pal['keratin'])
    col = g.mix(claw, col, pal['claw'])
    col = g.mix(mouth, col, pal['mouth'])
    col = g.mix(tooth, col, hex2rgb('#d9cfb4'))
    col = g.mix(eye, col, pal['eye'])
    if 'osteo' in pal:
        col = g.mix(osteo, col, pal['osteo'])
    g.link(col, bsdf.inputs['Base Color'])

    # ---- roughness
    rough = g.math('ADD', 0.66, g.math('MULTIPLY', relief, 0.16))
    rough = g.mixf(kerat, rough, 0.4)
    rough = g.mixf(claw, rough, 0.32)
    rough = g.mixf(mouth, rough, 0.25)
    rough = g.mixf(eye, rough, 0.1)
    g.link(rough, bsdf.inputs['Roughness'])
    bsdf.inputs['Specular IOR Level'].default_value = 0.4
    return mat


def bake_targets(low, size, name):
    """Give the low mesh a material with image nodes for each bake target; return images."""
    imgs = {}
    mat = bpy.data.materials.new(f'{name}')
    mat.use_nodes = True
    nt = mat.node_tree
    for kind, cs in (('color', 'sRGB'), ('normal', 'Non-Color'), ('rough', 'Non-Color'), ('ao', 'Non-Color')):
        im = bpy.data.images.new(f'{name}_{kind}', size, size, alpha=False, float_buffer=False)
        im.colorspace_settings.name = cs
        nd = nt.nodes.new('ShaderNodeTexImage')
        nd.image = im
        nd.name = kind
        imgs[kind] = (im, nd)
    low.data.materials.clear()
    low.data.materials.append(mat)
    return mat, imgs


def bake(high, low, imgs, extrusion, ray, samples=32, kinds=('color', 'rough', 'ao', 'normal'), save_dir=None):
    """Bake each target and save it straight away (a later bake type can clobber an earlier
    image's buffer in background mode, so nothing is left waiting in memory)."""
    scn = bpy.context.scene
    scn.render.engine = 'CYCLES'
    scn.cycles.device = 'CPU'
    bpy.ops.object.select_all(action='DESELECT')
    high.select_set(True)
    low.select_set(True)
    bpy.context.view_layer.objects.active = low
    nt = low.data.materials[0].node_tree
    jobs = {'color': ('DIFFUSE', {'COLOR'}, 4), 'normal': ('NORMAL', set(), 8), 'rough': ('ROUGHNESS', set(), 4),
            'ao': ('AO', set(), 64)}
    for kind in kinds:
        btype, passes, spp = jobs[kind]
        im, nd = imgs[kind]
        for n in nt.nodes:
            n.select = False
        nd.select = True
        nt.nodes.active = nd
        scn.cycles.samples = spp
        bpy.ops.object.bake(type=btype, pass_filter=passes, use_selected_to_active=True,
                            cage_extrusion=extrusion, max_ray_distance=ray, margin=12)
        if save_dir:
            im.filepath_raw = os.path.join(save_dir, f'{kind}.png')
            im.file_format = 'PNG'
            im.save()
        print('baked', kind, flush=True)
