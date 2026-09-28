"""Create explicit atlas projection metadata from the accepted decoded GLBs."""
import hashlib
import json
import math
import struct
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
CENTER = np.array([0., .5, 0.])
texture_directory = ROOT / 'outputs/north-backdrop/bake/textures'
texture_directory.mkdir(parents=True, exist_ok=True)
medium_path = ROOT / 'public/models/fir-medium-a.glb'
medium_bytes = medium_path.read_bytes(); medium_size = struct.unpack_from('<I', medium_bytes, 12)[0]
medium_doc = json.loads(medium_bytes[20:20 + medium_size]); medium_blob = medium_bytes[28 + medium_size:]
texture_inputs = []
for image in medium_doc['images']:
    if image['name'] not in ['fir_sapling_medium_branches_diff_2k', 'fir_sapling_medium_branches_nor_gl_2k', 'fir_sapling_medium_twigs_nor_gl_2k']:
        continue
    view = medium_doc['bufferViews'][image['bufferView']]
    image_bytes = medium_blob[view.get('byteOffset', 0):view.get('byteOffset', 0) + view['byteLength']]
    path = texture_directory / (image['name'] + '.jpg')
    path.write_bytes(image_bytes)
    texture_inputs.append({'sourceFile': 'models/fir-medium-a.glb', 'imageName': image['name'],
        'bytes': len(image_bytes), 'sha256': hashlib.sha256(image_bytes).hexdigest()})
for file in ['north_fir_twig_diff.jpg', 'north_fir_trunk_a_diff.jpg', 'north_fir_trunk_a_nor_gl.jpg', 'north_fir_trunk_b_diff.jpg', 'north_fir_trunk_b_nor_gl.jpg']:
    path = ROOT / 'public/assets' / file
    texture_inputs.append({'sourceFile': 'assets/' + file, 'bytes': path.stat().st_size,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest()})
data = {'version': 1, 'center': CENTER.tolist(), 'frameSize': [.55, 1.10],
    'atlasSize': [1024, 2048], 'tileSize': [256, 512], 'gutter': 8, 'maxSafeMip': 3,
    'azimuthCount': 8, 'elevations': [-10, 25], 'pixelRowOrigin': 'top', 'flipY': False,
    'normalization': 'Accepted decoded near GLB; Y up; rootY0; sourceHeight1; no instance scale or tint',
    'albedoEncoding': 'Straight sRGB RGB and linear coverage alpha, never premultiplied at runtime',
    'normalDepthEncoding': 'Linear RGB=(objectSpaceNormal+1)/2; A=(dot(P-center,direction)-depthRange[0])/(depthRange[1]-depthRange[0])',
    'rectConvention': 'Top-down UV rectangle [u0,v0,width,height], excluding gutter; imageV=.5-dot(P-center,up)/frameSize[1]',
    'materialInputs': texture_inputs, 'normalStrength': 1, 'variants': []}
for variant in range(3):
    path = ROOT / f'outputs/forest-edge/authoring/decoded/quarry-north-fir-{variant}.glb'
    raw = path.read_bytes(); size = struct.unpack_from('<I', raw, 12)[0]
    doc = json.loads(raw[20:20 + size]); blob = raw[28 + size:]
    points = []
    for mesh in doc['meshes']:
        if '_near_' not in mesh['name']: continue
        primitive = mesh['primitives'][0]
        a = doc['accessors'][primitive['attributes']['POSITION']]; v = doc['bufferViews'][a['bufferView']]
        points.append(np.frombuffer(blob, dtype=np.float32, count=a['count'] * 3,
            offset=v.get('byteOffset', 0) + a.get('byteOffset', 0)).reshape(-1, 3))
    points = np.concatenate(points).astype(np.float64)
    shipped = ROOT / f'public/models/quarry-north-fir-{variant}.glb'
    entry = {'variant': variant, 'sourceFile': f'models/quarry-north-fir-{variant}.glb',
        'sourceSha256': hashlib.sha256(shipped.read_bytes()).hexdigest(),
        'decodedSha256': hashlib.sha256(raw).hexdigest(),
        'albedo': f'models/north-backdrop-{variant}-albedo.png',
        'normalDepth': f'models/north-backdrop-{variant}-normal-depth.png', 'views': []}
    for elevation_index, elevation_degrees in enumerate(data['elevations']):
        elevation = math.radians(elevation_degrees)
        for azimuth_index in range(8):
            azimuth = math.tau * azimuth_index / 8
            direction = np.array([math.sin(azimuth)*math.cos(elevation), math.sin(elevation), math.cos(azimuth)*math.cos(elevation)])
            right = np.array([math.cos(azimuth), 0., -math.sin(azimuth)])
            up = np.cross(direction, right)
            relative = points - CENTER
            projected = np.stack([relative @ right / .55 + .5, .5 - relative @ up / 1.1], axis=1)
            if projected.min() < 0 or projected.max() > 1:
                raise ValueError(f'Fir {variant} view {azimuth_index}/{elevation_index} clips normalized frame')
            depth = relative @ direction
            index = elevation_index * 8 + azimuth_index
            col, row = index % 4, index // 4
            entry['views'].append({'index': index, 'azimuthDegrees': azimuth_index * 45,
                'elevationDegrees': elevation_degrees, 'direction': direction.tolist(), 'right': right.tolist(), 'up': up.tolist(),
                'depthRange': [float(depth.min() - .01), float(depth.max() + .01)],
                'rect': [(col * 256 + 8) / 1024, (row * 512 + 8) / 2048, 240 / 1024, 496 / 2048],
                'projectedBounds': [projected.min(axis=0).tolist(), projected.max(axis=0).tolist()]})
    data['variants'].append(entry)
(ROOT / 'src/quarry-north-backdrop-atlas.json').write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8', newline='\n')
print('NORTH_BACKDROP_METADATA', len(data['variants']), 'variants; all 48 exact projected bounds inside frame')
