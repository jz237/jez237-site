"""Derive work/normalize.json from the skeletal inspect CSV: feet on the floor, trunk axis at the origin, unit scale.
Usage: python3 make-normalize.py [work_dir]"""
import csv, json, os, sys
W = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/.cache/anatomy-studio/work')
rows = list(csv.DictReader(open(os.path.join(W, 'skeletal-inspect.csv'))))
mesh = [r for r in rows if r['kind'] == 'mesh' and not r['name'].startswith('Cross') and 'muscle' not in r['name'].lower() and r['bmin']]
zmin = min(json.loads(r['bmin'])[2] for r in mesh); zmax = max(json.loads(r['bmax'])[2] for r in mesh)
xmin = min(json.loads(r['bmin'])[0] for r in mesh); xmax = max(json.loads(r['bmax'])[0] for r in mesh)
loc = {r['name']: json.loads(r['loc']) for r in rows if r['loc']}
assert loc['Frontal bone'][2] > loc['Calcaneus.l'][2], 'expected Z up'
assert loc['Body of sternum'][1] < loc['Vertebra T8'][1], 'expected front = -Y'
assert loc['Humerus.l'][0] > 0, 'expected subject left = +X'
cy = (loc['Body of sternum'][1] + loc['Vertebra T8'][1]) / 2
t = [-(xmin + xmax) / 2, -cy, -zmin]
out = {'scale': 1.0, 'translate': t, 'height': round(zmax - zmin, 4), 'frame': 'blender Z-up, front -Y, left +X; glTF export y-up => front +Z, left +X',
       'landmarks': {k: [round(v + d, 4) for v, d in zip(loc[k], t)] for k in ['Frontal bone', 'Vertebra C7', 'Vertebra T12', 'Vertebra L5', 'Sacrum', 'Humerus.l', 'Radius.l', 'Femur.l', 'Tibia.l', 'Calcaneus.l', 'Body of sternum']}}
json.dump(out, open(os.path.join(W, 'normalize.json'), 'w'), indent=1); print(json.dumps(out))
