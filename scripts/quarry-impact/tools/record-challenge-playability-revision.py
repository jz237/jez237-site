"""Freeze the additive Challenge Playability release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '8fa7c2a41ad0f6a80013cab91b17c8f983fe1582'
folder = Path('tests/fixtures/challenge-playability')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in (['--check'], ['--capture']):
    raise SystemExit('Use --check (read-only) or explicitly authorize --capture')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This leaf is committed; create a successor instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = [
    'src/challenges.ts', 'src/main.ts', 'src/profile-ui.ts',
    'tests/progression.test.ts', 'tests/challenge-playability.test.ts', 'tests/challenge-main.test.ts',
    'tests/challenge-playability-invariants.ts', 'tests/challenge-playability-history.test.ts',
    'tests/controller-playability-invariants.ts', 'tools/record-challenge-playability-revision.py',
]
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 744:
    raise SystemExit('Expected all 744 immutable predecessor fixtures')

def previous(path):
    return subprocess.check_output(['git', 'show', baseline + ':' + path]) if path in tracked else b''

protected = sorted(path for path in tracked if path not in paths and (
    path.startswith(('src/', 'tests/', 'tools/', 'multiplayer/', 'public/', 'source/')) or
    path in ['package.json', 'package-lock.json']))
protected_hashes = {}
for path in protected:
    expected = sha(previous(path))
    if sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Protected source/history/asset changed: ' + path)
    protected_hashes[path] = expected
published_models = {
    'public/models/coupe.glb': 'dc3bae23e49b8d4e5f80de5973bd38ed87b485ad40af5aee0a14d9ebf10e32ea',
    'public/models/sedan.glb': 'e5b197c08da6ce5696a62ffb76917a321168cd8f3ddf80630a6ff0e12c100e5c',
    'public/models/hatch.glb': '7a3c5661c3a8285facd4c1dac8e39238f18a92b69acbb776c7073118bbc7210c',
}
model_manifest = {entry['file']: entry['sha256'] for entry in json.loads(Path('source/model-manifest.json').read_text())}
for path, expected in published_models.items():
    if model_manifest.get(path) != expected or sha(Path(path).read_bytes()) != expected:
        raise SystemExit('Original published vehicle changed: ' + path)
    protected_hashes[path] = expected
changed = set(subprocess.check_output(['git', 'diff', '--name-only', baseline, '--',
    'src', 'tests', 'tools', 'multiplayer', 'public', 'source', 'package.json', 'package-lock.json']).decode().splitlines())
added = set(subprocess.check_output(['git', 'ls-files', '--others', '--exclude-standard', '--', 'src', 'tests', 'tools']).decode().splitlines())
unexpected = sorted(path for path in changed | added if path not in paths and not path.startswith(str(folder) + '/'))
if unexpected:
    raise SystemExit('Unlisted candidate input: ' + ', '.join(unexpected))
missing = [path for path in paths if not Path(path).is_file()]
if missing:
    raise SystemExit('Candidate is incomplete: ' + ', '.join(missing))

before_main = previous('src/main.ts')
current_main = Path('src/main.ts').read_bytes()
if sha(before_main) != '46cc37f3d98a0bfc2690e307e4032374b7857fd590b71f7cb88f4d9df6d2cd4b':
    raise SystemExit('Unexpected published controller main source')
if b'\n' in current_main.replace(b'\r\n', b''):
    raise SystemExit('Main must preserve CRLF')

# Exact syntax from actual current files, independent of whole-file restoration.
extract = r"""
import ts from 'typescript';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const input=JSON.parse(readFileSync(0,'utf8')),result={};
for(const [version,text]of Object.entries(input.sources)){
 const source=ts.createSourceFile(input.filename,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 result[version]={};
 for(const name of input.names){
  const found=[];
  for(const node of source.statements){
   if(ts.isFunctionDeclaration(node)&&node.name?.text===name)found.push(node.getText(source));
   if(ts.isVariableStatement(node))for(const declaration of node.declarationList.declarations)
    if(ts.isIdentifier(declaration.name)&&declaration.name.text===name)found.push(node.getText(source));
  }
  if(found.length!==1)throw Error('Expected one declaration '+name);
  result[version][name]=createHash('sha256').update(found[0]).digest('hex');
 }
}
process.stdout.write(JSON.stringify(result));
"""

def unchanged_declarations(filename, before, after, names):
    values = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', extract], input=json.dumps({
        'filename': filename, 'sources': {'before': before, 'after': after}, 'names': names}).encode()))
    for name in names:
        if values['before'][name] != values['after'][name]:
            raise SystemExit('Protected declaration changed: ' + filename + ':' + name)
    return values['before']

main_functions = ['updateCamera', 'ai', 'step', 'recover', 'start', 'createCars', 'beginReplay', 'bankRun',
    'hud', 'frame', 'controllerContext', 'controllerKey', 'pollController', 'input', 'pause', 'resume', 'openStudio', 'closeStudio', 'captureReplay']
main_hashes = unchanged_declarations('main.ts', before_main.decode(), current_main.decode(), main_functions)
scoring_functions = ['challengeValue', 'challengeMedal', 'lowerIsBetter', 'formatChallengeValue']
scoring_hashes = unchanged_declarations('challenges.ts', previous('src/challenges.ts').decode(), Path('src/challenges.ts').read_text(), scoring_functions)
normalized = current_main.decode()
main_reverts = [
    [
        "import { CHALLENGES, challengeValue, formatChallengeValue, challengeVenueName, type Challenge, type Discipline } from './challenges';",
        "import { CHALLENGES, challengeValue, formatChallengeValue, type Challenge } from './challenges';"
    ],
    [
        "function openProfile(initialDiscipline:Discipline='racing'){",
        "function openProfile(){"
    ],
    [
        "},profileStorageWarning,initialDiscipline);",
        "},profileStorageWarning);"
    ],
    [
        "const preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!online?.active&&raceFormat()==='laps'?resolveCourseId(activeChallenge?activeChallenge.course:demo?demoOptions.course:eventOptions.course):'quarry-v1');",
        "const preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!activeChallenge&&!online?.active&&raceFormat()==='laps'?resolveCourseId(demo?demoOptions.course:eventOptions.course):'quarry-v1');"
    ],
    [
        "profileButton.onclick=()=>openProfile();",
        "profileButton.onclick=openProfile;"
    ],
    [
        "${challengeVenueName(activeChallenge)} / ${activeChallenge.title.toUpperCase()} / CHALLENGE",
        "${activeChallenge.title.toUpperCase()} / CHALLENGE"
    ],
    [
        "ui.querySelector<HTMLButtonElement>('#challenge-board')!.onclick=()=>{const discipline=activeChallenge!.discipline;createCars(true);menu();openProfile(discipline);};",
        "ui.querySelector<HTMLButtonElement>('#challenge-board')!.onclick=()=>{createCars(true);menu();openProfile();};"
    ]
]
for after, before in main_reverts:
    if normalized.count(after) != 1:
        raise SystemExit('Expected a reviewed main change exactly once: ' + after)
    normalized = normalized.replace(after, before, 1)
if normalized != before_main.decode():
    raise SystemExit('Main changed outside the seven reviewed routing/label/category replacements')
profile_hashes = unchanged_declarations('main.ts', before_main.decode(), normalized, ['openProfile', 'menu'])

files, snapshots = {}, {}
for path in paths:
    before = previous(path)
    snapshot = path.replace('/', '-') + '.gz'
    snapshots[snapshot] = gzip.compress(before, mtime=0)
    files[path] = {'snapshot': snapshot, 'before': sha(before), 'after': sha(Path(path).read_bytes())}
manifest = {
    'baseline': baseline, 'files': files, 'protected': protected_hashes,
    'previousFixtureCount': len(fixtures), 'protectedMainFunctions': main_hashes,
    'protectedChallengeFunctions': scoring_hashes, 'protectedProfileNavigation': profile_hashes,
    'normalizedMainSha256': sha(normalized.encode()),
    'originalCatalogueSha256': '027c250b727dac72ea1fe7e99d6af35ab2b166f9b76bffecc824b7c3fe0e3d86',
    'protectedOrigins': {path: 'published source/model-manifest.json (original untracked GLB)' for path in published_models},
}
expected_names = set(snapshots) | {'revision.json'}
if folder.exists() and any(not path.is_file() or path.name not in expected_names for path in folder.iterdir()):
    raise SystemExit('Unexpected file or directory in the new leaf')
if check_only:
    print(len(files), 'candidate inputs ready;', len(protected_hashes), 'protected inputs and all 744 old fixtures verified; no writes')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'newly captured challenge inputs; all 744 older fixtures preserved')
