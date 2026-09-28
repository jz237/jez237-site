"""Download the freely licensed original fir source for offline authoring only."""
import hashlib
import json
from pathlib import Path
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
ASSET = 'fir_tree_01'
DIRECTORY = ROOT / 'source/reference' / ASSET
SOURCE = 'https://polyhaven.com/a/' + ASSET
BASE = 'https://dl.polyhaven.org/file/ph-assets/Models/'
descriptor = DIRECTORY / (ASSET + '_2k.gltf')
data = json.loads(descriptor.read_text(encoding='utf-8'))
request = urllib.request.Request('https://api.polyhaven.com/files/' + ASSET,
    headers={'User-Agent': 'QuarryImpact/1.0 (local CC0 asset authoring)'})
with urllib.request.urlopen(request, timeout=60) as response:
    official = json.load(response)['gltf']['2k']['gltf']
files = [(descriptor.name, official)] + list(official['include'].items())
old = {r['file']: r for r in json.loads((DIRECTORY / 'manifest.json').read_text())} if (DIRECTORY / 'manifest.json').exists() else {}
records = []
for relative, record in files:
    url = record['url']
    target = DIRECTORY / relative
    if not target.exists() or target.stat().st_size != record['size']:
        target.parent.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request(url, headers={'User-Agent': 'QuarryImpact-CC0-authoring'})
        partial = target.with_suffix(target.suffix + '.part')
        with urllib.request.urlopen(request, timeout=180) as response, partial.open('wb') as output:
            while block := response.read(1024 * 1024):
                output.write(block)
        if partial.stat().st_size != record['size']:
            raise ValueError('Incomplete source download: ' + relative)
        partial.replace(target)
    if hashlib.file_digest(target.open('rb'), 'md5').hexdigest() != record['md5']:
        raise ValueError('Official source checksum mismatch: ' + relative)
    digest = hashlib.file_digest(target.open('rb'), 'sha256').hexdigest()
    if relative in old and digest != old[relative]['sha256']:
        raise ValueError('Unexpected changed local source: ' + relative)
    records.append({'file': relative, 'source': SOURCE, 'url': url, 'license': 'CC0-1.0',
        'sha256': digest, 'bytes': target.stat().st_size})
    (DIRECTORY / 'manifest.json').write_text(json.dumps(records, indent=2) + '\n', encoding='utf-8', newline='\n')
    print(relative, target.stat().st_size, digest, flush=True)
