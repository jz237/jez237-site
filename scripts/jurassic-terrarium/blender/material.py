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
    meta['palette']['osteo2'] + meta['osteo_shade']: [a_lo, a_hi]: optional; osteo-tagged parts shade
                     from osteo to osteo2 as their accent amount goes from a_lo to a_hi
    meta['osteo_rough']: optional roughness of osteo-tagged parts (default 0.5)
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
    smooth_mask = g.math('ADD', smooth_mask, osteo, clamp=True)  # keratin-sheathed plates and spikes
    height = g.math('MULTIPLY', height, g.math('SUBTRACT', 1.0, g.math('MULTIPLY', smooth_mask, 0.9)))
    # keratin gets fine lengthwise striations instead
    kn = noise(1.0 / max(base * 0.6, 0.004), detail=2)
    hard = g.math('ADD', kerat, osteo, clamp=True)
    height = g.math('ADD', height, g.math('MULTIPLY', g.math('MULTIPLY', kn, hard), 0.25))
    # bony plates: fine radiating grooves (vascular channels) instead of scales
    vg = g.node('ShaderNodeTexWave', wave_type='BANDS', bands_direction='Z', wave_profile='SIN')
    g.link(obj, vg.inputs['Vector'])
    vg.inputs['Scale'].default_value = 1.0 / max(base * 1.5, 0.01)
    vg.inputs['Distortion'].default_value = 4.0
    vg.inputs['Detail'].default_value = 2.0
    height = g.math('ADD', height, g.math('MULTIPLY', g.math('MULTIPLY', vg.outputs['Fac'], osteo), 0.18))
    # optional finer scales in a zone (meta 'fine_zone' + scales 'fine'): small polygonal scales with low
    # domes replace the big dorsal scales there, e.g. on a small head, where big scales read as smooth
    fine = sc.get('fine')
    if fine and meta.get('fine_zone'):
        fz = attr('mC')[0]
        vfn = vor(fine, 'DISTANCE_TO_EDGE')
        fbead = g.smooth(vfn.outputs['Distance'], 0.0, 0.3)
        vfd = vor(fine * 0.55, 'F1', 0.9)
        fdome = g.math('MULTIPLY', g.math('SUBTRACT', 1.0, g.smooth(vfd.outputs['Distance'], 0.0, 0.5)), 0.35)
        fh = g.math('MULTIPLY', g.math('ADD', fbead, fdome), 0.75)
        # keep the existing bump scale meaningful: fine relief is scaled to the base scale's height range
        height = g.mixf(fz, height, g.math('MULTIPLY', fh, sc.get('fine_relief', 0.8)))
    # ---- anatomy (the 'anat' attribute, from bake_detail.py; absent = no effect): deep transverse skin
    # folds round the joints, muscle masses with grooves between them, a row of keeled scutes down the
    # spine, and growth rings on claws, horns and beaks
    fmask, fphase, mmask, ridge = attr('anat')
    L = meta['length']
    lam = sc.get('fold_wave', max(base * 3.2, 0.011 * L))
    warp = g.math('MULTIPLY', g.math('SUBTRACT', noise(1.0 / (lam * 3.0), detail=2), 0.5), 2.2)
    sn = g.math('SINE', g.math('ADD', g.math('MULTIPLY', fphase, math.pi / lam), warp))
    crease = g.math('SUBTRACT', 1.0, g.smooth(g.math('ABSOLUTE', sn), 0.0, 0.32))
    # (the anatomy is big: it gets its own, deeper relief, `ah`, a second bump on top of the scales')
    ah = g.math('MULTIPLY', fmask, g.math('SUBTRACT', 0.35, g.math('MULTIPLY', crease, 1.5)))
    msz = sc.get('muscle', 0.045 * L)
    mlump = g.smooth(noise(1.0 / msz, detail=1, rough=0.4), 0.3, 0.75)
    vm = vor(msz * 0.9, 'DISTANCE_TO_EDGE', 0.9)
    mgroove = g.math('SUBTRACT', 1.0, g.smooth(vm.outputs['Distance'], 0.0, 0.06))
    mgroove = g.math('MULTIPLY', mgroove, g.smooth(noise(1.0 / (msz * 1.6), detail=1), 0.5, 0.65))
    ah = g.math('ADD', ah, g.math('MULTIPLY', mmask, g.math('SUBTRACT', g.math('MULTIPLY', mlump, 1.6), g.math('MULTIPLY', mgroove, 0.6))))
    rsz = sc.get('ridge', feat * 2.4)
    vr = vor(rsz, 'DISTANCE_TO_EDGE', 0.6)
    scute = g.smooth(vr.outputs['Distance'], 0.0, 0.2)
    vrc = vor(rsz, 'F1', 0.6)
    keel = g.math('SUBTRACT', 1.0, g.smooth(vrc.outputs['Distance'], 0.0, 0.45))
    ah = g.math('ADD', ah, g.math('MULTIPLY', ridge, g.math('ADD', g.math('MULTIPLY', scute, 0.6), g.math('MULTIPLY', keel, 0.9))))
    height = g.math('MULTIPLY', height, g.math('SUBTRACT', 1.0, g.math('MULTIPLY', ridge, 0.6)))
    rings = g.node('ShaderNodeTexWave', wave_type='BANDS', bands_direction='Z', wave_profile='SAW')
    g.link(obj, rings.inputs['Vector'])
    rings.inputs['Scale'].default_value = 1.0 / max(base * 0.5, 0.004)
    rings.inputs['Distortion'].default_value = 2.0
    height = g.math('ADD', height, g.math('MULTIPLY', g.math('MULTIPLY', rings.outputs['Fac'], g.math('ADD', kerat, claw, clamp=True)), 0.35))
    # the crevices, for darkening the colour (baked as emission by bake_detail.py; strength 0 otherwise)
    cav = g.math('ADD', g.math('MULTIPLY', fmask, crease), g.math('MULTIPLY', g.math('MULTIPLY', mmask, mgroove), 0.15), clamp=True)
    # the hollows between muscle masses shade a little darker, so they read from a distance
    cav = g.math('ADD', cav, g.math('MULTIPLY', g.math('MULTIPLY', mmask, g.math('SUBTRACT', 1.0, mlump)), 0.3), clamp=True)
    cav = g.math('ADD', cav, g.math('MULTIPLY', g.math('MULTIPLY', ridge, g.math('SUBTRACT', 1.0, scute)), 0.6), clamp=True)
    cavc = g.node('ShaderNodeCombineColor')
    for k in range(3):
        g.link(cav, cavc.inputs[k])
    g.link(cavc.outputs[0], bsdf.inputs['Emission Color'])
    bsdf.inputs['Emission Strength'].default_value = 0.0
    bump = g.node('ShaderNodeBump')
    bump.inputs['Strength'].default_value = sc.get('bump', 0.85)
    bump.inputs['Distance'].default_value = base * 0.3
    g.link(height, bump.inputs['Height'])
    bump2 = g.node('ShaderNodeBump')
    bump2.inputs['Strength'].default_value = 1.0
    bump2.inputs['Distance'].default_value = sc.get('anat_depth', 0.0035) * L
    g.link(ah, bump2.inputs['Height'])
    g.link(bump.outputs['Normal'], bump2.inputs['Normal'])
    g.link(bump2.outputs['Normal'], bsdf.inputs['Normal'])

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
        oc = pal['osteo']
        if 'osteo2' in pal:
            # optional second tone for osteo-tagged parts, chosen per part by its accent amount:
            # accent osteo_shade[0] -> osteo, osteo_shade[1] -> osteo2 (linear), with a little
            # large-scale noise so the tone is not flat
            lo, hi = meta.get('osteo_shade', (0.0, 1.0))
            sh = g.math('MULTIPLY', g.math('SUBTRACT', accent, lo), 1.0 / max(hi - lo, 1e-6))
            sh = g.math('ADD', sh, g.math('MULTIPLY', g.math('SUBTRACT', noise(4.0, 3), 0.5), 0.3), clamp=True)
            oc = g.mix(sh, pal['osteo'], pal['osteo2'])
        col = g.mix(osteo, col, oc)
    g.link(col, bsdf.inputs['Base Color'])

    # ---- roughness
    rough = g.math('ADD', 0.66, g.math('MULTIPLY', relief, 0.16))
    rough = g.mixf(kerat, rough, 0.4)
    rough = g.mixf(osteo, rough, meta.get('osteo_rough', 0.5))
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
