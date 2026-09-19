"""Headless Blender 4.5 exporter for the Anatomy Studio (Z-Anatomy FBX -> per-file GLB with extras).

Usage:
  blender -b --factory-startup -P blender-export.py -- --fbx <file> --system <name> --src <z-anatomy dir> --work <dir> --rules rules.json

Reads <work>/normalize.json (translation applied to every system so all files share one frame).
Writes <work>/raw/<file>.glb, <work>/<system>-anchors.json, <work>/<system>-report.json.
"""
import bpy, bmesh, sys, json, re, os, time, math
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index('--') + 1:]
args = dict(zip(argv[::2], argv[1::2]))
FBX, SYSTEM, WORK = args['--fbx'], args['--system'], args['--work']
FULL = args.get('--full', '0') == '1'   # full-resolution tier: identical pieces, no decimation, written to raw-hi/
RULES = json.load(open(args.get('--rules', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'rules.json'))))
NORM = json.load(open(os.path.join(WORK, 'normalize.json')))
os.makedirs(os.path.join(WORK, 'raw'), exist_ok=True)
T0 = time.time()
log = lambda *a: print('[export:%s %5.1fs]' % (SYSTEM, time.time() - T0), *a, flush=True)

# ---------------------------------------------------------------- import
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=FBX, use_custom_normals=True, use_anim=False, use_image_search=False, ignore_leaf_bones=True, use_custom_props=True)
log('imported', len(bpy.data.objects), 'objects')

# ---------------------------------------------------------------- classification
# Z-Anatomy suffixes: .l/.r side; .g group empty; .j/.i tiny label placeholder meshes; .t/.s label anchor empties;
# .ol/.or/.el/.er/.oNl/.oNr/.iNl ... muscle origin/insertion overlays painted on bones. Blender adds .NNN on collisions.
SUFFIX = re.compile(r'^(?P<base>.*?)(?P<kind>\.(?:l|r|g|j|t|s|i|ol|or|el|er|[oie]\d+[lr]|[oie][lr]))?(?P<blender>\.\d{3})?$')
JUNK = re.compile(r'^(Cross Section|Take a picture|\?+|\(?\?)|-profile$|-curve|^(External|Internal) axis of eyeball|^Equator of eyeball|^Meridians of eyeball|^Hairs?$|^Pubic hairs$')

def classify(o):
    m = SUFFIX.match(o.name); base = m['base']; kind = (m['kind'] or '')[1:]
    base = re.sub(r'\s*\(//[^)]*\)', '', base).replace('*', '').replace("'", '').strip(); base = re.sub(r'\s{2,}', ' ', base)
    side = 'M'; prefix_side = False
    if kind in ('l', 'r'): side = kind.upper(); kind = ''
    elif kind and kind[-1] in 'lr' and kind not in ('g', 'j', 't', 's', 'i', 'ol', 'or', 'el', 'er'):
        side = kind[-1].upper()
    elif kind in ('ol', 'el'): side = 'L'
    elif kind in ('or', 'er'): side = 'R'
    if side == 'M':
        if base.startswith('Left '): side = 'L'; prefix_side = True
        elif base.startswith('Right '): side = 'R'; prefix_side = True
    overlay = kind not in ('', 'g', 'j', 't', 's')
    return base, kind, side, overlay, prefix_side

META = {}
for o in bpy.data.objects:
    base, kind, side, overlay, prefix_side = classify(o)
    META[o.name] = dict(base=base, kind=kind, side=side, overlay=overlay, prefixSide=prefix_side)

def ancestors(o):
    out = []; p = o.parent
    while p: out.append(p); p = p.parent
    return out
def depth(o): return len(ancestors(o))
def groups_of(o):
    return [META[p.name]['base'] for p in ancestors(o) if META[p.name]['kind'] == 'g' or p.type == 'MESH']

# ---------------------------------------------------------------- anchors (label positions)
Mn = Matrix.Translation(Vector(NORM['translate'])) @ Matrix.Scale(NORM['scale'], 4)
anchors = []
for o in bpy.data.objects:
    if o.type == 'EMPTY' and META[o.name]['kind'] in ('t', 's'):
        p = Mn @ o.matrix_world.translation
        anchors.append(dict(name=META[o.name]['base'], side=META[o.name]['side'], parent=META[o.parent.name]['base'] if o.parent else None, position=[round(p.x, 4), round(p.z, 4), round(-p.y, 4)]))  # glTF frame
if not FULL: json.dump(anchors, open(os.path.join(WORK, f'{SYSTEM}-anchors.json'), 'w'))
log('anchors', len(anchors))

# ---------------------------------------------------------------- keep set
real = []
for o in bpy.data.objects:
    if o.type != 'MESH': continue
    m = META[o.name]
    if m['overlay'] or m['kind'] in ('j', 'i') or JUNK.search(m['base']) or JUNK.search(o.name): continue
    if SYSTEM == 'skeletal' and 'muscle' in m['base'].lower(): continue
    if len(o.data.polygons) == 0: continue
    real.append(o)
log('real meshes', len(real))

# ---------------------------------------------------------------- unit (merge) rules -> (unit key, unit display name, side, file)
def ancestor_at_depth(o, d):
    ch = list(reversed(ancestors(o)))  # root first
    return ch[d] if len(ch) > d else o
def nearest_group(o):
    for p in ancestors(o):
        if META[p.name]['kind'] == 'g': return p
    return o
def chain_names(o): return [META[p.name]['base'] for p in reversed(ancestors(o))]
def has_ancestor(o, *names):
    return any(META[p.name]['base'] in names for p in ancestors(o))

GREAT_VESSELS = {'Pulmonary trunk', 'Ascending aorta', 'Arch of aorta', 'Aortic arch', 'Superior vena cava', 'Inferior vena cava (thoracic part)', 'Inferior vena cava', 'Right pulmonary artery', 'Left pulmonary artery', 'Right superior pulmonary vein', 'Right inferior pulmonary vein', 'Left superior pulmonary vein', 'Left inferior pulmonary vein', 'Bifurcation of pulmonary trunk'}

def unit_for(o):
    """Return (unit object, file id). Meshes sharing a unit object (and side, when the unit is an empty) are joined."""
    m = META[o.name]; base = m['base']; ch = chain_names(o); d = depth(o)
    if SYSTEM == 'skeletal': return o, 'skeletal'
    if SYSTEM == 'visceral': return o, 'visceral'
    if SYSTEM == 'lymphoid':
        if re.search(r'node', base, re.I): return nearest_group(o), 'lymphoid'
        return o, 'lymphoid'
    if SYSTEM == 'regions':
        return nearest_group(o), 'regions'
    if SYSTEM == 'muscular':
        if any(k in ch for k in ('Fasciae', 'Bursae of head', 'Bursae of lower limb', 'Bursae of upper limb', 'Cervical bursae', 'Synovial bursae', 'Tendon sheaths')) or re.search(r'bursa|tendon sheath|fascia|retinaculum|septum|aponeurosis|iliotibial', base, re.I):
            g = nearest_group(o); return g, 'muscular'
        return o, 'muscular'
    if SYSTEM == 'joints':
        if re.match(r'^(Intervertebral disc|Nucleus pulposus) ', base):
            return ('disc', base.split(' ')[-1]), 'joints'   # disc + nucleus pair joined by level
        if 'Fibrous joints of vertebral column' in ch or 'Intervertebral symphysis' in ch: return o, 'joints'
        if 'Knee joint' in ch and re.search(r'meniscus|cruciate|collateral|patellar', base, re.I): return o, 'joints'
        if re.search(r'^(Articular disc|Interpubic disc|Sacro-iliac|Anterior longitudinal|Posterior longitudinal|Ligamenta flava|Nuchal|Supraspinous|Interspinous)', base): return o, 'joints'
        # everything else: the named joint group (depth >= 2), per side
        ch_objs = list(reversed(ancestors(o)))
        for p in reversed(ch_objs):
            if META[p.name]['kind'] == 'g' and re.search(r' joint$| joints$|symphysis|syndesmos|membrane|ligament', META[p.name]['base'], re.I) and depth(p) >= 2: return p, 'joints'
        return nearest_group(o), 'joints'
    if SYSTEM == 'cardiovascular':
        if any(k in ch for k in ('Heart', 'Arteries of heart', 'Cardiac veins')): return o, 'heart'
        if base in GREAT_VESSELS: return o, 'heart'
        ud = RULES['vesselUnitDepth']
        u = o if d <= ud else ancestor_at_depth(o, ud)
        f = 'heart' if META[u.name]['base'] in GREAT_VESSELS else 'vessels'
        return u, f
    if SYSTEM == 'nervous':
        if 'Brain' in ch:
            if re.search(r'sulcus|sulci|Lat_Fis|fissure|Jensen', base, re.I): return ('sulci', m['side']), 'brain'
            if 'Brainstem' in ch and re.search(r'nucleus|nuclei|colliculus|body$|Olive|Pyramid|Habenula|commissure|Stria', base, re.I) and o.data and len(o.data.polygons) < 1500: return ('brainstem-nuclei', m['side']), 'brain'
            return o, 'brain'
        if any(k in ch for k in ('Meninges',)): return o, 'brain'
        if 'Eyeball' in ch: return o, 'brain'
        if 'Accessory visual structures' in ch: return ('lacrimal', m['side']), 'brain'
        if 'Ear' in ch: return (o if 'Internal ear' in ch else ('ear', m['side'])), 'brain'
        if 'Spinal cord' in ch:
            if re.search(r'Central canal', base): return ('central-canal', 'M'), 'nerves'
            if 'White matter of spinal cord' in ch: return ('spinal-white', 'M'), 'nerves'
            if 'Grey matter of spinal cord' in ch: return ('spinal-grey', 'M'), 'nerves'
            return o, 'nerves'
        if 'Cranial nerves' in ch:
            u = o if d <= 3 else ancestor_at_depth(o, 3); return u, 'nerves'
        if 'Ganglia' in ch: return ('ganglia', m['side']), 'nerves'
        if 'Autonomic division of peripheral nervous system' in ch:
            u = o if d <= 4 else ancestor_at_depth(o, 4); return u, 'nerves'
        ud = RULES['nerveUnitDepth']
        u = o if d <= ud else ancestor_at_depth(o, ud); return u, 'nerves'
    return o, SYSTEM

SPECIAL_NAMES = {'sulci': 'Cerebral sulci', 'brainstem-nuclei': 'Brainstem nuclei', 'lacrimal': 'Lacrimal apparatus', 'ear': 'External and middle ear', 'central-canal': 'Central canal of spinal cord', 'spinal-white': 'White matter of spinal cord', 'spinal-grey': 'Grey matter of spinal cord', 'ganglia': 'Autonomic ganglia'}

units = {}  # key -> dict(members=[], name, side, file, unitObj)
for o in real:
    u, f = unit_for(o); m = META[o.name]
    if isinstance(u, tuple):
        key = ('special',) + u; name = SPECIAL_NAMES.get(u[0], u[0]); side = u[1] if len(u) > 1 else 'M'
        if u[0] == 'disc': name = f'Intervertebral disc {u[1]}'; side = 'M'
        uobj = None
    elif u is o:
        key = ('self', o.name); name = m['base']; side = m['side']; uobj = o
    elif u.type == 'MESH':
        key = ('mesh', u.name); name = META[u.name]['base']; side = META[u.name]['side']; uobj = u
        if side == 'M' and m['side'] != 'M': side = 'M'
    else:  # group empty: split by side
        key = ('group', u.name, m['side']); name = META[u.name]['base']; side = m['side']; uobj = None
    units.setdefault(key, dict(members=[], name=name, side=side, file=f, unit=uobj, parent=None))['members'].append(o)

# ---------------------------------------------------------------- capture hierarchy before unparenting
GROUPS = {o.name: groups_of(o) for o in real}
for u in units.values():
    if u['unit'] is not None and u['unit'].name not in GROUPS: GROUPS[u['unit'].name] = groups_of(u['unit'])
UNIT_GROUPS = {}
for key, u in units.items():
    if key[0] == 'group': UNIT_GROUPS[key] = [META[key[1]]['base']] + groups_of(bpy.data.objects[key[1]])
    elif key[0] == 'special': UNIT_GROUPS[key] = GROUPS[u['members'][0].name]
scene = bpy.context.scene
for o in real:
    if o.data.users > 1: o.data = o.data.copy()
    o.hide_set(False); o.hide_viewport = False; o.hide_render = False
    mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = Mn @ mw
for o in real:
    neg = o.matrix_world.determinant() < 0
    with bpy.context.temp_override(active_object=o, selected_editable_objects=[o], selected_objects=[o], object=o):
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    if neg: o.data.flip_normals()

pieces = []
for key, u in units.items():
    members = u['members']; target = u['unit'] if (u['unit'] is not None and u['unit'] in members) else max(members, key=lambda x: len(x.data.polygons))
    others = [m for m in members if m is not target]
    merged = [META[m.name]['base'] + ('' if META[m.name]['side'] == 'M' else f" ({META[m.name]['side']})") for m in members] if others else []
    parent_groups = UNIT_GROUPS.get(key) or GROUPS[target.name]
    if others:
        with bpy.context.temp_override(active_object=target, selected_editable_objects=[target] + others, selected_objects=[target] + others, object=target):
            bpy.ops.object.join()
    pieces.append(dict(obj=target, name=u['name'], side=u['side'], file=u['file'], merged=merged, suffixSide=(u['side'] != 'M' and not (key[0] in ('self', 'mesh') and META[target.name]['prefixSide'])), parent=parent_groups[0] if parent_groups else None, path=' / '.join(reversed(parent_groups))))
log('pieces', len(pieces), 'from', len(real), 'meshes')

# ---------------------------------------------------------------- decimation
def tri_count(me): me.calc_loop_triangles(); return len(me.loop_triangles)
def decimate(obj, ratio):
    bm = bmesh.new(); bm.from_mesh(obj.data); bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5); bm.to_mesh(obj.data); bm.free()
    mod = obj.modifiers.new('dec', 'DECIMATE'); mod.decimate_type = 'COLLAPSE'; mod.ratio = ratio; mod.use_collapse_triangulate = True
    dg = bpy.context.evaluated_depsgraph_get(); new = bpy.data.meshes.new_from_object(obj.evaluated_get(dg))
    obj.modifiers.clear(); old = obj.data; obj.data = new; bpy.data.meshes.remove(old)
    return tri_count(new)

D = RULES['decimate']; report = dict(system=SYSTEM, files={}, pieces=[])
for fid in sorted(set(p['file'] for p in pieces)):
    fp = [p for p in pieces if p['file'] == fid]; budget = RULES['files'][fid]['budget']; hero = RULES['files'][fid].get('hero', False)
    before = {p['obj'].name: tri_count(p['obj'].data) for p in fp}; total = sum(before.values())
    ratio = 1.0 if FULL else max(D['floor'], min(1.0, budget / max(total, 1)))
    if hero and not FULL: ratio = min(1.0, ratio * D['heroBoost'])
    after = {}
    for p in fp:
        o = p['obj']; t = before[o.name]
        if t < D['minTriangles'] or ratio >= 0.999: after[o.name] = t; continue
        r = max(ratio, D['smallPieceFloor']) if t < D['smallPieceTriangles'] else ratio
        after[o.name] = decimate(o, r)
    tot_after = sum(after.values())
    if tot_after > budget * 1.08 and ratio < 0.999:   # one corrective pass on the largest pieces
        r2 = max(D['floor'], budget / tot_after)
        for p in sorted(fp, key=lambda p: -after[p['obj'].name])[:40]:
            o = p['obj']
            if after[o.name] > D['smallPieceTriangles']: after[o.name] = decimate(o, r2)
        tot_after = sum(after.values())
    for p in fp: p['tris'] = after[p['obj'].name]; p['trisBefore'] = before[p['obj'].name]
    report['files'][fid] = dict(pieces=len(fp), trisBefore=total, trisAfter=tot_after, budget=budget, ratio=round(ratio, 3))
    log(fid, 'pieces', len(fp), 'tris', total, '->', tot_after, 'budget', budget, 'ratio', round(ratio, 3))

# ---------------------------------------------------------------- clean geometry, smooth, origins, extras
def slug(s): return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s.lower())).strip('-')
seen = set()
for i, p in enumerate(pieces):
    o = p['obj']; me = o.data
    bm = bmesh.new(); bm.from_mesh(me)
    loose = [v for v in bm.verts if not v.link_faces]; bmesh.ops.delete(bm, geom=loose, context='VERTS')
    bm.to_mesh(me); bm.free()
    me.shade_smooth()
    # origin -> bounds centre (world). rotation/scale already applied so world = location + local.
    xs = [v.co.x for v in me.vertices]; ys = [v.co.y for v in me.vertices]; zs = [v.co.z for v in me.vertices]
    c = Vector(((min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, (min(zs) + max(zs)) / 2))
    for v in me.vertices: v.co -= c
    o.location = o.location + c
    size = [max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs)]
    pid = f"{p['file']}/{slug(p['name'])}" + ('-' + p['side'].lower() if p['suffixSide'] else '')
    n = 2
    while pid in seen: pid = f"{p['file']}/{slug(p['name'])}-{p['side'].lower()}-{n}"; n += 1
    seen.add(pid)
    o['id'] = pid; o['name'] = p['name']; o['system'] = SYSTEM; o['file'] = p['file']; o['side'] = p['side']
    o['parent'] = p['parent'] or ''; o['path'] = p['path']; o['merged'] = json.dumps(p['merged']); o['tris'] = p['tris']
    o.name = pid.replace('/', '__')
    loc = o.location
    report['pieces'].append(dict(id=pid, name=p['name'], side=p['side'], file=p['file'], tris=p['tris'], trisBefore=p['trisBefore'], merged=len(p['merged']), center=[round(loc.x, 4), round(loc.z, 4), round(-loc.y, 4)], size=[round(size[0], 4), round(size[2], 4), round(size[1], 4)]))

# ---------------------------------------------------------------- export per file
keep = set(p['obj'] for p in pieces)
for o in list(bpy.data.objects):
    if o not in keep: bpy.data.objects.remove(o, do_unlink=True)
for fid in report['files']:
    for o in bpy.data.objects: o.select_set(o['file'] == fid)
    out = os.path.join(WORK, 'raw-hi' if FULL else 'raw', f'{fid}.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', use_selection=True, export_apply=True, export_extras=True, export_yup=True,
        export_materials='NONE', export_texcoords=False, export_normals=True, export_tangents=False, export_animations=False, export_skins=False,
        export_morph=False, export_lights=False, export_cameras=False, export_attributes=False, export_shared_accessors=False)
    report['files'][fid]['bytes'] = os.path.getsize(out)
    log('wrote', out, round(os.path.getsize(out) / 1048576, 1), 'MB')
report['seconds'] = round(time.time() - T0, 1)
json.dump(report, open(os.path.join(WORK, f'{SYSTEM}-report' + ('-hi' if FULL else '') + '.json'), 'w'), indent=1)
log('done')
