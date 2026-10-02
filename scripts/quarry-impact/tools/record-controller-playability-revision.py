"""Freeze the additive Controller Playability release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '0cc6524d7ce9678e697020ffb8d4423e1342b17c'
folder = Path('tests/fixtures/controller-playability')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in ([], ['--check']):
    raise SystemExit('Usage: python3 tools/record-controller-playability-revision.py [--check]')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This revision is committed; add a new layer instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/main.ts', 'src/style.css', 'src/audio.ts',
    'src/controller-input.ts', 'src/controller-navigation.ts',
    'tests/controller-input.test.ts', 'tests/controller-navigation.test.ts',
    'tests/controller-audio.test.ts', 'tests/controller-main.test.ts',
    'tests/controller-playability-invariants.ts', 'tests/controller-playability-history.test.ts',
    'tests/opposing-ai-invariants.ts', 'tools/record-controller-playability-revision.py',
]
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 730:
    raise SystemExit('Controller predecessor must retain all 730 published fixture files')

# The existing history tree is immutable. Only its newest source helper bridges
# into this additive leaf. All camera, physics, AI, backend and assets stay exact.
protected = sorted(path for path in tracked if path not in paths and (
    path.startswith(('src/', 'multiplayer/', 'tests/', 'tools/')) or
    path.startswith('public/models/') and path.endswith('.glb') or
    path in ['package.json', 'package-lock.json', 'source/model-manifest.json']))
published_models = {
    'public/models/coupe.glb': 'dc3bae23e49b8d4e5f80de5973bd38ed87b485ad40af5aee0a14d9ebf10e32ea',
    'public/models/sedan.glb': 'e5b197c08da6ce5696a62ffb76917a321168cd8f3ddf80630a6ff0e12c100e5c',
    'public/models/hatch.glb': '7a3c5661c3a8285facd4c1dac8e39238f18a92b69acbb776c7073118bbc7210c',
}
protected_hashes = {}
for path in protected:
    expected = sha(subprocess.check_output(['git', 'show', baseline + ':' + path]))
    if sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Controller scope changed protected input: ' + path)
    protected_hashes[path] = expected
model_manifest = {row['file']: row['sha256'] for row in json.loads(Path('source/model-manifest.json').read_text())}
for path, expected in published_models.items():
    if model_manifest.get(path) != expected or sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Controller changed a published vehicle asset: ' + path)
    protected_hashes[path] = expected

changed = set(subprocess.check_output(['git', 'diff', '--name-only', baseline, '--',
    'src', 'tests', 'tools', 'multiplayer', 'package.json', 'package-lock.json']).decode().splitlines())
added = set(subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard', '--',
    'src', 'tests', 'tools']).decode().splitlines())
unexpected = sorted(path for path in changed | added if path not in paths and not path.startswith(str(folder) + '/'))
if unexpected:
    raise SystemExit('Unlisted Controller source/test/tool changes: ' + ', '.join(unexpected))

def previous(path):
    return subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''

before_main = previous('src/main.ts')
current_main = Path('src/main.ts').read_bytes()
if sha(before_main) != '885634a7b49e51ca65499b51955f085f574da5915d0433fcd31d452e6aca3436':
    raise SystemExit('Controller predecessor differs from the published main baseline')
if b'\n' in current_main.replace(b'\r\n', b''):
    raise SystemExit('Controller main.ts must retain its original CRLF line endings')

# Parse declarations independently of adjacent new controller functions. A new
# poll hook cannot hide a change to simulation, camera or event construction.
main_functions = ['updateCamera', 'ai', 'step', 'recover', 'start', 'createCars']
extract = r"""
import ts from 'typescript';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const input=JSON.parse(readFileSync(0,'utf8')),result={};
for(const [version,text] of Object.entries(input.sources)){
  const source=ts.createSourceFile('main.ts',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  result[version]={};
  for(const name of input.names){
    const found=source.statements.filter(node=>ts.isFunctionDeclaration(node)&&node.name?.text===name);
    if(found.length!==1)throw new Error('Expected one main declaration: '+name);
    result[version][name]=createHash('sha256').update(found[0].getText(source)).digest('hex');
  }
}
process.stdout.write(JSON.stringify(result));
"""
function_hashes = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', extract],
    input=json.dumps({'sources': {'before': before_main.decode(), 'after': current_main.decode()},
                      'names': main_functions}).encode()))
for name in main_functions:
    if function_hashes['before'][name] != function_hashes['after'][name]:
        raise SystemExit('Controller changed protected main function: ' + name)

audio_extract = r"""
import ts from 'typescript';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sources=JSON.parse(readFileSync(0,'utf8')),result={};
for(const [version,text] of Object.entries(sources)){
  const source=ts.createSourceFile('audio.ts',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
  const sound=source.statements.find(node=>ts.isClassDeclaration(node)&&node.name?.text==='Sound');
  if(!sound)throw new Error('Missing Sound class');
  result[version]=Object.fromEntries(sound.members.filter(member=>!['init','unlock','pause','paused'].includes(member.name?.getText(source))).map(member=>[
    member.name?.getText(source),createHash('sha256').update(member.getText(source)).digest('hex')]));
}
process.stdout.write(JSON.stringify(result));
"""
audio_hashes = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', audio_extract],
    input=json.dumps({'before': previous('src/audio.ts').decode(), 'after': Path('src/audio.ts').read_text()}).encode()))
if audio_hashes['before'] != audio_hashes['after']:
    raise SystemExit('Controller changed audio outside initialization, activation and pause intent')

files = {}
snapshots = {}
for path in paths:
    before = previous(path)
    snapshot = path.replace('/', '-') + '.gz'
    snapshots[snapshot] = gzip.compress(before, mtime=0)
    files[path] = {'snapshot': snapshot, 'before': sha(before), 'after': sha(Path(path).read_bytes())}
manifest = {'baseline': baseline, 'files': files, 'protected': protected_hashes,
    'protectedMainFunctions': function_hashes['before'], 'protectedAudioMembers': audio_hashes['before'], 'previousFixtureCount': len(fixtures),
    'protectedOrigins': {path: 'published source/model-manifest.json (original untracked GLB)' for path in published_models}}
if check_only:
    print(len(files), 'Controller inputs ready;', len(protected_hashes), 'protected inputs and 730 earlier fixture files verified; no snapshots written')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'frozen Controller inputs;', len(protected_hashes), 'unchanged source, assets, physics and history inputs verified')
