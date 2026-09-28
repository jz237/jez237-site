"""CPU-only component audit before selecting complete needle clusters for LODs."""
import json
from pathlib import Path
import numpy as np
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components

ROOT = Path(__file__).resolve().parents[1]
ASSET = 'fir_tree_01'
directory = ROOT / 'source/reference' / ASSET
gltf = json.loads((directory / (ASSET + '_2k.gltf')).read_text())
buffer = np.memmap(directory / gltf['buffers'][0]['uri'], dtype=np.uint8, mode='r')
def accessor(index):
    a = gltf['accessors'][index]; view = gltf['bufferViews'][a['bufferView']]
    dtype = {5126: np.float32, 5125: np.uint32, 5123: np.uint16}[a['componentType']]
    width = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
    return np.ndarray((a['count'], width), dtype=dtype, buffer=buffer,
        offset=view.get('byteOffset', 0) + a.get('byteOffset', 0))
primitive = next(p for p in gltf['meshes'][2]['primitives'] if p['material'] == 2)
p = accessor(primitive['attributes']['POSITION']); triangles = accessor(primitive['indices']).reshape(-1, 3)
_, inverse = np.unique(np.rint(p * 1e6).astype(np.int32), axis=0, return_inverse=True)
welded = inverse[triangles]
left = welded[:, [0, 1, 2]].ravel(); right = welded[:, [1, 2, 0]].ravel()
graph = coo_matrix((np.ones(len(left), dtype=np.uint8), (left, right)), shape=(inverse.max() + 1,) * 2).tocsr()
count, labels = connected_components(graph, directed=False)
tri_component = labels[welded[:, 0]]
sizes = np.bincount(tri_component)
unique, frequency = np.unique(sizes, return_counts=True)
print(json.dumps({'source': ASSET, 'variant': 'c', 'triangles': len(triangles),
    'vertices': len(p), 'components': count, 'componentTriangleHistogram': list(zip(unique.tolist(), frequency.tolist())),
    'bounds': [p.min(axis=0).tolist(), p.max(axis=0).tolist()]}, indent=2))
out = ROOT / 'outputs/forest-edge'; out.mkdir(parents=True, exist_ok=True)
np.savez_compressed(out / 'fir-c-components.npz', triangleComponent=tri_component, sizes=sizes,
    vertexComponent=labels[inverse])
