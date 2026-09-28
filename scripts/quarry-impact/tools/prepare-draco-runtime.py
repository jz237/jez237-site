"""Bundle the installed Three.js glTF Draco decoder; no runtime CDN requests."""
import hashlib
from pathlib import Path
import shutil
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'node_modules/three/examples/jsm/libs/draco/gltf'
target = ROOT / 'public/models/draco'
target.mkdir(parents=True, exist_ok=True)
for name in ['draco_wasm_wrapper.js', 'draco_decoder.wasm', 'draco_decoder.js']:
    shutil.copyfile(source / name, target / name)
license_path = target / 'LICENSE'
if not license_path.exists():
    request = urllib.request.Request('https://raw.githubusercontent.com/google/draco/main/LICENSE',
        headers={'User-Agent': 'QuarryImpact-license-preservation'})
    with urllib.request.urlopen(request, timeout=30) as response:
        license_path.write_bytes(response.read())
for path in target.iterdir():
    print(path.name, path.stat().st_size, hashlib.sha256(path.read_bytes()).hexdigest())
