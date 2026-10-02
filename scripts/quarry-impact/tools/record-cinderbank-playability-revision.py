"""Freeze the additive Cinderbank Playability release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '7232dbab3323bfe517c8ccaf1a44ae4f9b7d7a7e'
folder = Path('tests/fixtures/cinderbank-playability')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in (['--check'], ['--capture']):
    raise SystemExit('Use --check (read-only) or explicitly authorize --capture')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This leaf is committed; create a successor instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = ['src/course-id.ts',
 'src/race-course.ts',
 'src/main.ts',
 'src/replay-data.ts',
 'src/replay-library.ts',
 'src/event-rules.ts',
 'src/cinderbank-course.ts',
 'src/cinderbank-world.ts',
 'tests/cinderbank.test.ts',
 'tests/cinderbank-main.test.ts',
 'tests/cinderbank-settings-replay.test.ts',
 'tests/ironfield.test.ts',
 'tests/challenge-playability.test.ts',
 'tests/handbrake-playability-history.test.ts',
 'tests/challenge-playability-history.test.ts',
 'tests/handbrake-playability-invariants.ts',
 'tests/controller-playability-history.test.ts',
 'tests/club-cup-main.test.ts',
 'tests/cinderbank-playability-invariants.ts',
 'tests/cinderbank-playability-history.test.ts',
 'tools/record-cinderbank-playability-revision.py']
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 767:
    raise SystemExit('Expected all 767 immutable predecessor fixtures')

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

# Only the reviewed course dispatch, labels and replay guards may differ in
# existing production. This is exact byte normalization, never a fuzzy restore.
reviewed_production_changes = {'src/course-id.ts': [['', " 'cinderbank-oval-v1':'Cinderbank Speedway',\n"]],
 'src/event-rules.ts': [['export function checkRoute(route:readonly '
                         'RoutePoint[],x:number,z:number,next:number,lastDistance:number){\n',
                         'export function checkRoute(route:readonly '
                         'RoutePoint[],x:number,z:number,next:number,lastDistance:number,radius=12){\n'],
                        ['  return {passed:distance<12&&distance<lastDistance,distance};\n',
                         '  return {passed:distance<radius&&distance<lastDistance,distance};\n']],
 'src/main.ts': [['', "import {createCinderbankWorld} from './cinderbank-world';\r\n"],
                 ['let '
                  'quarryVenue:VenueContext,activeVenue:VenueContext,ironfieldVenue:VenueContext|undefined;\r\n',
                  'let quarryVenue:VenueContext,activeVenue:VenueContext;\r\n'
                  "const raceVenues:Partial<Record<Exclude<CourseId,'quarry-v1'>,VenueContext>>={};\r\n"],
                 ['  if(ironfieldVenue)return ironfieldVenue;\r\n',
                  '  const cached=raceVenues[id];if(cached)return cached;\r\n'],
                 ['  let artwork:ReturnType<typeof createIronfieldWorld>|undefined;\r\n',
                  '  let artwork:{root:T.Group;dispose():void}|undefined;\r\n'],
                 ['    const '
                  'course=getRaceCourse(id);course.buildPhysics!(R,world);artwork=createIronfieldWorld();\r\n'
                  '    const '
                  "checkpoint=quarry.checkpoint.clone(true);checkpoint.name='ironfield_checkpoint';checkpoint.visible=false;artwork.root.add(checkpoint);artwork.root.visible=false;scene.add(artwork.root);\r\n"
                  '    '
                  'ironfieldVenue={course,physics:world,root:artwork.root,checkpoint,props:[],puddles:[],dispose:()=>{checkpoint.removeFromParent();artwork!.dispose();world.free();}};\r\n'
                  '    return ironfieldVenue;\r\n',
                  '    const '
                  "course=getRaceCourse(id);course.buildPhysics!(R,world);artwork=id==='cinderbank-oval-v1'?createCinderbankWorld():createIronfieldWorld();\r\n"
                  '    const '
                  "checkpoint=quarry.checkpoint.clone(true);checkpoint.name=id+'_checkpoint';checkpoint.visible=false;artwork.root.add(checkpoint);artwork.root.visible=false;scene.add(artwork.root);\r\n"
                  '    const '
                  'venue:VenueContext={course,physics:world,root:artwork.root,checkpoint,props:[],puddles:[],dispose:()=>{checkpoint.removeFromParent();artwork!.dispose();world.free();}};\r\n'
                  '    raceVenues[id]=venue;return venue;\r\n'],
                 ['  ui.innerHTML = `<div class="menu"><div class="topbar"><div class="brand"><i></i> BLACKRIDGE '
                  'MOTOR CLUB</div><div class="location">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / '
                  '&nbsp; DRY TRACK</div></div><div class="intro"><div class="eyebrow">FULL CONTACT / NO '
                  'APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving '
                  'ground.<br>Take the long way home — if it still runs.</p><div '
                  'class="car-picker">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button '
                  'data-car="${k}" class="${k === kind ? \'active\' : '
                  '\'\'}">${DEFINITIONS[k].name}</button>`).join(\'\')}</div><div '
                  'class="spec">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div '
                  'class="menu-bottom">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class="mode-card '
                  '${m === mode ? \'active\' : \'\'}" data-mode="${m}"><span class="number">0${i + 1} / ${m === '
                  "'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : "
                  "'EXPLORATION'}</span><strong>${m==='race'?raceLabel(eventOptions.race==='laps'?resolveCourseId(eventOptions.course):'quarry-v1'):modes[m].label}</strong><small>${m==='race'?`${RACE_NAMES[eventOptions.race]} "
                  "· ${eventOptions.laps} ${eventOptions.race==='laps'?(eventOptions.laps===1?'lap':'laps')+' · "
                  "'+eventOptions.direction:eventOptions.laps===1?'round':'rounds'} · ${eventOptions.field} "
                  "cars`:m==='derby'?`${eventOptions.derby==='score'?'Score derby · respawns':'Last car "
                  "standing'} · ${eventOptions.field} "
                  'cars`:modes[m].description}</small></button>`).join(\'\')}<button class="primary" '
                  'id="start">${modes[mode].button}<span>↗</span></button></div><div '
                  'class="footer"><span>${CAR_KINDS.length} MACHINES &nbsp; · &nbsp; TWO VENUES &nbsp; · &nbsp; '
                  'NO PRISTINE FINISHES</span><div><a href="./licenses/CREDITS.md" target="_blank" '
                  'rel="noopener">CREDITS</a><button id="settings">SETTINGS</button><button '
                  'id="fullscreen">FULLSCREEN ↗</button></div></div></div>`;\r\n',
                  '  ui.innerHTML = `<div class="menu"><div class="topbar"><div class="brand"><i></i> BLACKRIDGE '
                  'MOTOR CLUB</div><div class="location">WOODLAND COUNTY &nbsp; / &nbsp; <b>17:42</b> &nbsp; / '
                  '&nbsp; DRY TRACK</div></div><div class="intro"><div class="eyebrow">FULL CONTACT / NO '
                  'APOLOGIES</div><h1>QUARRY<br><span>IMPACT</span></h1><p>Precision machines. Unforgiving '
                  'ground.<br>Take the long way home — if it still runs.</p><div '
                  'class="car-picker">${(Object.keys(DEFINITIONS) as CarKind[]).map((k) => `<button '
                  'data-car="${k}" class="${k === kind ? \'active\' : '
                  '\'\'}">${DEFINITIONS[k].name}</button>`).join(\'\')}</div><div '
                  'class="spec">${DEFINITIONS[kind].subtitle.toUpperCase()}</div></div><div '
                  'class="menu-bottom">${(Object.keys(modes) as Mode[]).map((m, i) => `<button class="mode-card '
                  '${m === mode ? \'active\' : \'\'}" data-mode="${m}"><span class="number">0${i + 1} / ${m === '
                  "'derby' ? 'SURVIVAL' : m === 'race' ? 'COMPETITION' : "
                  "'EXPLORATION'}</span><strong>${m==='race'?raceLabel(eventOptions.race==='laps'?resolveCourseId(eventOptions.course):'quarry-v1'):modes[m].label}</strong><small>${m==='race'?`${RACE_NAMES[eventOptions.race]} "
                  "· ${eventOptions.laps} ${eventOptions.race==='laps'?(eventOptions.laps===1?'lap':'laps')+' · "
                  "'+eventOptions.direction:eventOptions.laps===1?'round':'rounds'} · ${eventOptions.field} "
                  "cars`:m==='derby'?`${eventOptions.derby==='score'?'Score derby · respawns':'Last car "
                  "standing'} · ${eventOptions.field} "
                  'cars`:modes[m].description}</small></button>`).join(\'\')}<button class="primary" '
                  'id="start">${modes[mode].button}<span>↗</span></button></div><div '
                  'class="footer"><span>${CAR_KINDS.length} MACHINES &nbsp; · &nbsp; '
                  '${Object.keys(COURSE_NAMES).length} VENUES &nbsp; · &nbsp; NO PRISTINE FINISHES</span><div><a '
                  'href="./licenses/CREDITS.md" target="_blank" rel="noopener">CREDITS</a><button '
                  'id="settings">SETTINGS</button><button id="fullscreen">FULLSCREEN '
                  '↗</button></div></div></div>`;\r\n'],
                 ['  ui.innerHTML = `<div class="hud"><div class="hud-top"><div><div class="eyebrow">BLACKRIDGE / '
                  "${mode === 'race' ? activeVenue.course.id==='quarry-v1'?'CIRCUIT 01':'IRONFIELD RACEWAY' : "
                  '\'QUARRY FLOOR\'}</div><div class="hud-title">${eventLabel()}</div></div><div '
                  'class="event-stats"><div><span id="event-label">${mode === \'derby\' ? \'REMAINING\' : mode '
                  '=== \'race\' ? \'POSITION\' : \'FREE DRIVE\'}</span><strong id="event-value">${cars.length} / '
                  "${cars.length}</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? "
                  '\'TIME LEFT\' : \'SESSION\'}</span><strong id="time-value">05:00</strong></div><button '
                  'class="small-button" id="pause">Ⅱ</button></div></div><canvas class="minimap" id="map" '
                  'width="400" height="400"></canvas><div class="status"><div '
                  'class="status-row"><span>${DEFINITIONS[kind].name}</span><b id="health">100%</b></div><div '
                  'class="condition"><b id="health-bar" style="width:100%"></b></div><div '
                  'class="subsystems"><span id="engine-status">ENGINE OK</span><span id="steer-status">STEERING '
                  'OK</span><span id="surface">GRAVEL</span></div><div class="tyre-status" '
                  'id="tyre-status"></div></div><div class="speed"><strong id="speed">0</strong> '
                  '<span>KM/H</span><small id="gear">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class="rpm"><b '
                  'id="rpm-bar"></b></div></div><div '
                  'class="controls"><kbd>${[\'throttle\',\'reverse\',\'left\',\'right\'].map(a=>keyLabel(drivingControls.keys[a '
                  "as 'throttle'][0])).join(' ')}</kbd> DRIVE "
                  '<kbd>${keyLabel(drivingControls.keys.handbrake[0])}</kbd> HANDBRAKE <kbd>C</kbd> CAMERA '
                  "<kbd>R</kbd> RECOVER ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT "
                  '<kbd>T</kbd> TRAFFIC\' : \'\'}</div><div class="center-message" id="countdown"></div><div '
                  'id="toast"></div></div>`;\r\n',
                  '  ui.innerHTML = `<div class="hud"><div class="hud-top"><div><div class="eyebrow">BLACKRIDGE / '
                  "${mode === 'race' ? activeVenue.course.id==='quarry-v1'?'CIRCUIT "
                  "01':activeVenue.course.name.toUpperCase() : 'QUARRY FLOOR'}</div><div "
                  'class="hud-title">${eventLabel()}</div></div><div class="event-stats"><div><span '
                  'id="event-label">${mode === \'derby\' ? \'REMAINING\' : mode === \'race\' ? \'POSITION\' : '
                  '\'FREE DRIVE\'}</span><strong id="event-value">${cars.length} / '
                  "${cars.length}</strong></div><div><span>${mode === 'race' ? 'LAP / TIME' : mode === 'derby' ? "
                  '\'TIME LEFT\' : \'SESSION\'}</span><strong id="time-value">05:00</strong></div><button '
                  'class="small-button" id="pause">Ⅱ</button></div></div><canvas class="minimap" id="map" '
                  'width="400" height="400"></canvas><div class="status"><div '
                  'class="status-row"><span>${DEFINITIONS[kind].name}</span><b id="health">100%</b></div><div '
                  'class="condition"><b id="health-bar" style="width:100%"></b></div><div '
                  'class="subsystems"><span id="engine-status">ENGINE OK</span><span id="steer-status">STEERING '
                  'OK</span><span id="surface">GRAVEL</span></div><div class="tyre-status" '
                  'id="tyre-status"></div></div><div class="speed"><strong id="speed">0</strong> '
                  '<span>KM/H</span><small id="gear">GEAR 1 &nbsp; / &nbsp; 850 RPM</small><div class="rpm"><b '
                  'id="rpm-bar"></b></div></div><div '
                  'class="controls"><kbd>${[\'throttle\',\'reverse\',\'left\',\'right\'].map(a=>keyLabel(drivingControls.keys[a '
                  "as 'throttle'][0])).join(' ')}</kbd> DRIVE "
                  '<kbd>${keyLabel(drivingControls.keys.handbrake[0])}</kbd> HANDBRAKE <kbd>C</kbd> CAMERA '
                  "<kbd>R</kbd> RECOVER ${mode === 'playground' && !online?.active ? '<kbd>I</kbd> INSPECT "
                  '<kbd>T</kbd> TRAFFIC\' : \'\'}</div><div class="center-message" id="countdown"></div><div '
                  'id="toast"></div></div>`;\r\n'],
                 ['', '        activeVenue.course.checkpointRadius,\r\n'],
                 ['    get '
                  'courseState(){return{id:activeVenue.course.id,quarryVisible:quarryVenue.root.visible,ironfieldVisible:ironfieldVenue?.root.visible??false,bodies:physics.bodies.len(),colliders:physics.colliders.len(),quarryBodies:quarryVenue.physics.bodies.len(),ironfieldBodies:ironfieldVenue?.physics.bodies.len()??0};},\r\n',
                  '    get '
                  "courseState(){return{id:activeVenue.course.id,quarryVisible:quarryVenue.root.visible,ironfieldVisible:raceVenues['ironfield-figure-eight-v1']?.root.visible??false,cinderbankVisible:raceVenues['cinderbank-oval-v1']?.root.visible??false,bodies:physics.bodies.len(),colliders:physics.colliders.len(),quarryBodies:quarryVenue.physics.bodies.len(),ironfieldBodies:raceVenues['ironfield-figure-eight-v1']?.physics.bodies.len()??0,cinderbankBodies:raceVenues['cinderbank-oval-v1']?.physics.bodies.len()??0};},\r\n"]],
 'src/race-course.ts': [['', "import {CINDERBANK} from './cinderbank-course';\n"],
                        ['',
                         ' /** Wide circuits include their usable shoulders; legacy courses keep 12m. */\n'
                         ' readonly checkpointRadius?:number;\n'],
                        ['export const '
                         "getRaceCourse=(id:CourseId='quarry-v1'):RaceCourse=>id==='ironfield-figure-eight-v1'?IRONFIELD:QUARRY_COURSE;\n"
                         'const '
                         'ironfieldReverse=[IRONFIELD.checkpoints[0],...IRONFIELD.checkpoints.slice(1).reverse()];\n',
                         'const '
                         "COURSES:Record<CourseId,RaceCourse>={'quarry-v1':QUARRY_COURSE,'ironfield-figure-eight-v1':IRONFIELD,'cinderbank-oval-v1':CINDERBANK};\n"
                         "export const getRaceCourse=(id:CourseId='quarry-v1'):RaceCourse=>COURSES[id];\n"
                         'const reverseRoutes=new WeakMap<RaceCourse,readonly RoutePoint[]>();\n'],
                        [" return direction==='reverse'?ironfieldReverse:IRONFIELD.checkpoints;\n",
                         " if(direction!=='reverse')return course.checkpoints;\n"
                         ' let route=reverseRoutes.get(course);\n'
                         ' '
                         'if(!route){route=[course.checkpoints[0],...course.checkpoints.slice(1).reverse()];reverseRoutes.set(course,route);}\n'
                         ' return route;\n'],
                        ['/** Keep every old Quarry grid value exact. Ironfield is arc-length sampled. */\n',
                         '/** Keep every old Quarry grid value exact. Other circuits are arc-length sampled. '
                         '*/\n']],
 'src/replay-data.ts': [["  if(id==='ironfield-figure-eight-v1'&&meta.mode!=='race')throw Error('Ironfield "
                         "replays support circuit races only.');\n",
                         "  if(id!=='quarry-v1'&&meta.mode!=='race')throw Error('This course supports circuit "
                         "races only.');\n"]],
 'src/replay-library.ts': [['export const '
                            "defaultReplayName=(doc:ReplayDocument)=>`${doc.meta.courseId==='ironfield-figure-eight-v1'?COURSE_NAMES[doc.meta.courseId]+' "
                            "· ':''}${doc.meta.mode==='race'?'Race':doc.meta.mode==='derby'?'Derby':'Playground'} "
                            "· ${doc.meta.created.slice(0,19).replace('T',' ')}`;\n",
                            'export const '
                            "defaultReplayName=(doc:ReplayDocument)=>`${doc.meta.courseId&&doc.meta.courseId!=='quarry-v1'?COURSE_NAMES[doc.meta.courseId]+' "
                            "· ':''}${doc.meta.mode==='race'?'Race':doc.meta.mode==='derby'?'Derby':'Playground'} "
                            "· ${doc.meta.created.slice(0,19).replace('T',' ')}`;\n"]]}
known_before = {'src/course-id.ts': 'df65f9a245de30a0ace6681dfaf98fe3e9bd601a10caf0d87608fc434171dc5a',
 'src/event-rules.ts': 'edf4c2fe60d77cd63edd2865a59b54f03513eed9df548cd55af221fa27646282',
 'src/main.ts': 'b66c9e7153ab451feafb2aa1a17cf0b4b7c3e9f89fe8233f702699b2f58be81e',
 'src/race-course.ts': 'bfe474fba949b4ae4058517ccb7a9ebf9993e5ed20d8ea588fb5407bfc21085f',
 'src/replay-data.ts': 'e6c388ed4d266f3552914565097fff384deeb23971c00b54431a1e2fa6d2bb7d',
 'src/replay-library.ts': 'b4eaf74c06496272b69f807f919fa12edc9c781ef77821a19c4ebf129f53dd18'}
normalized_hashes = {}
for path, changes in reviewed_production_changes.items():
    normalized = Path(path).read_bytes()
    for before, after in changes:
        if normalized.count(after.encode()) != 1:
            raise SystemExit('Expected reviewed production change exactly once: ' + path)
        normalized = normalized.replace(after.encode(), before.encode(), 1)
    if normalized != previous(path) or sha(normalized) != known_before[path]:
        raise SystemExit('Production changed outside the reviewed course integration: ' + path)
    normalized_hashes[path] = sha(normalized)

# Historical assertions and hashes are preserved. Their only adaptations are
# exact registry/catalogue expectations or explicit successor normalization.
reviewed_history_changes = {'tests/challenge-playability-history.test.ts': [["import test from 'node:test';\n",
                                                  "import test from 'node:test';\n"
                                                  'import {normalizeCinderbankMain} from '
                                                  "'./cinderbank-playability-invariants';\n"],
                                                 [' const '
                                                  "current=source('src/main.ts').toString(),before=readChallengePlayabilityPrevious('src/main.ts').toString(),manifest=revision();",
                                                  ' const '
                                                  "current=normalizeCinderbankMain(source('src/main.ts')).toString(),before=readChallengePlayabilityPrevious('src/main.ts').toString(),manifest=revision();"],
                                                 [" let current=source('src/main.ts').toString();",
                                                  ' let '
                                                  "current=normalizeCinderbankMain(source('src/main.ts')).toString();"]],
 'tests/challenge-playability.test.ts': [['assert.deepEqual([...new '
                                          "Set(added.filter(c=>c.mode==='race').map(challengeCourse))].sort(),Object.keys(COURSE_NAMES).sort());",
                                          'assert.deepEqual([...new '
                                          "Set(added.filter(c=>c.mode==='race').map(challengeCourse))].sort(),['quarry-v1','ironfield-figure-eight-v1'].sort());"]],
 'tests/club-cup-main.test.ts': [["import {resolveCourseId} from '../src/course-id';",
                                  "import {COURSE_NAMES,resolveCourseId} from '../src/course-id';"],
                                 [' const context:any={T,...Cup,RACE_NAMES,structuredClone,',
                                  ' const context:any={T,...Cup,COURSE_NAMES,RACE_NAMES,structuredClone,']],
 'tests/controller-playability-history.test.ts': [["import test from 'node:test';\n",
                                                   "import test from 'node:test';\n"
                                                   'import {normalizeCinderbankMain} from '
                                                   "'./cinderbank-playability-invariants';\n"],
                                                  [' const main=readFileSync(new '
                                                   "URL('../src/main.ts',import.meta.url)).toString();",
                                                   ' const main=normalizeCinderbankMain(readFileSync(new '
                                                   "URL('../src/main.ts',import.meta.url))).toString();"]],
 'tests/handbrake-playability-history.test.ts': [["import test from 'node:test';\n",
                                                  "import test from 'node:test';\n"
                                                  'import {normalizeCinderbankMain} from '
                                                  "'./cinderbank-playability-invariants';\n"],
                                                 [" const main=source('src/main.ts');\n",
                                                  ' const '
                                                  "main=normalizeCinderbankMain(source('src/main.ts'));\n"]],
 'tests/handbrake-playability-invariants.ts': [["import assert from 'node:assert/strict';\n",
                                                "import assert from 'node:assert/strict';\n"
                                                'import '
                                                '{restoreCinderbankPlayabilityBytes,verifyCinderbankPlayabilityRevision} '
                                                "from './cinderbank-playability-invariants';\n"],
                                               ['export function '
                                                'restoreHandbrakePlayabilityBytes(file:string,bytes:Buffer):Buffer{\n',
                                                'export function '
                                                'restoreHandbrakePlayabilityBytes(file:string,bytes:Buffer):Buffer{\n'
                                                ' bytes=restoreCinderbankPlayabilityBytes(file,bytes);\n'],
                                               ['export function verifyHandbrakePlayabilityRevision():void{\n',
                                                'export function verifyHandbrakePlayabilityRevision():void{\n'
                                                ' verifyCinderbankPlayabilityRevision();\n'],
                                               ['const bytes=readFileSync(new '
                                                "URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);",
                                                'const '
                                                'bytes=restoreCinderbankPlayabilityBytes(file,readFileSync(new '
                                                "URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);"],
                                               ['hash(readFileSync(new '
                                                "URL('../'+file,import.meta.url))),expected,file+' stays "
                                                "unchanged during handbrake playability'",
                                                'hash(restoreCinderbankPlayabilityBytes(file,readFileSync(new '
                                                "URL('../'+file,import.meta.url)))),expected,file+' stays "
                                                "unchanged during handbrake playability'"]],
 'tests/ironfield.test.ts': [["assert.deepEqual(Object.keys(COURSE_NAMES),['quarry-v1','ironfield-figure-eight-v1']);",
                              "assert.deepEqual(Object.keys(COURSE_NAMES),['quarry-v1','ironfield-figure-eight-v1','cinderbank-oval-v1']);"]]}
known_history_before = {'tests/challenge-playability-history.test.ts': '738a1aad7e79a4ef23cc06983c709c385aab3f2358395e60012830cd154bf101',
 'tests/challenge-playability.test.ts': 'e000870cde32a5a44623368de2d3efbac226055cb30184bf5bb83c64b9c102a5',
 'tests/club-cup-main.test.ts': 'cd0c6ce02ff38e83959a550094c372910bfcdfad0592c81175149ee20a775e71',
 'tests/controller-playability-history.test.ts': 'c06a25648271049019a49f563a338dedc0d62fab869d0d10dc34e47d3944437d',
 'tests/handbrake-playability-history.test.ts': '72f93efd36de2f6584e16f5be8263de4cd393d29d6b68962d9b8768f44b6d2c5',
 'tests/handbrake-playability-invariants.ts': '825a6bced2060ca435f19a2798f1d71d00dddb943ca46fd6cc196c0dc8fda7ea',
 'tests/ironfield.test.ts': '8e149fcb5a8eae10539ec7c80f6cdbd9c4b7065781576eb5d42165a098f1f0a6'}
normalized_history_hashes = {}
for path, changes in reviewed_history_changes.items():
    normalized = Path(path).read_bytes()
    for before, after in changes:
        if normalized.count(after.encode()) != 1:
            raise SystemExit('Expected reviewed history change exactly once: ' + path)
        normalized = normalized.replace(after.encode(), before.encode(), 1)
    if normalized != previous(path) or sha(normalized) != known_history_before[path]:
        raise SystemExit('Historical test changed outside its reviewed adaptation: ' + path)
    normalized_history_hashes[path] = sha(normalized)

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


main_functions = ['updateCamera', 'ai', 'step', 'recover', 'start', 'createCars', 'beginReplay', 'bankRun', 'frame', 'controllerContext', 'controllerKey', 'pollController', 'input', 'pause', 'resume', 'openStudio', 'closeStudio', 'captureReplay']
main_for_declarations = Path('src/main.ts').read_bytes().decode().replace('        activeVenue.course.checkpointRadius,\r\n', '', 1)
main_hashes = unchanged_declarations('main.ts', previous('src/main.ts').decode(), main_for_declarations, main_functions)
files, snapshots = {}, {}
for path in paths:
    before = previous(path)
    snapshot = path.replace('/', '-') + '.gz'
    snapshots[snapshot] = gzip.compress(before, mtime=0)
    files[path] = {'snapshot': snapshot, 'before': sha(before), 'after': sha(Path(path).read_bytes())}
manifest = {
    'baseline': baseline, 'files': files, 'protected': protected_hashes,
    'previousFixtureCount': len(fixtures), 'normalizedSourceSha256': normalized_hashes,
    'normalizedHistoricalTestsSha256': normalized_history_hashes, 'protectedMainFunctions': main_hashes,
    'protectedOrigins': {path: 'published source/model-manifest.json (original untracked GLB)' for path in published_models},
}
expected_names = set(snapshots) | {'revision.json'}
if folder.exists() and any(not path.is_file() or path.name not in expected_names for path in folder.iterdir()):
    raise SystemExit('Unexpected file or directory in the new leaf')
if check_only:
    print(len(files), 'candidate inputs ready;', len(protected_hashes), 'protected inputs and all 767 old fixtures verified; no writes')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'newly captured Cinderbank inputs; all 767 older fixtures preserved')
