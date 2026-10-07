import {restoreCollisionScarsBytes} from './collision-scars-invariants';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import {readTimeTrialPrevious,restoreTimeTrialPlayabilityBytes,verifyTimeTrialPlayabilityRevision} from './time-trial-playability-invariants';
import {readCinderbankPrevious,restoreCinderbankPlayabilityBytes} from './cinderbank-playability-invariants';
const source=(file:string)=>restoreCollisionScarsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
const hash=(bytes:Uint8Array|string)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(readFileSync(new URL('./fixtures/time-trial-playability/revision.json',import.meta.url)).toString());
function declarations(text:string,names:readonly string[]):Record<string,string>{
 const parsed=ts.createSourceFile('main.ts',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 return Object.fromEntries(names.map(name=>{
  const found:string[]=[];
  for(const statement of parsed.statements){
   if(ts.isFunctionDeclaration(statement)&&statement.name?.text===name)found.push(statement.getText(parsed));
   if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations)
    if(ts.isIdentifier(declaration.name)&&declaration.name.text===name)found.push(statement.getText(parsed));
  }
  assert.equal(found.length,1,name);return[name,found[0]];
 }));
}
test('Time Trial adds one immutable leaf preserving all 789 earlier fixtures and protected game source/assets',()=>{
 verifyTimeTrialPlayabilityRevision();
 assert.deepEqual(Object.keys(revision().files).sort(),[
  "src/main.ts",
  "src/time-trial.ts",
  "src/time-trial-ui.ts",
  "tests/time-trial.test.ts",
  "tests/time-trial-ui.test.ts",
  "tests/time-trial-main.test.ts",
  "tests/cinderbank-playability-invariants.ts",
  "tests/cinderbank-playability-history.test.ts",
  "tests/club-cup-main.test.ts",
  "tests/challenge-main.test.ts",
  "tests/course-start.test.ts",
  "tests/controller-main.test.ts",
  "tests/cinderbank-main.test.ts",
  "tests/opposing-vehicle.test.ts",
  "tests/time-trial-playability-invariants.ts",
  "tests/time-trial-playability-history.test.ts",
  "tools/record-time-trial-playability-revision.py"
].sort());
});

test('all main bytes outside the reviewed Time Trial integration remain published, including CRLF',()=>{
 let text=source('src/main.ts').toString();
 const changes:readonly (readonly [string,string])[]=[
  [
    "import { GARAGE_KEY, readGarage, type Setup } from './garage';\r\n",
    "import { GARAGE_KEY, readGarage, stockSetup, type Setup } from './garage';\r\n"
  ],
  [
    "",
    "import {loadTimeTrialRecords,saveTimeTrialRecords,isTimeTrialConfig,timeTrialBest,formatTrialTime,finishTimeTrialRecord,type TimeTrialConfig,type TimeTrialResult} from './time-trial';\r\nimport {showTimeTrialSetup,showTimeTrialResult} from './time-trial-ui';\r\n"
  ],
  [
    "const customEvent=()=>activeClubRound===null&&!activeChallenge&&!online?.active;\r\n",
    "const customEvent=()=>activeClubRound===null&&!activeChallenge&&!activeTimeTrial&&!online?.active;\r\n"
  ],
  [
    "const raceDirection=(id=0)=>directionForCar(raceFormat()==='laps'?(onlineRules()?.direction??(customEvent()?eventOptions.direction:'forward')):'forward',id);\r\n",
    "const raceDirection=(id=0)=>directionForCar(raceFormat()==='laps'?(onlineRules()?.direction??activeTimeTrial?.direction??(customEvent()?eventOptions.direction:'forward')):'forward',id);\r\n"
  ],
  [
    "",
    "const initialTimeTrial=loadTimeTrialRecords();\r\nlet timeTrialRecords=initialTimeTrial.records,timeTrialWarning=initialTimeTrial.warning;\r\nlet activeTimeTrial:Readonly<TimeTrialConfig>|null=null,timeTrialSelection:TimeTrialConfig|undefined;\r\nlet timeTrialOpen=false,timeTrialInvalidReason='',timeTrialResult:TimeTrialResult|null=null;\r\nfunction openTimeTrialSetup(){\r\n  if(preparingEvent||online?.active)return;\r\n  timeTrialOpen=true;keys.clear();\r\n  const config:TimeTrialConfig={kind,course:timeTrialSelection?.course??resolveCourseId(eventOptions.course),direction:timeTrialSelection?.direction??(eventOptions.direction==='reverse'?'reverse':'forward')};\r\n  showTimeTrialSetup(ui,config,timeTrialRecords,{start:config=>{void startTimeTrial(config);},close:()=>{timeTrialOpen=false;menu();}},timeTrialWarning);\r\n}\r\nasync function startTimeTrial(config:TimeTrialConfig){\r\n  if(preparingEvent||online?.active||!isTimeTrialConfig(config)||!['menu','result'].includes(state))return false;\r\n  bankRun(false);telemetry=null;activeChallenge=undefined;activeClubRound=null;clubOpen=false;timeTrialOpen=false;\r\n  activeTimeTrial=Object.freeze({...config});timeTrialSelection={...config};kind=config.kind;mode='race';\r\n  return start(false);\r\n}\r\nfunction finishTimeTrial(){\r\n  const config=activeTimeTrial;if(!config)return;\r\n  const player=cars[0],run=telemetry?.stats??null;\r\n  if(run)Object.assign(run,{completed:true,finished:player.finished&&player.health>0,health:player.health,rank:0,won:false,checkpoints:player.passed});\r\n  const outcome=finishTimeTrialRecord(timeTrialRecords,config,{run,finished:player.finished,health:player.health,passed:player.passed,finishTime:player.finished?player.finishTime:elapsed+player.penalty,demo,online:!!online?.active,synthetic:autopilot||!!testInput||!!timeTrialInvalidReason&&timeTrialInvalidReason!=='RECOVERY USED',stock:cars.length===1&&player.kind===config.kind&&activeVenue.course.id===config.course&&raceDirection()===config.direction&&JSON.stringify(player.setup)===JSON.stringify(stockSetup(player.kind))});\r\n  timeTrialRecords=outcome.records;timeTrialResult=outcome.result;\r\n  if(timeTrialResult.eligible)timeTrialWarning=saveTimeTrialRecords(timeTrialRecords)?'':'Personal bests are available for this session, but browser storage could not save them.';\r\n  bankRun(true);keys.clear();testInput=null;\r\n  showTimeTrialResult(ui,config,timeTrialResult,{\r\n    retry:()=>{void start(false);},\r\n    setup:()=>{createCars(true);menu();openTimeTrialSetup();},\r\n    close:()=>{createCars(true);menu();},\r\n  },[timeTrialWarning,profileStorageWarning,awardText(lastAward)].filter(Boolean).join(' '));\r\n  const replayActions=document.createElement('div');replayActions.className='event-actions';ui.querySelector('#time-trial-result .event-panel')!.append(replayActions);studioButtons(replayActions);\r\n  ui.querySelector<HTMLButtonElement>('#replay-mode')!.onclick=()=>openStudio(false,undefined,`${COURSE_NAMES[config.course]} \u00b7 Time Trial \u00b7 ${DEFINITIONS[config.kind].name} \u00b7 ${config.direction}`);\r\n}\r\n"
  ],
  [
    "const raceLaps=()=>clubRound()?.laps??(online?.active?onlineRules()?.laps??3:activeChallenge?.laps??(demo?demoOptions.laps:eventOptions.laps));\r\n",
    "const raceLaps=()=>clubRound()?.laps??(online?.active?onlineRules()?.laps??3:activeTimeTrial?1:activeChallenge?.laps??(demo?demoOptions.laps:eventOptions.laps));\r\n"
  ],
  [
    "  showDriverProfile(ui,profile,{close:()=>{profileOpen=false;menu();},start:challenge=>{profileOpen=false;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void start(false);}},profileStorageWarning,initialDiscipline);\r\n",
    "  showDriverProfile(ui,profile,{close:()=>{profileOpen=false;menu();},start:challenge=>{profileOpen=false;activeTimeTrial=null;activeChallenge=challenge;mode=challenge.mode;kind=challenge.car;void start(false);}},profileStorageWarning,initialDiscipline);\r\n"
  ],
  [
    "  clubOpen=false;activeChallenge=undefined;demo=false;kind=clubCup.roster[0].kind;mode=CLUB_ROUNDS[activeClubRound].mode;\r\n",
    "  clubOpen=false;activeTimeTrial=null;timeTrialOpen=false;activeChallenge=undefined;demo=false;kind=clubCup.roster[0].kind;mode=CLUB_ROUNDS[activeClubRound].mode;\r\n"
  ],
  [
    "  recorder=new ReplayRecorder({version:1,tyreModel:1,...(activeVenue.course.id==='quarry-v1'?{}:{courseId:activeVenue.course.id}),mode,reverse:mode==='race'&&customEvent()&&eventOptions.direction==='reverse',cars:cars.map(c=>({id:c.id,kind:c.kind,setup:{...structuredClone(c.setup),paint:c.paintColor.getHex()}})),props:activeVenue.props.length,created:new Date().toISOString()});\r\n",
    "  recorder=new ReplayRecorder({version:1,tyreModel:1,...(activeVenue.course.id==='quarry-v1'?{}:{courseId:activeVenue.course.id}),mode,reverse:mode==='race'&&(activeTimeTrial?activeTimeTrial.direction==='reverse':customEvent()&&eventOptions.direction==='reverse'),cars:cars.map(c=>({id:c.id,kind:c.kind,setup:{...structuredClone(c.setup),paint:c.paintColor.getHex()}})),props:activeVenue.props.length,created:new Date().toISOString()});\r\n"
  ],
  [
    "const preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!online?.active&&raceFormat()==='laps'?resolveCourseId(activeChallenge?activeChallenge.course:demo?demoOptions.course:eventOptions.course):'quarry-v1');\r\n",
    "const preferredCourse=():CourseId=>clubRound()?.course??(mode==='race'&&!online?.active&&raceFormat()==='laps'?resolveCourseId(activeTimeTrial?.course??(activeChallenge?activeChallenge.course:demo?demoOptions.course:eventOptions.course)):'quarry-v1');\r\n"
  ],
  [
    "  archiveReplay();bankRun(false);telemetry=null;activeChallenge=undefined;\r\n",
    "  archiveReplay();bankRun(false);telemetry=null;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';\r\n"
  ],
  [
    "",
    "  const trialButton=document.createElement('button');trialButton.id='time-trial';trialButton.className='small-button';trialButton.textContent='TIME TRIAL \u00b7 PERSONAL BESTS';trialButton.onclick=()=>openTimeTrialSetup();ui.querySelector('.intro')!.append(trialButton);\r\n"
  ],
  [
    "  archiveReplay();waypointRace=null;bankRun(false);telemetry=null;activeChallenge=undefined;lastAward=null;\r\n",
    "  archiveReplay();waypointRace=null;bankRun(false);telemetry=null;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';lastAward=null;\r\n"
  ],
  [
    "  const count = attract ? 1 : activeClubRound!==null ? clubCup!.roster.length : mode === 'playground' ? ((activeChallenge?activeChallenge.traffic:traffic) ? 5 : 1) : activeChallenge?8:demo?demoOptions.field:eventOptions.field;\r\n",
    "  const count = attract ? 1 : activeTimeTrial ? 1 : activeClubRound!==null ? clubCup!.roster.length : mode === 'playground' ? ((activeChallenge?activeChallenge.traffic:traffic) ? 5 : 1) : activeChallenge?8:demo?demoOptions.field:eventOptions.field;\r\n"
  ],
  [
    "    const setup=!attract&&activeClubRound!==null?undefined:demo&&!attract?demoVehicleSetup(type,demoOptions,garage):i===0 && (attract || !demo) && !activeChallenge ? previewSetup??garage.cars[type].setup : undefined;\r\n",
    "    const setup=!attract&&activeTimeTrial?stockSetup(type):!attract&&activeClubRound!==null?undefined:demo&&!attract?demoVehicleSetup(type,demoOptions,garage):i===0 && (attract || !demo) && !activeChallenge ? previewSetup??garage.cars[type].setup : undefined;\r\n"
  ],
  [
    "      const spawn=courseGridSlot(activeVenue.course,i,customEvent()&&raceFormat()==='laps'?eventOptions.direction:'forward');\r\n",
    "      const spawn=courseGridSlot(activeVenue.course,i,activeTimeTrial?.direction??(customEvent()&&raceFormat()==='laps'?eventOptions.direction:'forward'));\r\n"
  ],
  [
    "  if(watch)activeChallenge=undefined;\r\n",
    "  if(watch){activeChallenge=undefined;activeTimeTrial=null;}\r\n  timeTrialOpen=false;timeTrialInvalidReason='';timeTrialResult=null;\r\n"
  ],
  [
    "    telemetry=null;runSettled=true;activeChallenge=undefined;demo=false;demoRestart=0;\r\n",
    "    telemetry=null;runSettled=true;activeChallenge=undefined;activeTimeTrial=null;timeTrialOpen=false;timeTrialResult=null;timeTrialInvalidReason='';demo=false;demoRestart=0;\r\n"
  ],
  [
    "",
    "  if(activeTimeTrial){ui.querySelector('.hud-title')!.textContent=`TIME TRIAL \u00b7 ${activeTimeTrial.direction.toUpperCase()}`;text('event-label','PERSONAL BEST');ui.querySelector('.event-stats > div:nth-child(2) > span')!.textContent='LAP TIME';text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));ui.querySelector('.hud')!.insertAdjacentHTML('beforeend','<div class=\"challenge-live\" role=\"status\"><strong id=\"time-trial-progress\">0 / 24 GATES</strong><span id=\"time-trial-validity\">FACTORY STOCK \u00b7 ONE LAP \u00b7 NO RECOVERY</span></div>');}\r\n"
  ],
  [
    "",
    "  if(activeTimeTrial){text('time-value',formatTrialTime(player.finished?player.finishTime:elapsed+player.penalty));text('event-value',formatTrialTime(timeTrialBest(timeTrialRecords,activeTimeTrial)));text('time-trial-progress',`${Math.min(24,Math.max(0,player.passed))} / 24 GATES`);text('time-trial-validity',timeTrialInvalidReason?`PRACTICE ONLY \u00b7 ${timeTrialInvalidReason}`:'FACTORY STOCK \u00b7 ONE LAP \u00b7 NO RECOVERY');}\r\n"
  ],
  [
    "",
    "  if(activeTimeTrial){const retire=document.createElement('button');retire.id='time-trial-retire';retire.className='small-button';retire.textContent='END ATTEMPT \u00b7 SEE RESULT';retire.onclick=()=>{finish('ATTEMPT ENDED');};ui.querySelector('#overlay .dialog')!.append(retire);}\r\n"
  ],
  [
    "",
    "  if(activeTimeTrial)timeTrialInvalidReason='RECOVERY USED';\r\n"
  ],
  [
    "    toast('RECOVERED \u00b7 +5 SECONDS');\r\n",
    "    toast(activeTimeTrial?'RECOVERED \u00b7 PRACTICE ONLY \u00b7 RETRY FOR A PERSONAL BEST':'RECOVERED \u00b7 +5 SECONDS');\r\n"
  ],
  [
    "",
    "  if(activeTimeTrial){finishTimeTrial();return;}\r\n"
  ],
  [
    "  if(demo||autopilot||testInput)telemetry=null;\r\n",
    "  if(demo||autopilot||testInput){telemetry=null;if(activeTimeTrial)timeTrialInvalidReason='ASSISTED OR TEST INPUT';}\r\n"
  ],
  [
    "",
    "  if(timeTrialOpen)return screen('time-trial-setup','#time-trial-setup','#time-trial-course',click('#time-trial-close'));\r\n"
  ],
  [
    "",
    "  if(state==='result'&&activeTimeTrial)return screen('time-trial-result','#time-trial-result','#again',click('#back'));\r\n"
  ],
  [
    "",
    "  if(timeTrialOpen){if(e.code==='Escape'){e.preventDefault();ui.querySelector<HTMLButtonElement>('#time-trial-close')?.click();}return;}\r\n"
  ],
  [
    "",
    "    get timeTrial(){return structuredClone({active:activeTimeTrial,records:timeTrialRecords,result:timeTrialResult,warning:timeTrialWarning,invalidReason:timeTrialInvalidReason,open:timeTrialOpen});},\r\n"
  ]
];
 for(const [before,after]of changes){assert.equal(text.split(after).length-1,1,after);text=text.replace(after,before);}
 assert.equal(text,readTimeTrialPrevious('src/main.ts').toString(),'Every unrelated main byte retains the published Cinderbank source');
 assert.equal(hash(text),'61d55c9c1f6f90a7c62dd6ddcaf3dd805267099abd220019bed7cc45f1a4ad24');
 assert.equal(hash(text),revision().normalizedMainSha256);
 assert.equal(source('src/main.ts').toString().replaceAll('\r\n','').includes('\n'),false,'Main retains CRLF');
});

test('actual camera, AI, controller sampling, frame timing, replay and venue lifecycle remain byte-exact',()=>{
 const names=["updateCamera", "ai", "input", "frame", "controllerKey", "pollController", "resume", "captureReplay", "openStudio", "closeStudio", "ensureVenue", "activateVenue", "refreshVenueLighting", "bankRun", "raceRoute", "archiveReplay", "setQuarryMode", "saveClubCup", "syncClubAwards", "clubRow", "freezeClubPlayer", "finishClubEvent", "eventDuration", "eventLabel"],manifest=revision();
 assert.deepEqual(Object.keys(manifest.protectedMainFunctions).sort(),[...names].sort());
 const actual=declarations(source('src/main.ts').toString(),names),expected=declarations(readTimeTrialPrevious('src/main.ts').toString(),names);
 for(const name of names){assert.equal(actual[name],expected[name],name);assert.equal(hash(actual[name]),manifest.protectedMainFunctions[name],name);}
});

test('existing harnesses and history add only explicit inactive bindings or successor reads, preserving all assertions',()=>{
 const changes:Record<string,readonly (readonly [string,string])[]>={
  "tests/cinderbank-playability-invariants.ts": [
    [
      "import assert from 'node:assert/strict';\n",
      "import assert from 'node:assert/strict';\nimport {restoreTimeTrialPlayabilityBytes,verifyTimeTrialPlayabilityRevision} from './time-trial-playability-invariants';\n"
    ],
    [
      "export function normalizeCinderbankSource(file:string,bytes:Buffer):Buffer{\n",
      "export function normalizeCinderbankSource(file:string,bytes:Buffer):Buffer{\n bytes=restoreTimeTrialPlayabilityBytes(file,bytes);\n"
    ],
    [
      "export function restoreCinderbankPlayabilityBytes(file:string,bytes:Buffer):Buffer{\n",
      "export function restoreCinderbankPlayabilityBytes(file:string,bytes:Buffer):Buffer{\n bytes=restoreTimeTrialPlayabilityBytes(file,bytes);\n"
    ],
    [
      "export function verifyCinderbankPlayabilityRevision():void{\n",
      "export function verifyCinderbankPlayabilityRevision():void{\n verifyTimeTrialPlayabilityRevision();\n"
    ],
    [
      "const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);",
      "const bytes=restoreTimeTrialPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);"
    ],
    [
      "hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' stays unchanged during Cinderbank playability'",
      "hash(restoreTimeTrialPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during Cinderbank playability'"
    ]
  ],
  "tests/cinderbank-playability-history.test.ts": [
    [
      "import test from 'node:test';\n",
      "import test from 'node:test';\nimport {restoreTimeTrialPlayabilityBytes} from './time-trial-playability-invariants';\n"
    ],
    [
      "const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));",
      "// The successor restores exact published source before these historical assertions.\nconst source=(file:string)=>restoreTimeTrialPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));"
    ]
  ],
  "tests/club-cup-main.test.ts": [
    [
      " const context:any={T,...Cup,structuredClone,",
      " const context:any={T,...Cup,activeTimeTrial:null,structuredClone,"
    ],
    [
      " const context:any={T,...Cup,COURSE_NAMES,",
      " const context:any={T,...Cup,activeTimeTrial:null,openTimeTrialSetup(){},COURSE_NAMES,"
    ]
  ],
  "tests/challenge-main.test.ts": [
    [
      " const context:any={T,...Challenges,showDriverProfile,",
      " const context:any={T,...Challenges,activeTimeTrial:null,openTimeTrialSetup(){},showDriverProfile,"
    ]
  ],
  "tests/course-start.test.ts": [
    [
      "const previous=recorder.document(),context:any={T,Error,Date,",
      "const previous=recorder.document(),context:any={T,activeTimeTrial:null,Error,Date,"
    ]
  ],
  "tests/controller-main.test.ts": [
    [
      " const c:any={state,resumeState:'playing',",
      " const c:any={state,activeTimeTrial:null,timeTrialOpen:false,resumeState:'playing',"
    ]
  ],
  "tests/cinderbank-main.test.ts": [
    [
      " const context:any={T,structuredClone,",
      " const context:any={T,activeTimeTrial:null,structuredClone,"
    ]
  ],
  "tests/opposing-vehicle.test.ts": [
    [
      " const context:any={T,R,cars,physics:world,",
      " const context:any={T,R,activeTimeTrial:null,cars,physics:world,"
    ]
  ]
};
 const known:Record<string,string>={
  "tests/cinderbank-playability-invariants.ts": "71f5c1c3cef6ea529bb8da97f17ad2d9034b0774669d433ef0bd650c1691cf23",
  "tests/cinderbank-playability-history.test.ts": "c2e117f052faca36c126f5adad0524ec4302d9c5f29956bc4ffc578c133bd97c",
  "tests/club-cup-main.test.ts": "f253df9c5c2b31a124e6a170da11e90e66bc063650efe9e9280a12b0e17d5a48",
  "tests/challenge-main.test.ts": "394f844481a60d744bbd4f8613a3328f1b553840a361d4848ab84c6973b852cc",
  "tests/course-start.test.ts": "e1a1b999cd9018e0686c6f63464c688d0d4325f293a01f415c4617e9a861282f",
  "tests/controller-main.test.ts": "8576c3f8fa78030999ca7a00c7de2482d1f2cfbe6d4e3ab258d383ed8d70e3a7",
  "tests/cinderbank-main.test.ts": "9edb47de60bae8de3f1020269d20281bb1ca2be50a6138601dc8cd2f22fa24c2",
  "tests/opposing-vehicle.test.ts": "655077439ef2b5625a60909aab039bf3c6c3938b7d117cde805781bdaa21eb1d"
};
 for(const [file,edits]of Object.entries(changes)){
  let text=source(file).toString();
  for(const [before,after]of edits){assert.equal(text.split(after).length-1,1,file);text=text.replace(after,before);}
  assert.equal(hash(text),known[file],file+' known published test hash');
  assert.equal(text,readTimeTrialPrevious(file).toString(),file+' every other assertion/scenario byte stays exact');
  assert.equal(hash(text),revision().normalizedHistoricalTestsSha256[file]);
 }
});

test('successor restoration recognizes complete revisions and never replaces unknown or damaged bytes',()=>{
 for(const file of Object.keys(revision().files))assert.deepEqual(restoreTimeTrialPlayabilityBytes(file,source(file)),readTimeTrialPrevious(file),file);
 const bridge='tests/cinderbank-playability-invariants.ts';
 assert.deepEqual(restoreCinderbankPlayabilityBytes(bridge,source(bridge)),readCinderbankPrevious(bridge),'Both layers restore in order');
 assert.deepEqual(restoreCinderbankPlayabilityBytes('src/main.ts',source('src/main.ts')),readCinderbankPrevious('src/main.ts'),'Main restores both releases');
 for(const file of ['src/main.ts',bridge]){
  const corrupt=Buffer.from(source(file));corrupt[0]^=1;
  for(const bytes of [corrupt,Buffer.from('unrecognized revision')]){
   assert.deepEqual(restoreTimeTrialPlayabilityBytes(file,bytes),bytes);
   assert.deepEqual(restoreCinderbankPlayabilityBytes(file,bytes),bytes);
  }
 }
 const unknown=Buffer.from('unrecognized revision');assert.deepEqual(restoreTimeTrialPlayabilityBytes('src/not-in-leaf.ts',unknown),unknown);
});
