"""Prepare complete-needle LOD streams from the CC0 mature fir, without Blender.

Needles are disconnected four-triangle pieces. Keep complete pieces, distributed
through the source crown, and widen only their cross section at lower LOD. This
preserves longitudinal tips/branch placement instead of collapsing needles away.
The Blender authoring step simplifies only the separate woody streams.
"""
import json
import hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
from scipy.spatial import ConvexHull

ROOT = Path(__file__).resolve().parents[1]
DIRECTORY = ROOT / 'source/reference/fir_tree_01'
OUT = ROOT / 'outputs/forest-edge/authoring'
OUT.mkdir(parents=True, exist_ok=True)
gltf = json.loads((DIRECTORY / 'fir_tree_01_2k.gltf').read_text())
buffer = np.memmap(DIRECTORY / gltf['buffers'][0]['uri'], dtype=np.uint8, mode='r')

def accessor(index):
    a = gltf['accessors'][index]; view = gltf['bufferViews'][a['bufferView']]
    dtype = {5126: np.float32, 5125: np.uint32, 5123: np.uint16}[a['componentType']]
    width = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}[a['type']]
    return np.ndarray((a['count'], width), dtype=dtype, buffer=buffer,
        offset=view.get('byteOffset', 0) + a.get('byteOffset', 0))

def primitive_stream(primitive):
    tri = accessor(primitive['indices']).reshape(-1, 3)
    attrs = primitive['attributes']
    positions = accessor(attrs['POSITION'])
    return positions, accessor(attrs['NORMAL']), accessor(attrs['TEXCOORD_0']) if 'TEXCOORD_0' in attrs else np.zeros((len(positions), 2), dtype=np.float32), tri

reports = []
for variant, mesh in enumerate(gltf['meshes']):
    primitive = next(p for p in mesh['primitives'] if p['material'] == 2)
    p, normal, uv, tri = primitive_stream(primitive)
    print('Auditing crown', variant, len(tri), flush=True)
    _, inverse = np.unique(np.rint(p * 1e6).astype(np.int32), axis=0, return_inverse=True)
    welded = inverse[tri]
    graph = coo_matrix((np.ones(len(tri) * 3, dtype=np.uint8),
        (welded[:, [0, 1, 2]].ravel(), welded[:, [1, 2, 0]].ravel())),
        shape=(inverse.max() + 1,) * 2).tocsr()
    count, labels = connected_components(graph, directed=False)
    component = labels[welded[:, 0]]; sizes = np.bincount(component)
    del graph, welded, inverse, labels
    # Some source meshes interleave disconnected pieces. Group by the proven
    # connected-component label instead of assuming adjacent index ranges.
    order = np.argsort(component, kind='stable')
    grouped_triangles = tri[order]
    component_starts = np.r_[0, np.cumsum(sizes)[:-1]]
    needle_starts = component_starts[sizes == 4]
    rng = np.random.default_rng(381205 + variant)
    # Nested sampling avoids wholesale crown rearrangement at a distance switch.
    ranked = rng.permutation(needle_starts)
    near_count = [174000, 141000, 108000][variant]
    far_count = [110000, 90000, 68000][variant]
    woody = []
    twig_triangle_ids = np.flatnonzero(sizes[component] != 4)
    twig_indices = tri[twig_triangle_ids].reshape(-1)
    woody.append((p[twig_indices], normal[twig_indices], uv[twig_indices], np.ones(len(twig_indices), dtype=np.int8)))
    root_primitive = next(q for q in mesh['primitives'] if q['material'] in (1, 4, 5))
    trunk, _, _, trunk_tri = primitive_stream(root_primitive)
    bottom = float(trunk[:, 1].min())
    top = max(float(accessor(q['attributes']['POSITION'])[:, 1].max()) for q in mesh['primitives'])
    height = top - bottom
    # The photographed root flare is asymmetric. Center the accessible stem,
    # using actual triangle intersections rather than the canopy/root bounds.
    sections = []
    source_triangles = trunk[trunk_tri]
    for fraction in [.055, .08, .11]:
        y = bottom + height * fraction
        intersections = []
        for a, b in [(0, 1), (1, 2), (2, 0)]:
            start, end = source_triangles[:, a], source_triangles[:, b]
            valid = (start[:, 1] <= y) != (end[:, 1] <= y)
            t = (y - start[valid, 1]) / (end[valid, 1] - start[valid, 1])
            intersections.append(start[valid] + (end[valid] - start[valid]) * t[:, None])
        points = np.concatenate(intersections)[:, [0, 2]]
        sections.append((points.min(axis=0) + points.max(axis=0)) / 2)
    root_xz = np.mean(sections, axis=0)
    origin = np.array([root_xz[0], bottom, root_xz[1]], dtype=np.float32)
    stem_band = trunk[(trunk[:, 1] > bottom + height * .055) & (trunk[:, 1] < bottom + height * .12)]
    stem_radius = float(np.percentile(np.linalg.norm(stem_band[:, [0, 2]] - root_xz, axis=1), 95))
    # A low, compact hull represents the irregular root flare separately from
    # the central trunk, avoiding a large empty cylindrical collision collar.
    normalized_trunk = (trunk - origin) / height
    root_samples = []
    for lo, hi in [(0, .015), (.015, .035), (.035, .055)]:
        band = normalized_trunk[(normalized_trunk[:, 1] >= lo) & (normalized_trunk[:, 1] <= hi)]
        for angle in np.linspace(0, 2 * np.pi, 16, endpoint=False):
            direction = np.array([np.cos(angle), np.sin(angle)])
            root_samples.append(band[np.argmax(band[:, [0, 2]] @ direction)])
    root_samples = np.unique(np.asarray(root_samples), axis=0)
    root_hull = root_samples[ConvexHull(root_samples).vertices]
    for q in mesh['primitives']:
        if q['material'] == 2:
            continue
        wp, wn, wu, wt = primitive_stream(q)
        ids = wt.reshape(-1)
        wood_uv = wu[ids].copy()
        if q['material'] in (1, 4):
            # A/B keep their original photographed bark maps and UVs. B repeats
            # beyond0–1, so a packed atlas would corrupt phase across triangle edges.
            woody.append((wp[ids], wn[ids], wood_uv,
                np.full(len(ids), 2, dtype=np.int8)))
            continue
        if q['material'] == 5:
            # The official C trunk has no TEXCOORD_0. Give its existing bark
            # material a cylinder projection rather than sampling a single texel.
            centered = wp[ids] - origin
            desired = np.column_stack((np.arctan2(centered[:, 0], centered[:, 2]) / (2 * np.pi) * 2,
                centered[:, 1] / 3.5))
        else:
            transform = gltf['materials'][q['material']]['pbrMetallicRoughness']['baseColorTexture'].get('extensions', {}).get('KHR_texture_transform', {})
            desired = wood_uv * np.array(transform.get('scale', [1, 1])) + np.array(transform.get('offset', [0, 0]))
        # Reuse the existing medium-fir branch maps, including their transform.
        wood_uv = (desired - [0, .9000000655651093]) / [1.2000000476837158, .09999993443489075]
        woody.append((wp[ids], wn[ids], wood_uv.astype(np.float32),
            np.full(len(ids), 2 if q['material'] == 5 else 0, dtype=np.int8)))
    wood = {name: np.concatenate([part[i] for part in woody]) for i, name in enumerate(['p', 'n', 'uv', 'material'])}
    wood['p'] = (wood['p'] - origin) / height
    np.savez_compressed(OUT / f'fir-{variant}-wood.npz', **wood)
    lod_reports = []
    for level, amount in [('near', near_count), ('far', far_count)]:
        # Preserve a recognizably narrow needle. Large inverse-density widening
        # made mature firs read as broad-leaf trees during close runtime review.
        expansion = 1.8 if level == 'near' else 2.85
        starts = np.sort(ranked[:min(amount, len(ranked))])
        ids = grouped_triangles[(starts[:, None] + np.arange(4)).reshape(-1)].reshape(-1)
        points = p[ids].reshape(-1, 12, 3).copy()
        normals = normal[ids].reshape(-1, 12, 3).copy()
        centers = points.mean(axis=1)
        delta = points - centers[:, None, :]
        covariance = np.einsum('nki,nkj->nij', delta, delta)
        axis = np.linalg.eigh(covariance)[1][:, :, -1]
        along = np.einsum('nki,ni->nk', delta, axis)[:, :, None] * axis[:, None, :]
        points = centers[:, None, :] + along + (delta - along) * expansion
        normal_along = np.einsum('nki,ni->nk', normals, axis)[:, :, None] * axis[:, None, :]
        normals = normal_along + (normals - normal_along) / expansion
        normals /= np.maximum(1e-9, np.linalg.norm(normals, axis=2)[:, :, None])
        points = (points.reshape(-1, 3) - origin) / height
        np.savez_compressed(OUT / f'fir-{variant}-{level}.npz', p=points.astype(np.float32),
            n=normals.reshape(-1, 3).astype(np.float32), uv=uv[ids].astype(np.float32))
        lod_reports.append({'level': level, 'completeNeedles': len(starts), 'needleTriangles': len(starts) * 4,
            'crossSectionScale': expansion, 'longitudinalScale': 1})
    reports.append({'variant': variant, 'sourceNode': gltf['nodes'][variant]['name'], 'sourceHeight': height,
        'sourceOrigin': origin.tolist(), 'normalizedStemRadius': stem_radius / height,
        'normalizedStemHeight': .84, 'rootHull': root_hull.tolist(),
        'stemCenterMethod': 'Mean of actual trunk triangle sections at normalized heights .055, .08 and .11',
        'sourceNeedles': len(ranked), 'lods': lod_reports})
    print('Prepared', variant, lod_reports, flush=True)
(OUT / 'preparation.json').write_text(json.dumps(reports, indent=2) + '\n', encoding='utf-8')
# Keep the original mature twig photograph; its normal/ARM files are already
# byte-identical to the medium-fir maps loaded by the scene.
assets = ROOT / 'public/assets'
(assets / 'north_fir_twig_diff.jpg').write_bytes((DIRECTORY / 'textures/fir_tree_01_twig_diff_2k.jpg').read_bytes())
for variant in ['a', 'b']:
    for kind, size in [('diff', 2048), ('nor_gl', 1024), ('arm', 1024)]:
        image = Image.open(DIRECTORY / f'textures/fir_tree_01_trunk_{variant}_{kind}_2k.jpg').convert('RGB')
        if image.size != (size, size):
            image = image.resize((size, size), Image.Resampling.LANCZOS)
        image.save(assets / f'north_fir_trunk_{variant}_{kind}.jpg', quality=94, subsampling=0)
source_manifest = json.loads((DIRECTORY / 'manifest.json').read_text())
asset_manifest = json.loads((assets / 'manifest.json').read_text())
names = ['north_fir_twig_diff.jpg'] + [f'north_fir_trunk_{v}_{kind}.jpg'
    for v in ['a', 'b'] for kind in ['diff', 'nor_gl', 'arm']]
asset_manifest = [entry for entry in asset_manifest if entry['file'] not in names]
for name in names:
    source_name = name.replace('north_fir_', 'fir_tree_01_').replace('.jpg', '_2k.jpg')
    original = next(entry for entry in source_manifest if entry['file'] == 'textures/' + source_name)
    path = assets / name
    asset_manifest.append({'file': name, 'source': original['source'], 'url': original['url'],
        'license': 'CC0-1.0', 'sourceSha256': original['sha256'],
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes': path.stat().st_size,
        'modifications': 'Original 2k photograph copied unchanged' if 'twig' in name else
            'Bark color retained at 2k; normal/ARM resized to 1k with Lanczos; JPEG quality94, no chroma subsampling',
        'generator': 'tools/prepare-north-fir-geometry.py'})
(assets / 'manifest.json').write_text(json.dumps(asset_manifest, indent=2) + '\n', encoding='utf-8', newline='\n')
