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

def tri_count(me): me.calc_loop_triangles(); return len(me.loop_triangles)
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

# ---------------------------------------------------------------- skin smoothing
# Z-Anatomy's surface regions are coarse patches. Subdividing them one by one pulls every patch boundary inward and
# cracks the face open, so: tag each patch with its own material, weld all patches into one surface, subdivide that,
# stamp the smooth normals as custom split normals, then separate the pieces again by material.
if SYSTEM == 'regions':
    for i, p in enumerate(pieces):
        me = p['obj'].data; me.materials.clear(); me.materials.append(bpy.data.materials.new(f'PIECE::{i}'))
        for poly in me.polygons: poly.material_index = 0
    skin = [p for p in pieces if not re.search(r'hair', p['name'], re.I)]; hair = [p for p in pieces if p not in skin]
    # Each source patch is a closed thin shell: an outer sheet, an inner sheet a few millimetres below it and a rim
    # joining their borders. Welded together, the rims become fins at every patch border and subdivision turns them
    # into ridges. Keep only the outer sheets: split each shell into smooth components (sharp edges separate the
    # sheets from the rims) and drop every component whose faces cannot see open air along their normals.
    from mathutils.bvhtree import BVHTree
    world = bmesh.new()
    for p in skin:
        tmp = p['obj'].data.copy(); tmp.transform(p['obj'].matrix_world); world.from_mesh(tmp); bpy.data.meshes.remove(tmp)
    bmesh.ops.triangulate(world, faces=world.faces); scene_tree = BVHTree.FromBMesh(world); world.free()
    SHARP = math.radians(float(os.environ.get('SKIN_SHARP', '55'))); ESCAPE = float(os.environ.get('SKIN_ESCAPE', '0.08'))
    kept_faces = dropped_faces = 0
    for p in skin:
        o = p['obj']; me = o.data; M = o.matrix_world; R = M.to_3x3()
        bm0 = bmesh.new(); bm0.from_mesh(me); bm0.faces.ensure_lookup_table()
        comp = [-1] * len(bm0.faces); ncomp = 0
        for f in bm0.faces:
            if comp[f.index] >= 0: continue
            stack = [f]; comp[f.index] = ncomp
            while stack:
                g = stack.pop()
                for e in g.edges:
                    if len(e.link_faces) != 2 or e.calc_face_angle(0.0) > SHARP: continue
                    for h in e.link_faces:
                        if comp[h.index] < 0: comp[h.index] = ncomp; stack.append(h)
            ncomp += 1
        faces_of = [[] for _ in range(ncomp)]
        for f in bm0.faces: faces_of[comp[f.index]].append(f)
        remove = []; info = []; escape = []
        for ci, fs in enumerate(faces_of):
            step = max(1, len(fs) // 400); seen = 0; free = 0
            for f in fs[::step]:
                n = (R @ f.normal).normalized(); origin = M @ f.calc_center_median() + n * 5e-4
                hit = scene_tree.ray_cast(origin, n); seen += 1
                if hit[0] is None: free += 1
            escape.append(free / max(1, seen)); info.append((len(fs), round(escape[-1], 2), min(f.index for f in fs), max(f.index for f in fs)))
        for ci, fs in enumerate(faces_of):
            if escape[ci] < ESCAPE: remove.extend(fs)   # inner sheets and abutting rims see no open air at all; concave skin still sees some
        bmesh.ops.delete(bm0, geom=remove, context='FACES'); bm0.to_mesh(me); bm0.free()
        kept_faces += len(me.polygons); dropped_faces += len(remove)
        if os.environ.get('SKIN_DIAG'): log('SKIN_DIAG shell', p['name'], 'components', ncomp, 'kept faces', len(me.polygons), 'dropped', len(remove), sorted(info, key=lambda t: -t[0])[:40])
    log('regions: outer sheets kept', kept_faces, 'faces; inner sheets and rims dropped', dropped_faces)
    objs = [p['obj'] for p in skin]; target = objs[0]
    with bpy.context.temp_override(active_object=target, selected_editable_objects=objs, selected_objects=objs, object=target):
        bpy.ops.object.join()
    # drop sliver faces (the source has a few stray faces spanning centimetres), then weld the patches into one surface
    bm = bmesh.new(); bm.from_mesh(target.data)
    def is_sliver(f):
        L = max(e.calc_length() for e in f.edges); return L > .03 and f.calc_area() < .08 * L * L   # long and needle-thin only
    slivers = [f for f in bm.faces if is_sliver(f)]; bmesh.ops.delete(bm, geom=slivers, context='FACES')
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=3e-4)
    bmesh.ops.dissolve_degenerate(bm, dist=1e-5, edges=bm.edges)
    bm.edges.ensure_lookup_table(); pin = bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if len(e.link_faces) == 1], sides=8); log('regions: pinholes filled', len(pin['faces']), 'sides histogram', sorted(__import__('collections').Counter(len(f.verts) for f in pin['faces']).items()))
    orig_normal = {f: f.normal.copy() for f in bm.faces}
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)   # source patches are wound inconsistently; mixed windings give garbage vertex normals along every patch border (visible seam ridges)
    # Bridge the gaps between neighbouring patches: their outer sheets stop a few millimetres short of each other.
    # Pair every border edge with the nearest border edge of a different patch and bridge each patch pair's chains.
    from mathutils.kdtree import KDTree
    BRIDGE = float(os.environ.get('SKIN_BRIDGE', '0.016'))
    bm.edges.ensure_lookup_table(); bm.faces.ensure_lookup_table()
    border = [e for e in bm.edges if len(e.link_faces) == 1]
    def chains(edges):   # split border edges into connected chains (an opening such as an eye is one closed chain)
        adj = {}
        for e in edges:
            for v in e.verts: adj.setdefault(v, []).append(e)
        seen = set(); out = []
        for e in edges:
            if e in seen: continue
            comp = []; stack = [e]; seen.add(e)
            while stack:
                x = stack.pop(); comp.append(x)
                for v in x.verts:
                    for y in adj[v]:
                        if y not in seen: seen.add(y); stack.append(y)
            out.append(comp)
        return out
    def chain_gap(a, b):
        pts = [v.co for e in b for v in e.verts]; kdb = KDTree(len(pts))
        for k, c in enumerate(pts): kdb.insert(c, k)
        kdb.balance(); ds = [kdb.find(v.co)[2] for e in a for v in e.verts]; return sum(ds) / len(ds), max(ds)
    def ordered(chain):   # walk a chain into edge order (open chains start at an end)
        adj = {}
        for e in chain:
            for v in e.verts: adj.setdefault(v, []).append(e)
        ends = [v for v, es in adj.items() if len(es) == 1]
        v = ends[0] if ends else chain[0].verts[0]; out = []; seen = set()
        while True:
            nxt = [e for e in adj[v] if e not in seen]
            if not nxt: break
            e = nxt[0]; seen.add(e); out.append(e); v = e.other_vert(v)
        return out if len(out) == len(chain) else chain
    all_chains = [ordered(c) for c in chains(border) if len(c) >= 2]
    chain_of = {}
    for ci, c in enumerate(all_chains):
        for k, e in enumerate(c): chain_of[e] = (ci, k)
    kd = KDTree(len(border)); mids = {}
    for k, e in enumerate(border): m = (e.verts[0].co + e.verts[1].co) / 2; mids[e] = m; kd.insert(m, k)
    kd.balance()
    def partner(e):   # nearest border edge of another chain within reach
        ci = chain_of.get(e, (None,))[0]
        for co, k, d in kd.find_n(mids[e], 16):
            o = border[k]
            if d > BRIDGE: return None
            if o in chain_of and chain_of[o][0] != ci: return o
        return None
    bridged = failed = pairs = 0; new_faces = []
    if os.environ.get('SKIN_DIAG'): log('SKIN_DIAG border edges before bridging', len(border), 'chains', len(all_chains))
    done = set()
    for ci, c in enumerate(all_chains):
        runs = []; cur = None
        for k, e in enumerate(c):
            o = partner(e); oc = chain_of[o][0] if o else None
            if oc is not None and cur and cur[0] == oc: cur[1].append(e); cur[2].append(chain_of[o][1])
            else:
                if cur: runs.append(cur)
                cur = [oc, [e], [chain_of[o][1]]] if oc is not None else None
        if cur: runs.append(cur)
        for oc, run, pos in runs:
            if len(run) < 2 or oc < ci and (oc, ci) in done: continue
            other = all_chains[oc]; lo, hi_ = min(pos), max(pos)
            span = other[lo:hi_ + 1] if hi_ - lo + 1 <= 3 * len(run) else other[lo:lo + 3 * len(run)]
            if len(span) < 2: continue
            edges = [e for e in run + span if e.is_valid and len(e.link_faces) == 1]
            if len(edges) < 4: continue
            mat = run[0].link_faces[0].material_index
            try:
                res = bmesh.ops.bridge_loops(bm, edges=edges, use_pairs=False, use_cyclic=False, use_merge=False, merge_factor=0.5, twist_offset=0)
                for f in res['faces']: f.material_index = mat
                new_faces.extend(res['faces']); bridged += len(res['faces']); pairs += 1; done.add((min(ci, oc), max(ci, oc)))
            except Exception:
                failed += 1
    LONG = 2.0 * BRIDGE; bad = [f for f in new_faces if f.is_valid and max(e.calc_length() for e in f.edges) > LONG]
    if bad: bmesh.ops.delete(bm, geom=bad, context='FACES'); log('regions: discarded', len(bad), 'over-long bridge faces')
    log('regions: bridged', bridged, 'faces across', pairs, 'border runs;', failed, 'bridges failed')
    # small loops left between bridged runs, then the open finger and toe tips (Z-Anatomy has no nails there)
    bm.edges.ensure_lookup_table(); more = bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if len(e.link_faces) == 1], sides=12)['faces']
    keep_open = {slot for slot, m in enumerate(target.data.materials) if m and m.name.startswith('PIECE::') and re.search(r'face|perineum', pieces[int(m.name.split('::')[1])]['name'], re.I)}
    slits = bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if len(e.link_faces) == 1 and e.link_faces[0].material_index not in keep_open], sides=40)['faces']   # e.g. the slit down the inner arm; eyes stay open
    digit_slots = {slot for slot, m in enumerate(target.data.materials) if m and m.name.startswith('PIECE::') and re.search(r'digits', pieces[int(m.name.split('::')[1])]['name'], re.I)}
    tips = bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if len(e.link_faces) == 1 and e.link_faces[0].material_index in digit_slots], sides=0)['faces']
    for f in tips: f.material_index = next(iter({e.link_faces[0].material_index for e in f.edges if len(e.link_faces) > 1} & digit_slots), f.material_index)
    capped = 0
    for c in chains([e for e in bm.edges if e.is_valid and len(e.link_faces) == 1]):   # tips whose loops are not simple: triangulate across them
        if not all(e.link_faces[0].material_index in digit_slots for e in c): continue
        pts = [v.co for e in c for v in e.verts]; ext = max(max(q[i] for q in pts) - min(q[i] for q in pts) for i in range(3))
        if ext > 0.035: continue
        centre = sum(pts, Vector()) / len(pts); cv = bm.verts.new(centre)   # fan cap from the loop's centre, wound to match the neighbouring face
        for e in c:
            if not e.is_valid or not e.link_faces: continue
            f = e.link_faces[0]; loop = next((l for l in f.loops if l.edge is e), None)
            a, b = (loop.vert, loop.link_loop_next.vert) if loop else (e.verts[0], e.verts[1])
            try: nf = bm.faces.new((b, a, cv)); nf.material_index = f.material_index; capped += 1
            except ValueError: pass
    log('regions: filled', len(more), 'small loops,', len(slits), 'slits,', len(tips), 'finger/toe tips and', capped, 'triangles over the remaining tips')
    # recalc orients each connected sheet by its own heuristic; put every sheet back the way the source faced (outward)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    comp_seen = set(); flipped = 0
    for f0 in bm.faces:
        if f0 in comp_seen: continue
        comp = []; stack = [f0]; comp_seen.add(f0)
        while stack:
            g = stack.pop(); comp.append(g)
            for e in g.edges:
                for h in e.link_faces:
                    if h not in comp_seen: comp_seen.add(h); stack.append(h)
        agree = sum(1 if f.normal.dot(orig_normal.get(f, f.normal)) >= 0 else -1 for f in comp if f in orig_normal)
        if agree < 0: bmesh.ops.reverse_faces(bm, faces=comp); flipped += len(comp)
    log('regions: re-oriented', flipped, 'faces on inverted sheets')
    if os.environ.get('SKIN_DIAG'):
        left = [e for e in bm.edges if e.is_valid and len(e.link_faces) == 1]
        names = {i: p['name'] for i, p in enumerate(pieces)}; slot_name = {slot: names.get(int(m.name.split('::')[1]), m.name) for slot, m in enumerate(target.data.materials) if m and m.name.startswith('PIECE::')}
        for c in sorted(chains(left), key=lambda c: -len(c)):
            pts = [v.co for e in c for v in e.verts]; lo = Vector((min(q.x for q in pts), min(q.y for q in pts), min(q.z for q in pts))); hi_ = Vector((max(q.x for q in pts), max(q.y for q in pts), max(q.z for q in pts)))
            mats = sorted({slot_name.get(e.link_faces[0].material_index, '?') for e in c})
            log('SKIN_DIAG open chain', len(c), 'edges', 'centre %.2f %.2f %.2f' % tuple((lo + hi_) / 2), 'size %.0f %.0f %.0f mm' % tuple(1000 * (hi_ - lo)), '|'.join(mats)[:80])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    if os.environ.get('SKIN_DIAG'):   # doubled layers: sub-regions duplicating the skin beneath them?
        bm.faces.ensure_lookup_table(); bm.edges.ensure_lookup_table()
        by_verts = {}
        for f in bm.faces: by_verts.setdefault(frozenset(v.index for v in f.verts), []).append(f)
        dup = [fs for fs in by_verts.values() if len(fs) > 1]
        pairs = {}
        for fs in dup:
            key = tuple(sorted({f.material_index for f in fs})); pairs[key] = pairs.get(key, 0) + 1
        nm = sum(1 for e in bm.edges if len(e.link_faces) > 2)
        log('SKIN_DIAG duplicate face groups', len(dup), 'non-manifold edges (3+ faces)', nm, 'by patch pair', sorted(pairs.items(), key=lambda kv: -kv[1])[:12])
        names = {i: p['name'] for i, p in enumerate(pieces)}; slot_name = {slot: names.get(int(m.name.split('::')[1]), m.name) for slot, m in enumerate(target.data.materials) if m and m.name.startswith('PIECE::')}
        sets = {}; areas = {}
        for e in bm.edges:
            if len(e.link_faces) <= 2: continue
            key = tuple(sorted({slot_name.get(f.material_index, '?') for f in e.link_faces})); sets[key] = sets.get(key, 0) + 1
            for f in e.link_faces: areas.setdefault(slot_name.get(f.material_index, '?'), []).append(f.calc_area())
        for k, n in sorted(sets.items(), key=lambda kv: -kv[1])[:25]: log('SKIN_DIAG nonmanifold', n, ' | '.join(k))
        for k, v in sorted(areas.items(), key=lambda kv: -len(kv[1]))[:12]: log('SKIN_DIAG nm-face-area', k, len(v), 'mean cm2 %.3f' % (1e4 * sum(v) / len(v)))
    if os.environ.get('SKIN_DIAG'):   # seam diagnostics: how far apart are the unwelded patch borders?
        from mathutils.kdtree import KDTree
        bm.verts.ensure_lookup_table(); bm.edges.ensure_lookup_table()
        border = [e for e in bm.edges if len(e.link_faces) == 1]; bverts = {v for e in border for v in e.verts}
        mat_of = {v: {f.material_index for f in v.link_faces} for v in bverts}
        kd = KDTree(len(bverts)); blist = list(bverts)
        for k, v in enumerate(blist): kd.insert(v.co, k)
        kd.balance(); bins = [3e-4, 1e-3, 2e-3, 5e-3, 1e-2, 1e9]; hist = [0] * len(bins); far = 0
        for v in blist:
            best = None
            for co, k, d in kd.find_n(v.co, 12):
                if blist[k] is v or not (mat_of[blist[k]] - mat_of[v]): continue
                best = d; break
            if best is None: far += 1; continue
            for b, lim in enumerate(bins):
                if best <= lim: hist[b] += 1; break
        log('SKIN_DIAG border edges', len(border), 'border verts', len(bverts), 'nearest other-patch border vert: <=0.3mm', hist[0], '<=1mm', hist[1], '<=2mm', hist[2], '<=5mm', hist[3], '<=1cm', hist[4], '>1cm', hist[5], 'none-within-12', far)
    bm.to_mesh(target.data); bm.free(); log('regions: removed', len(slivers), 'sliver faces')
    mod = target.modifiers.new('subd', 'SUBSURF'); mod.levels = 2 if FULL else 1; mod.render_levels = mod.levels; mod.subdivision_type = 'CATMULL_CLARK'
    dg = bpy.context.evaluated_depsgraph_get(); new = bpy.data.meshes.new_from_object(target.evaluated_get(dg)); target.modifiers.clear(); old_me = target.data; target.data = new; bpy.data.meshes.remove(old_me)
    import numpy as np
    new.shade_smooth()
    # Seat overlapping borders. The source patches overlap along thin strips rather than sharing edges, so after
    # subdivision the upper strip's border floats a fraction of a millimetre off the surface beneath and its
    # vertex normals curl: every patch border draws as a bright ridge. Project each border vertex onto the nearest
    # other-patch surface and take that surface's normal, so both layers shade as one skin.
    from mathutils.bvhtree import BVHTree
    nfaces = len(new.polygons); nloops = len(new.loops); nverts = len(new.vertices)
    f_mat = np.empty(nfaces, dtype=np.int32); new.polygons.foreach_get('material_index', f_mat)
    l_edge = np.empty(nloops, dtype=np.int32); new.loops.foreach_get('edge_index', l_edge)
    l_vert = np.empty(nloops, dtype=np.int32); new.loops.foreach_get('vertex_index', l_vert)
    f_start = np.empty(nfaces, dtype=np.int32); new.polygons.foreach_get('loop_start', f_start)
    f_total = np.empty(nfaces, dtype=np.int32); new.polygons.foreach_get('loop_total', f_total)
    e_verts = np.empty(len(new.edges) * 2, dtype=np.int32); new.edges.foreach_get('vertices', e_verts); e_verts = e_verts.reshape(-1, 2)
    edge_use = np.bincount(l_edge, minlength=len(new.edges)); border_edges = np.nonzero(edge_use == 1)[0]
    border_verts = np.unique(e_verts[border_edges].ravel())
    loop_face = np.repeat(np.arange(nfaces), f_total); vert_mat = np.full(nverts, -1, dtype=np.int32); vert_mat[l_vert] = f_mat[loop_face]
    vco = np.empty(nverts * 3, dtype=np.float64); new.vertices.foreach_get('co', vco); vco = vco.reshape(-1, 3)
    vno = np.empty(nverts * 3, dtype=np.float64); new.vertices.foreach_get('normal', vno); vno = vno.reshape(-1, 3)
    polys = [tuple(int(x) for x in l_vert[s0:s0 + t]) for s0, t in zip(f_start, f_total)]
    tree = BVHTree.FromPolygons(vco.tolist(), polys, all_triangles=False)
    SEAT = float(os.environ.get('SKIN_SEAT', '0.0025')); seated = 0; dists = []
    if os.environ.get('SKIN_DIAG'):
        gaps = [0] * 6; names = {i: p['name'] for i, p in enumerate(pieces)}; slot_name = {slot: names.get(int(m.name.split('::')[1]), m.name) for slot, m in enumerate(new.materials) if m and m.name.startswith('PIECE::')}; far_by = {}
        for vi in border_verts:
            own = vert_mat[vi]; best = None
            for co, no, fi, d in tree.find_nearest_range(Vector(vco[vi]), 0.015):
                if f_mat[fi] == own: continue
                if best is None or d < best: best = d
            b = 5 if best is None else 0 if best < 1e-3 else 1 if best < 2.5e-3 else 2 if best < 5e-3 else 3 if best < 1e-2 else 4
            gaps[b] += 1
            if b >= 2: k = slot_name.get(int(own), '?'); far_by[k] = far_by.get(k, 0) + 1
        log('SKIN_DIAG border gap to other patch: <1mm', gaps[0], '1-2.5', gaps[1], '2.5-5', gaps[2], '5-10', gaps[3], '10-15', gaps[4], '>15', gaps[5])
        log('SKIN_DIAG far borders by patch', sorted(far_by.items(), key=lambda kv: -kv[1])[:16])
    for vi in border_verts:
        own = vert_mat[vi]; best = None
        for co, no, fi, d in tree.find_nearest_range(Vector(vco[vi]), SEAT):
            if f_mat[fi] == own: continue
            if best is None or d < best[3]: best = (co, no, fi, d)
        if best is None: continue
        co, no, fi, d = best; dists.append(d)
        if no.dot(Vector(vno[vi])) < 0: no = -no
        vco[vi] = co; vno[vi] = (Vector(vno[vi]) * .25 + no * .75).normalized(); seated += 1
    new.vertices.foreach_set('co', vco.ravel()); new.update()
    log('regions: border verts', len(border_verts), 'seated onto a neighbouring patch', seated, 'median gap %.2fmm' % (1000 * float(np.median(dists)) if dists else 0))
    if os.environ.get('SKIN_DIAG'):
        names = {i: p['name'] for i, p in enumerate(pieces)}; slot_name = {slot: names.get(int(m.name.split('::')[1]), m.name) for slot, m in enumerate(new.materials) if m and m.name.startswith('PIECE::')}
        per = {}
        for vi in border_verts: per.setdefault(slot_name.get(int(vert_mat[vi]), '?'), []).append(vco[vi])
        for k, v in sorted(per.items(), key=lambda kv: -len(kv[1])): c = np.mean(v, axis=0); log('SKIN_DIAG border', k, len(v), 'centre %.2f %.2f %.2f' % tuple(c))
    new.normals_split_custom_set_from_vertices(vno.tolist())
    nf = len(new.polygons); nl = len(new.loops); nv = len(new.vertices)
    mat_idx = np.empty(nf, dtype=np.int32); new.polygons.foreach_get('material_index', mat_idx)
    loop_start = np.empty(nf, dtype=np.int32); new.polygons.foreach_get('loop_start', loop_start)
    loop_total = np.empty(nf, dtype=np.int32); new.polygons.foreach_get('loop_total', loop_total)
    loop_vert = np.empty(nl, dtype=np.int32); new.loops.foreach_get('vertex_index', loop_vert)
    coords = np.empty(nv * 3, dtype=np.float64); new.vertices.foreach_get('co', coords); coords = coords.reshape(-1, 3)
    cnorm = np.empty(nl * 3, dtype=np.float32); new.corner_normals.foreach_get('vector', cnorm); cnorm = cnorm.reshape(-1, 3)
    slot_of = {int(m.name.split('::')[1]): slot for slot, m in enumerate(new.materials) if m and m.name.startswith('PIECE::')}   # join reorders material slots
    found = len(hair)
    for i, p in enumerate(pieces):
        if p in hair: continue
        faces = np.nonzero(mat_idx == slot_of.get(i, -1))[0]
        if not len(faces): continue
        starts = loop_start[faces]; totals = loop_total[faces]
        loop_ids = np.concatenate([np.arange(s0, s0 + t) for s0, t in zip(starts, totals)])
        verts_used, inv = np.unique(loop_vert[loop_ids], return_inverse=True)
        me_i = bpy.data.meshes.new(f'skin_{i}')
        faces_list = []; cursor = 0
        for t in totals: faces_list.append(tuple(int(x) for x in inv[cursor:cursor + t])); cursor += t
        me_i.from_pydata(coords[verts_used].tolist(), [], faces_list); me_i.update()
        me_i.shade_smooth(); me_i.normals_split_custom_set(cnorm[loop_ids].tolist())
        o = bpy.data.objects.new(f'skin_{i}', me_i); bpy.context.scene.collection.objects.link(o); o.matrix_world = target.matrix_world.copy(); p['obj'] = o; p['kept'] = True; found += 1
    bpy.data.objects.remove(target, do_unlink=True)
    for p in hair: p['kept'] = True
    dropped = [p['name'] for p in pieces if not p.get('kept')]
    pieces = [p for p in pieces if p.get('kept')]
    if dropped: log('regions: dropped pieces with no faces left:', dropped)
    log('regions welded, subdivided', 'x2' if FULL else 'x1', 'and separated:', found, 'pieces,', sum(tri_count(p['obj'].data) for p in pieces), 'tris')
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
    if SYSTEM != 'regions' or re.search(r'hair', p['name'], re.I): me.shade_smooth()   # skin pieces keep the shared custom normals stamped after subdivision
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
