"""Headless Blender: import one Z-Anatomy FBX and dump its object structure to CSV + JSON summary.
Usage: blender -b --factory-startup -P blender-inspect.py -- --fbx <file> --system <name> --out <dir>
"""
import bpy, sys, csv, json, re, os, time
argv = sys.argv[sys.argv.index('--') + 1:]
args = dict(zip(argv[::2], argv[1::2]))
fbx, system, out = args['--fbx'], args['--system'], args['--out']
os.makedirs(out, exist_ok=True)
t0 = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.fbx(filepath=fbx, use_custom_normals=True, use_anim=False, use_image_search=False, ignore_leaf_bones=True, use_custom_props=True)
print(f'[inspect] imported {len(bpy.data.objects)} objects in {time.time()-t0:.1f}s')
SUFFIX = re.compile(r'^(?P<base>.*?)(?P<side>\.[lr])?(?P<kind>\.(?:g|j|t|s|i|ol|or))?(?P<blender>\.\d{3})?$')
rows = []; summary = {'system': system, 'objects': len(bpy.data.objects), 'byKind': {}, 'tris': 0, 'trisByKind': {}, 'meshUsersGt1': 0, 'negDet': 0, 'hidden': 0, 'depth': {}}
bbox = [[1e9]*3, [-1e9]*3]
def chain(o):
    c = []; p = o.parent
    while p: c.append(p.name); p = p.parent
    return c
for o in bpy.data.objects:
    m = SUFFIX.match(o.name); kind = (m['kind'] or '.mesh' if o.type == 'MESH' else m['kind'] or '.empty')[1:]
    tris = 0; ngons = 0; loose = 0; bmin = bmax = None; users = 0; det = 1
    if o.type == 'MESH':
        me = o.data; users = me.users; me.calc_loop_triangles(); tris = len(me.loop_triangles); ngons = sum(1 for p in me.polygons if len(p.vertices) > 4)
        det = 1 if o.matrix_world.determinant() >= 0 else -1
        if me.vertices:
            pts = [o.matrix_world @ v.co for v in me.vertices]
            bmin = [min(p[i] for p in pts) for i in range(3)]; bmax = [max(p[i] for p in pts) for i in range(3)]
            for i in range(3): bbox[0][i] = min(bbox[0][i], bmin[i]); bbox[1][i] = max(bbox[1][i], bmax[i])
    key = f'{o.type}:{kind}'
    summary['byKind'][key] = summary['byKind'].get(key, 0) + 1; summary['tris'] += tris; summary['trisByKind'][key] = summary['trisByKind'].get(key, 0) + tris
    if users > 1: summary['meshUsersGt1'] += 1
    if det < 0: summary['negDet'] += 1
    if o.hide_viewport or o.hide_get() or o.hide_render: summary['hidden'] += 1
    d = len(chain(o)); summary['depth'][d] = summary['depth'].get(d, 0) + 1
    loc = list(o.matrix_world.translation)
    rows.append([o.name, o.type, kind, m['base'], (m['side'] or '')[1:], o.parent.name if o.parent else '', ' > '.join(reversed(chain(o))), int(o.hide_viewport or o.hide_get()), users, det, tris, ngons, json.dumps([round(v, 4) for v in bmin]) if bmin else '', json.dumps([round(v, 4) for v in bmax]) if bmax else '', json.dumps([round(v, 4) for v in loc])])
summary['bbox'] = bbox; summary['seconds'] = round(time.time() - t0, 1)
with open(os.path.join(out, f'{system}-inspect.csv'), 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['name', 'type', 'kind', 'base', 'side', 'parent', 'chain', 'hidden', 'users', 'det', 'tris', 'ngons', 'bmin', 'bmax', 'loc']); w.writerows(rows)
with open(os.path.join(out, f'{system}-summary.json'), 'w') as f: json.dump(summary, f, indent=1)
print('[inspect]', json.dumps(summary))
