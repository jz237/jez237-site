"""Pack unlit fir attributes with fractional coverage and isolated tile gutters.

Raw Blender EXR samples are premultiplied linear values. Area-filter these before
unpremultiplication so fine needles keep their projected area and fringe color.
The delivered PNG color is straight sRGB; data remains straight linear.
"""
import hashlib
import json
import sys
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt

ROOT = Path(__file__).resolve().parents[1]
BAKE = ROOT / 'outputs/north-backdrop/bake'
META = ROOT / 'src/quarry-north-backdrop-atlas.json'
metadata = json.loads(META.read_text())
smoke = '--smoke' in sys.argv
W, H = metadata['atlasSize']
TW, TH = metadata['tileSize']; G = metadata['gutter']
IW, IH = TW - G * 2, TH - G * 2


def resize(values):
    return np.stack([np.asarray(Image.fromarray(values[:, :, i], 'F').resize((IW, IH), Image.Resampling.BOX))
        for i in range(values.shape[-1])], axis=-1)


def to_srgb(value):
    value = np.clip(value, 0, 1)
    return np.where(value <= .0031308, value * 12.92, 1.055 * np.power(value, 1 / 2.4) - .055)


def tile_arrays(source):
    color, normal, depth = [resize(source[key]) for key in ['albedo', 'normal', 'depth']]
    alpha = np.clip(color[:, :, 3], 0, 1)
    denominator = np.maximum(alpha, 1e-8)[:, :, None]
    rgb = color[:, :, :3] / denominator
    normals = normal[:, :, :3] / denominator * 2 - 1
    normals /= np.maximum(np.linalg.norm(normals, axis=2, keepdims=True), 1e-8)
    normalized_depth = depth[:, :, :1] / denominator
    albedo = np.dstack([to_srgb(rgb), alpha])
    normal_depth = np.dstack([normals * .5 + .5, normalized_depth])
    # Nearest valid surface attributes fill transparent RGB only. Coverage stays
    # zero in empty pixels and gutters; neither normals nor depth contain alpha.
    valid = alpha > .005
    nearest = distance_transform_edt(~valid, return_distances=False, return_indices=True)
    for target, channels in [(albedo, slice(0, 3)), (normal_depth, slice(0, 4))]:
        target[~valid, channels] = target[nearest[0][~valid], nearest[1][~valid], channels]
    return np.clip(albedo, 0, 1), np.clip(normal_depth, 0, 1), float(alpha.mean())


manifest = {
    'source': 'https://polyhaven.com/a/fir_tree_01', 'license': 'CC0-1.0',
    'generators': ['tools/prepare-north-backdrop.py', 'tools/bake-north-backdrop.py', 'tools/pack-north-backdrop.py'],
    'runtimeMetadata': 'src/quarry-north-backdrop-atlas.json',
    'method': 'Accepted decoded near models, emission-only albedo/object normal/depth. No sun, AO, exposure, fog, or instance tint. Native source normal textures and UV transforms. Area-filtered premultiplied linear attributes before straight RGBA packing.',
    'sampling': {'azimuthCount': 8, 'elevationsDegrees': metadata['elevations'], 'sourcePixels': [512, 1024],
        'atlasPixels': [W, H], 'tilePixels': [TW, TH], 'innerPixels': [IW, IH], 'gutterPixels': G, 'maxSafeMip': 3},
    'runtimeFiles': [], 'sources': [], 'materialInputs': metadata['materialInputs'], 'variants': [],
}
for variant in metadata['variants']:
    v = variant['variant']
    if smoke and v != 0: continue
    albedo_atlas = np.zeros((H, W, 4), dtype=np.uint8)
    normal_atlas = np.zeros((H, W, 4), dtype=np.uint8)
    stats = []
    for view in variant['views']:
        if smoke and view['index'] != 0: continue
        source = np.load(BAKE / f'fir-{v}-view-{view["index"]:02d}.npz')
        if max(float(np.max(np.abs(source[key][:, :, 3] - source['albedo'][:, :, 3]))) for key in ['normal', 'depth']) > 1e-5:
            raise ValueError('Attribute passes have inconsistent coverage')
        albedo, normal_depth, coverage = tile_arrays(source)
        if smoke:
            Image.fromarray(np.rint(albedo * 255).astype(np.uint8)).save(BAKE / 'smoke-albedo.png')
            Image.fromarray(np.rint(normal_depth * 255).astype(np.uint8)).save(BAKE / 'smoke-normal-depth.png')
            background = np.array([.33, .35, .37])
            preview = albedo[:, :, :3] * albedo[:, :, 3:] + background * (1 - albedo[:, :, 3:])
            Image.fromarray(np.rint(preview * 255).astype(np.uint8)).resize((480, 992)).save(BAKE / 'smoke-preview.png')
        col, row = view['index'] % 4, view['index'] // 4
        for values, atlas in [(albedo, albedo_atlas), (normal_depth, normal_atlas)]:
            padded = np.pad(values, ((G, G), (G, G), (0, 0)), mode='edge')
            if atlas is albedo_atlas:
                padded[:G, :, 3] = 0; padded[-G:, :, 3] = 0
                padded[:, :G, 3] = 0; padded[:, -G:, 3] = 0
            atlas[row * TH:(row + 1) * TH, col * TW:(col + 1) * TW] = np.rint(padded * 255).astype(np.uint8)
        original_coverage = float(source['albedo'][:, :, 3].mean())
        stats.append({'index': view['index'], 'coverage': coverage, 'sourceCoverage': original_coverage,
            'relativeCoverageChange': coverage / original_coverage - 1,
            'frontFacingMedian': float(np.median(((normal_depth[:, :, :3] * 2 - 1) @ np.asarray(view['direction']))[albedo[:, :, 3] > .5]))})
    if smoke: continue
    for key, atlas in [('albedo', albedo_atlas), ('normalDepth', normal_atlas)]:
        path = ROOT / 'public' / variant[key]
        Image.fromarray(atlas, 'RGBA').save(path, optimize=True)
        manifest['runtimeFiles'].append({'file': variant[key], 'bytes': path.stat().st_size,
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
            'role': 'Straight sRGB albedo + linear coverage' if key == 'albedo' else 'Linear object-space normal RGB + view-depth A'})
    manifest['variants'].append({'variant': v, 'views': stats})
    manifest['sources'].append({key: variant[key] for key in ['sourceFile', 'sourceSha256', 'decodedSha256']})
    print('NORTH_BACKDROP_PACKED', v, 'coverage delta max', max(abs(s['relativeCoverageChange']) for s in stats), flush=True)
if not smoke:
    manifest['runtimeMetadataSha256'] = hashlib.sha256(META.read_bytes()).hexdigest()
    manifest['gpuBytesWithMipmaps'] = W * H * 4 * 2 * 3 * 4 // 3
    (ROOT / 'source/models/quarry-north-backdrop-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8', newline='\n')
print('NORTH_BACKDROP_PACK_COMPLETE', flush=True)
