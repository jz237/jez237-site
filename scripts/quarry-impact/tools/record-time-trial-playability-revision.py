"""Freeze the additive Time Trial Playability release; --check never writes."""
from pathlib import Path
import gzip
import hashlib
import json
import subprocess
import sys

baseline = '004353fd1511692fd2a4564ac12d58976457fb02'
folder = Path('tests/fixtures/time-trial-playability')
revision_path = folder / 'revision.json'
if sys.argv[1:] not in (['--check'], ['--capture']):
    raise SystemExit('Use --check (read-only) or explicitly authorize --capture')
check_only = sys.argv[1:] == ['--check']
if subprocess.run(['git', 'cat-file', '-e', 'HEAD:' + str(revision_path)], capture_output=True).returncode == 0:
    raise SystemExit('This leaf is committed; create a successor instead of recapturing it')
subprocess.run(['git', 'cat-file', '-e', baseline + '^{commit}'], check=True)
paths = ['src/main.ts',
 'src/time-trial.ts',
 'src/time-trial-ui.ts',
 'tests/time-trial.test.ts',
 'tests/time-trial-ui.test.ts',
 'tests/time-trial-main.test.ts',
 'tests/cinderbank-playability-invariants.ts',
 'tests/cinderbank-playability-history.test.ts',
 'tests/club-cup-main.test.ts',
 'tests/challenge-main.test.ts',
 'tests/course-start.test.ts',
 'tests/controller-main.test.ts',
 'tests/cinderbank-main.test.ts',
 'tests/opposing-vehicle.test.ts',
 'tests/time-trial-playability-invariants.ts',
 'tests/time-trial-playability-history.test.ts',
 'tools/record-time-trial-playability-revision.py']
sha = lambda data: hashlib.sha256(data).hexdigest()
tracked = set(subprocess.check_output(['git', 'ls-tree', '-r', '--name-only', baseline]).decode().splitlines())
fixtures = sorted(path for path in tracked if path.startswith('tests/fixtures/'))
if len(fixtures) != 789:
    raise SystemExit('Expected all 789 immutable predecessor fixtures')

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

# This exact reviewed diff is independent of the new manifest. Every other
# byte of main, including CRLF and unrelated top-level handlers, stays published.
main_changes = [["import { GARAGE_KEY, readGarage, type Setup } from './garage';\r\n",
  "import { GARAGE_KEY, readGarage, stockSetup, type Setup } from './garage';\r\n"],
 ['',
  'import '
  '{loadTimeTrialRecords,saveTimeTrialRecords,isTimeTrialConfig,timeTrialBest,formatTrialTime,finishTimeTrialRecord,type '
  "TimeTrialConfig,type TimeTrialResult} from './time-trial';\r\n"
  "import {showTimeTrialSetup,showTimeTrialResult} from './time-trial-ui';\r\n"],
 ['const customEvent=()=>activeClubRound===null&&!activeChallenge&&!online?.active;\r\n',
  'const customEvent=()=>activeClubRound===null&&!activeChallenge&&!activeTimeTrial&&!online?.active;\r\n'],
 ['const '
  "raceDirection=(id=0)=>directionForCar(raceFormat()==='laps'?(onlineRules()?.direction??(customEvent()?eventOptions.direction:'forward')):'forward',id);\r\n",
  'const '
  "raceDirection=(id=0)=>directionForCar(raceFormat()==='laps'?(onlineRules()?.direction??activeTimeTrial?.direction??(customEvent()?eventOptions.direction:'forward')):'forward',id);\r\n"],
 ['',
  'const initialTimeTrial=loadTimeTrialRecords();\r\n'
  'let timeTrialRecords=initialTimeTrial.records,timeTrialWarning=initialTimeTrial.warning;\r\n'
  'let activeTimeTrial:Readonly<TimeTrialConfig>|null=null,timeTrialSelection:TimeTrialConfig|undefined;\r\n'
  "let timeTrialOpen=false,timeTrialInvalidReason='',timeTrialResult:TimeTrialResult|null=null;\r\n"
  'function openTimeTrialSetup(){\r\n'
  '  if(preparingEvent||online?.active)return;\r\n'
  '  timeTrialOpen=true;keys.clear();\r\n'
  '  const '
  "config:TimeTrialConfig={kind,course:timeTrialSelection?.course??resolveCourseId(eventOptions.course),direction:timeTrialSelection?.direction??(eventOptions.direction==='reverse'?'reverse':'forward')};\r\n"
  '  showTimeTrialSetup(ui,config,timeTrialRecords,{start:config=>{void '
  'startTimeTrial(config);},close:()=>{timeTrialOpen=false;menu();}},timeTrialWarning);\r\n'
  '}\r\n'
  'async function startTimeTrial(config:TimeTrialConfig){\r\n'
  "  if(preparingEvent||online?.active||!isTimeTrialConfig(config)||!['menu','result'].includes(state))return "
  'false;\r\n'
  '  '
  'bankRun(false);telemetry=null;activeChallenge=undefined;activeClubRound=null;clubOpen=false;timeTrialOpen=false;\r\n'
  '  '
  "activeTimeTrial=Object.freeze({...config});timeTrialSelection={...config};kind=config.kind;mode='race';\r\n"
  '  return start(false);\r\n'
  '}\r\n'
  'function finishTimeTrial(){\r\n'
  '  const config=activeTimeTrial;if(!config)return;\r\n'
  '  const player=cars[0],run=telemetry?.stats??null;\r\n'
  '  '
  'if(run)Object.assign(run,{completed:true,finished:player.finished&&player.health>0,health:player.health,rank:0,won:false,checkpoints:player.passed});\r\n'
  '  const '
  "outcome=finishTimeTrialRecord(timeTrialRecords,config,{run,finished:player.finished,health:player.health,passed:player.passed,finishTime:player.finished?player.finishTime:elapsed+player.penalty,demo,online:!!online?.active,synthetic:autopilot||!!testInput||!!timeTrialInvalidReason&&timeTrialInvalidReason!=='RECOVERY "
  "USED',stock:cars.length===1&&player.kind===config.kind&&activeVenue.course.id===config.course&&raceDirection()===config.direction&&JSON.stringify(player.setup)===JSON.stringify(stockSetup(player.kind))});\r\n"
  '  timeTrialRecords=outcome.records;timeTrialResult=outcome.result;\r\n'
  "  if(timeTrialResult.eligible)timeTrialWarning=saveTimeTrialRecords(timeTrialRecords)?'':'Personal bests "
  "are available for this session, but browser storage could not save them.';\r\n"
  '  bankRun(true);keys.clear();testInput=null;\r\n'
  '  showTimeTrialResult(ui,config,timeTrialResult,{\r\n'
  '    retry:()=>{void start(false);},\r\n'
  '    setup:()=>{createCars(true);menu();openTimeTrialSetup();},\r\n'
  '    close:()=>{createCars(true);menu();},\r\n'
  "  },[timeTrialWarning,profileStorageWarning,awardText(lastAward)].filter(Boolean).join(' '));\r\n"
  '  const '
  "replayActions=document.createElement('div');replayActions.className='event-actions';ui.querySelector('#time-trial-result "
  ".event-panel')!.append(replayActions);studioButtons(replayActions);\r\n"
  '  '
  "ui.querySelector<HTMLButtonElement>('#replay-mode')!.onclick=()=>openStudio(false,undefined,`${COURSE_NAMES[config.course]} "
  '· Time Trial · ${DEFINITIONS[config.kind].name} · ${config.direction}`);\r\n'
  '}\r\n'],
 ['const '
  'raceLaps=()=>clubRound()?.laps??(online?.active?onlineRules()?.laps??3:activeChallenge?.laps??(demo?demoOptions.laps:eventOptions.laps));\r\n',
  'const '
  'raceLaps=()=>clubRound()?.laps??(online?.active?onlineRules()?.laps??3:activeTimeTrial?1:activeChallenge?.laps??(demo?demoOptions.laps:eventOptions.laps));\r\n'],
 ['  '
  'showDriverProfile(ui,profile,{close:()=>{profileOpen=false;menu();},start:challenge=>{profileOpen=false;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void '
  'start(false);}},profileStorageWarning,initialDiscipline);\r\n',
  '  '
  'showDriverProfile(ui,profile,{close:()=>{profileOpen=false;menu();},start:challenge=>{profileOpen=false;activeTimeTrial=null;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void '
  'start(false);}},profileStorageWarning,initialDiscipline);\r\n'],
 ['  '
  'clubOpen=false;activeChallenge=undefined;demo=false;kind=clubCup.roster[0].kind;mode=CLUB_ROUNDS[activeClubRound].mode;\r\n',
  '  '
  'clubOpen=false;activeTimeTrial=null;timeTrialOpen=false;activeChallenge=undefined;demo=false;kind=clubCup.roster[0].kind;mode=CLUB_ROUNDS[activeClubRound].mode;\r\n'],
 ['  recorder=new '
  "ReplayRecorder({version:1,tyreModel:1,...(activeVenue.course.id==='quarry-v1'?{}:{courseId:activeVenue.course.id}),mode,reverse:mode==='race'&&customEvent()&&eventOptions.direction==='reverse',cars:cars.map(c=>({id:c.id,kind:c.kind,setup:{...structuredClone(c.setup),paint:c.paintColor.getHex()}})),props:activeVenue.props.length,created:new "
  'Date().toISOString()});\r\n',
  '  recorder=new '
  "ReplayRecorder({version:1,tyreModel:1,...(activeVenue.course.id==='quarry-v1'?{}:{courseId:activeVenue.course.id}),mode,reverse:mode==='race'&&(activeTimeTrial?activeTimeTrial.direction==='reverse':customEvent()&&eventOptions.direction==='reverse'),cars:cars.map(c=>({id:c.id,kind:c.kind,setup:{...structuredClone(c.setup),paint:c.paintColor.getHex()}})),props:activeVenue.props.length,created:new "
  'Date().toISOString()});\r\n'],
 ['const '
  "preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!online?.active&&raceFormat()==='laps'?resolveCourseId(activeChallenge?activeChallenge.course:demo?demoOptions.course:eventOptions.course):'quarry-v1');\r\n",
  'const '
  "preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!online?.active&&raceFormat()==='laps'?resolveCourseId(activeTimeTrial?.course??(activeChallenge?activeChallenge.course:demo?demoOptions.course:eventOptions.course)):'quarry-v1');\r\n"],
 ['  archiveReplay();bankRun(false);telemetry=null;activeChallenge=undefined;\r\n',
  '  '
  "archiveReplay();bankRun(false);telemetry=null;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';\r\n"],
 ['',
  '  const '
  "trialButton=document.createElement('button');trialButton.id='time-trial';trialButton.className='small-button';trialButton.textContent='TIME "
  'TRIAL · PERSONAL '
  "BESTS';trialButton.onclick=()=>openTimeTrialSetup();ui.querySelector('.intro')!.append(trialButton);\r\n"],
 ['  '
  'archiveReplay();waypointRace=null;bankRun(false);telemetry=null;activeChallenge=undefined;lastAward=null;\r\n',
  '  '
  "archiveReplay();waypointRace=null;bankRun(false);telemetry=null;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';lastAward=null;\r\n"],
 ["  const count = attract ? 1 : activeClubRound!==null ? clubCup!.roster.length : mode === 'playground' ? "
  '((activeChallenge?activeChallenge.traffic:traffic) ? 5 : 1) : '
  'activeChallenge?8:demo?demoOptions.field:eventOptions.field;\r\n',
  '  const count = attract ? 1 : activeTimeTrial ? 1 : activeClubRound!==null ? clubCup!.roster.length : mode '
  "=== 'playground' ? ((activeChallenge?activeChallenge.traffic:traffic) ? 5 : 1) : "
  'activeChallenge?8:demo?demoOptions.field:eventOptions.field;\r\n'],
 ['    const '
  'setup=!attract&&activeClubRound!==null?undefined:demo&&!attract?demoVehicleSetup(type,demoOptions,garage):i===0 '
  '&& (attract || !demo) && !activeChallenge ? previewSetup??garage.cars[type].setup : undefined;\r\n',
  '    const '
  'setup=!attract&&activeTimeTrial?stockSetup(type):!attract&&activeClubRound!==null?undefined:demo&&!attract?demoVehicleSetup(type,demoOptions,garage):i===0 '
  '&& (attract || !demo) && !activeChallenge ? previewSetup??garage.cars[type].setup : undefined;\r\n'],
 ['      const '
  "spawn=courseGridSlot(activeVenue.course,i,customEvent()&&raceFormat()==='laps'?eventOptions.direction:'forward');\r\n",
  '      const '
  "spawn=courseGridSlot(activeVenue.course,i,activeTimeTrial?.direction??(customEvent()&&raceFormat()==='laps'?eventOptions.direction:'forward'));\r\n"],
 ['  if(watch)activeChallenge=undefined;\r\n',
  '  if(watch){activeChallenge=undefined;activeTimeTrial=null;}\r\n'
  "  timeTrialOpen=false;timeTrialInvalidReason='';timeTrialResult=null;\r\n"],
 ['    telemetry=null;runSettled=true;activeChallenge=undefined;demo=false;demoRestart=0;\r\n',
  '    '
  "telemetry=null;runSettled=true;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';demo=false;demoRestart=0;\r\n"],
 ['',
  "  if(activeTimeTrial){ui.querySelector('.hud-title')!.textContent=`TIME TRIAL · "
  "${activeTimeTrial.direction.toUpperCase()}`;text('event-label','PERSONAL "
  "BEST');ui.querySelector('.event-stats > div:nth-child(2) > span')!.textContent='LAP "
  "TIME';text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div "
  'class="challenge-live" role="status"><strong id="time-trial-progress">0 / 24 GATES</strong><span '
  'id="time-trial-validity">FACTORY STOCK · ONE LAP · NO RECOVERY</span></div>\');}\r\n'],
 ['',
  '  '
  "if(activeTimeTrial){text('time-value',formatTrialTime(player.finished?player.finishTime:elapsed+player.penalty));text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));text('time-trial-progress',`${Math.min(24,Math.max(0,player.passed))} "
  "/ 24 GATES`);text('time-trial-validity',timeTrialInvalidReason?`PRACTICE ONLY · "
  "${timeTrialInvalidReason}`:'FACTORY STOCK · ONE LAP · NO RECOVERY');}\r\n"],
 ['',
  '  if(activeTimeTrial){const '
  "retire=document.createElement('button');retire.id='time-trial-retire';retire.className='small-button';retire.textContent='END "
  "ATTEMPT · SEE RESULT';retire.onclick=()=>{finish('ATTEMPT ENDED');};ui.querySelector('#overlay "
  ".dialog')!.append(retire);}\r\n"],
 ['', "  if(activeTimeTrial)timeTrialInvalidReason='RECOVERY USED';\r\n"],
 ["    toast('RECOVERED · +5 SECONDS');\r\n",
  "    toast(activeTimeTrial?'RECOVERED · PRACTICE ONLY · RETRY FOR A PERSONAL BEST':'RECOVERED · +5 "
  "SECONDS');\r\n"],
 ['', '  if(activeTimeTrial){finishTimeTrial();return;}\r\n'],
 ['  if(demo||autopilot||testInput)telemetry=null;\r\n',
  "  if(demo||autopilot||testInput){telemetry=null;if(activeTimeTrial)timeTrialInvalidReason='ASSISTED OR TEST "
  "INPUT';}\r\n"],
 ['',
  '  if(timeTrialOpen)return '
  "screen('time-trial-setup','#time-trial-setup','#time-trial-course',click('#time-trial-close'));\r\n"],
 ['',
  "  if(state==='result'&&activeTimeTrial)return "
  "screen('time-trial-result','#time-trial-result','#again',click('#back'));\r\n"],
 ['',
  '  '
  "if(timeTrialOpen){if(e.code==='Escape'){e.preventDefault();ui.querySelector<HTMLButtonElement>('#time-trial-close')?.click();}return;}\r\n"],
 ['',
  '    get timeTrial(){return '
  'structuredClone({active:activeTimeTrial,records:timeTrialRecords,result:timeTrialResult,warning:timeTrialWarning,invalidReason:timeTrialInvalidReason,open:timeTrialOpen});},\r\n']]
main_before = previous('src/main.ts')
current_main = Path('src/main.ts').read_bytes()
if sha(main_before) != '61d55c9c1f6f90a7c62dd6ddcaf3dd805267099abd220019bed7cc45f1a4ad24':
    raise SystemExit('Unexpected published Cinderbank main')
if b'\n' in current_main.replace(b'\r\n', b''):
    raise SystemExit('Main must retain CRLF')
normalized_main = current_main.decode()
for before, after in main_changes:
    if normalized_main.count(after) != 1:
        raise SystemExit('Expected reviewed Time Trial main change exactly once')
    normalized_main = normalized_main.replace(after, before, 1)
if normalized_main.encode() != main_before:
    raise SystemExit('Main changed outside reviewed Time Trial integration')

# Existing tests add only inactive context bindings and exact successor reads.
# Preserve every scenario, assertion, tolerance and historical expected hash.
reviewed_history_changes = {'tests/challenge-main.test.ts': [[' const context:any={T,...Challenges,showDriverProfile,',
                                   ' const '
                                   'context:any={T,...Challenges,activeTimeTrial:null,openTimeTrialSetup(){},showDriverProfile,']],
 'tests/cinderbank-main.test.ts': [[' const context:any={T,structuredClone,',
                                    ' const context:any={T,activeTimeTrial:null,structuredClone,']],
 'tests/cinderbank-playability-history.test.ts': [["import test from 'node:test';\n",
                                                   "import test from 'node:test';\n"
                                                   'import {restoreTimeTrialPlayabilityBytes} from '
                                                   "'./time-trial-playability-invariants';\n"],
                                                  ['const source=(file:string)=>readFileSync(new '
                                                   "URL('../'+file,import.meta.url));",
                                                   '// The successor restores exact published source before '
                                                   'these historical assertions.\n'
                                                   'const '
                                                   'source=(file:string)=>restoreTimeTrialPlayabilityBytes(file,readFileSync(new '
                                                   "URL('../'+file,import.meta.url)));"]],
 'tests/cinderbank-playability-invariants.ts': [["import assert from 'node:assert/strict';\n",
                                                 "import assert from 'node:assert/strict';\n"
                                                 'import '
                                                 '{restoreTimeTrialPlayabilityBytes,verifyTimeTrialPlayabilityRevision} '
                                                 "from './time-trial-playability-invariants';\n"],
                                                ['export function '
                                                 'normalizeCinderbankSource(file:string,bytes:Buffer):Buffer{\n',
                                                 'export function '
                                                 'normalizeCinderbankSource(file:string,bytes:Buffer):Buffer{\n'
                                                 ' bytes=restoreTimeTrialPlayabilityBytes(file,bytes);\n'],
                                                ['export function '
                                                 'restoreCinderbankPlayabilityBytes(file:string,bytes:Buffer):Buffer{\n',
                                                 'export function '
                                                 'restoreCinderbankPlayabilityBytes(file:string,bytes:Buffer):Buffer{\n'
                                                 ' bytes=restoreTimeTrialPlayabilityBytes(file,bytes);\n'],
                                                ['export function '
                                                 'verifyCinderbankPlayabilityRevision():void{\n',
                                                 'export function verifyCinderbankPlayabilityRevision():void{\n'
                                                 ' verifyTimeTrialPlayabilityRevision();\n'],
                                                ['const bytes=readFileSync(new '
                                                 "URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);",
                                                 'const '
                                                 'bytes=restoreTimeTrialPlayabilityBytes(file,readFileSync(new '
                                                 "URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);"],
                                                ['hash(readFileSync(new '
                                                 "URL('../'+file,import.meta.url))),expected,file+' stays "
                                                 "unchanged during Cinderbank playability'",
                                                 'hash(restoreTimeTrialPlayabilityBytes(file,readFileSync(new '
                                                 "URL('../'+file,import.meta.url)))),expected,file+' stays "
                                                 "unchanged during Cinderbank playability'"]],
 'tests/club-cup-main.test.ts': [[' const context:any={T,...Cup,structuredClone,',
                                  ' const context:any={T,...Cup,activeTimeTrial:null,structuredClone,'],
                                 [' const context:any={T,...Cup,COURSE_NAMES,',
                                  ' const '
                                  'context:any={T,...Cup,activeTimeTrial:null,openTimeTrialSetup(){},COURSE_NAMES,']],
 'tests/controller-main.test.ts': [[" const c:any={state,resumeState:'playing',",
                                    ' const '
                                    "c:any={state,activeTimeTrial:null,timeTrialOpen:false,resumeState:'playing',"]],
 'tests/course-start.test.ts': [['const previous=recorder.document(),context:any={T,Error,Date,',
                                 'const '
                                 'previous=recorder.document(),context:any={T,activeTimeTrial:null,Error,Date,']],
 'tests/opposing-vehicle.test.ts': [[' const context:any={T,R,cars,physics:world,',
                                     ' const context:any={T,R,activeTimeTrial:null,cars,physics:world,']]}
known_history_before = {'tests/challenge-main.test.ts': '394f844481a60d744bbd4f8613a3328f1b553840a361d4848ab84c6973b852cc',
 'tests/cinderbank-main.test.ts': '9edb47de60bae8de3f1020269d20281bb1ca2be50a6138601dc8cd2f22fa24c2',
 'tests/cinderbank-playability-history.test.ts': 'c2e117f052faca36c126f5adad0524ec4302d9c5f29956bc4ffc578c133bd97c',
 'tests/cinderbank-playability-invariants.ts': '71f5c1c3cef6ea529bb8da97f17ad2d9034b0774669d433ef0bd650c1691cf23',
 'tests/club-cup-main.test.ts': 'f253df9c5c2b31a124e6a170da11e90e66bc063650efe9e9280a12b0e17d5a48',
 'tests/controller-main.test.ts': '8576c3f8fa78030999ca7a00c7de2482d1f2cfbe6d4e3ab258d383ed8d70e3a7',
 'tests/course-start.test.ts': 'e1a1b999cd9018e0686c6f63464c688d0d4325f293a01f415c4617e9a861282f',
 'tests/opposing-vehicle.test.ts': '655077439ef2b5625a60909aab039bf3c6c3938b7d117cde805781bdaa21eb1d'}
normalized_history_hashes = {}
for path, changes in reviewed_history_changes.items():
    normalized = Path(path).read_bytes()
    for before, after in changes:
        if normalized.count(after.encode()) != 1:
            raise SystemExit('Expected reviewed history/context change exactly once: ' + path)
        normalized = normalized.replace(after.encode(), before.encode(), 1)
    if normalized != previous(path) or sha(normalized) != known_history_before[path]:
        raise SystemExit('Historical assertion or scenario changed: ' + path)
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


main_functions = ['updateCamera', 'ai', 'input', 'frame', 'controllerKey', 'pollController', 'resume', 'captureReplay', 'openStudio', 'closeStudio', 'ensureVenue', 'activateVenue', 'refreshVenueLighting', 'bankRun', 'raceRoute', 'archiveReplay', 'setQuarryMode', 'saveClubCup', 'syncClubAwards', 'clubRow', 'freezeClubPlayer', 'finishClubEvent', 'eventDuration', 'eventLabel']
main_hashes = unchanged_declarations('main.ts', main_before.decode(), current_main.decode(), main_functions)
files, snapshots = {}, {}
for path in paths:
    before = previous(path)
    snapshot = path.replace('/', '-') + '.gz'
    snapshots[snapshot] = gzip.compress(before, mtime=0)
    files[path] = {'snapshot': snapshot, 'before': sha(before), 'after': sha(Path(path).read_bytes())}
manifest = {
    'baseline': baseline, 'files': files, 'protected': protected_hashes,
    'previousFixtureCount': len(fixtures), 'normalizedMainSha256': sha(normalized_main.encode()), 'protectedMainFunctions': main_hashes,
    'normalizedHistoricalTestsSha256': normalized_history_hashes,
    'protectedOrigins': {path: 'published source/model-manifest.json (original untracked GLB)' for path in published_models},
}
expected_names = set(snapshots) | {'revision.json'}
if folder.exists() and any(not path.is_file() or path.name not in expected_names for path in folder.iterdir()):
    raise SystemExit('Unexpected file or directory in the new leaf')
if check_only:
    print(len(files), 'candidate inputs ready;', len(protected_hashes), 'protected inputs and all 789 old fixtures verified; no writes')
else:
    folder.mkdir(parents=True, exist_ok=True)
    for name, data in snapshots.items():
        (folder / name).write_bytes(data)
    revision_path.write_text(json.dumps(manifest, indent=2) + '\n')
    print(len(files), 'newly captured Time Trial inputs; all 789 older fixtures preserved')
