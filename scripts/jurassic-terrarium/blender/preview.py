"""blender -b -P preview.py -- <species> [views...]: mesh the grid and render shape checks."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import blib
argv = sys.argv[sys.argv.index('--') + 1:]
sp = argv[0]
views = argv[1:] or ['side', 'three', 'front', 'top']
work = os.path.expanduser(f'~/.cache/jurassic-terrarium/work/{sp}')
blib.reset_scene()
ob = blib.grid_mesh(work)
print('MESH', len(ob.data.vertices), 'verts', len(ob.data.polygons), 'faces')
os.makedirs(os.path.join(work, 'preview'), exist_ok=True)
blib.preview([ob], os.path.join(work, 'preview', sp), views=views)
