import * as Career from '../src/career';
import {showCareer} from '../src/career-ui';
import * as DamageRules from '../src/damage-rules';
import * as GridSetup from '../src/grid-setup';
import * as Grid from '../src/grid-rules';
import * as Timed from '../src/timed-race';
import {AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey} from '../src/ai-difficulty';
import {CollisionScars,captureCollisionMotion,collisionPointVelocity} from '../src/collision-contact';
/** Production-handler plumbing fixture. No rendering, physics simulation or earned medal
 * is claimed. Production handlers run unmodified; explicit unit outcomes below
 * isolate result/award wiring. Physical attainability is separate evidence. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import * as T from 'three';
import * as Challenges from '../src/challenges';
import {showDriverProfile,MEDALS,awardText} from '../src/profile-ui';
import {SessionTelemetry} from '../src/session-telemetry';
import {readProfile,settleRun,PROFILE_KEY} from '../src/progression';
import {readGarage,stockSetup,normalizeSetup} from '../src/garage';
import {newLayer} from '../src/livery';
import {CAR_KINDS,DEFINITIONS,type CarKind} from '../src/rules';
import {RACE_NAMES,readEventOptions,directionForCar,derbyGridSlot,eventDerbyOrder,CombatScoreboard} from '../src/event-rules';
import {COURSE_NAMES,resolveCourseId} from '../src/course-id';
import {getRaceCourse,courseRoute,courseGridSlot} from '../src/race-course';
import {CLUB_ROUNDS} from '../src/club-cup';
import {demoCarKind,demoVehicleSetup} from '../src/demo-session';
import {WaypointRace} from '../src/waypoint-race';
import {ReplayRecorder} from '../src/replay-data';

const mainText=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
const main=ts.createSourceFile('main.ts',mainText,ts.ScriptTarget.ES2022,true,ts.ScriptKind.TS);
export const observedMainHash=createHash('sha256').update(mainText).digest('hex');
const selectors=['damageRule','clubRound','customEvent','aiDifficulty','onlineRules','raceFormat','raceTimeLimit','raceDirection','raceRoute','scoreDerby','derbyRanking','eventDuration','raceLaps','preferredCourse','raceLabel','eventLabel'];
const names=[...selectors,'modes','openCareer','careerGroupForId','startCareerEvent','openProfile','bankRun','createCars','start','beginReplay','finish','menu','recover'];
const declarations=names.map(name=>{
 const fn=main.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text===name);if(fn)return fn.getText(main);
 for(const node of main.statements)if(ts.isVariableStatement(node)){
  const declaration=node.declarationList.declarations.find(d=>ts.isIdentifier(d.name)&&d.name.text===name);
  if(declaration)return 'const '+declaration.getText(main)+';';
 }
 assert.fail('Missing production boundary '+name);
});
const executable=ts.transpileModule(declarations.join('\n')+'\nglobalThis.handlers={'+names.join(',')+'};',
 {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const plain=<T>(value:T):T=>JSON.parse(JSON.stringify(value));

/** Only callback binding/markup identity is modeled here. This is not a browser
 * layout, focus, accessibility or native form-behavior test. */
class UINode {
 id='';className='';textContent='';dataset:Record<string,string>={};children:UINode[]=[];
 focus(){}
 onclick:undefined|(()=>unknown);hidden=false;style={};attributes=new Map<string,string>();
 classList={remove(){},add(){}};
 private html='';
 set innerHTML(html:string){
  this.html=html;this.children=[];
  for(const match of html.matchAll(/<(button|div|section|p|nav|header|footer|input|select)\b([^>]*)>/g)){
   const node=new UINode();
   for(const attribute of match[2].matchAll(/([\w-]+)="([^"]*)"/g))node.setAttribute(attribute[1],attribute[2]);
   this.children.push(node);
  }
 }
 get innerHTML(){return this.html;}
 setAttribute(name:string,value:string){this.attributes.set(name,value);if(name==='id')this.id=value;if(name==='class')this.className=value;if(name.startsWith('data-'))this.dataset[name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=value;}
 append(node:UINode){this.children.push(node);}prepend(node:UINode){this.children.unshift(node);}
 matches(selector:string){
  if(selector.startsWith('#'))return this.id===selector.slice(1);
  if(selector.startsWith('.'))return this.className.split(/\s+/).includes(selector.slice(1));
  const data=/^\[data-([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
  return !!data&&this.attributes.has('data-'+data[1])&&(data[2]===undefined||this.attributes.get('data-'+data[1])===data[2]);
 }
 querySelectorAll(selector:string):UINode[]{return this.children.flatMap(node=>[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)]);}
 querySelector(selector:string):UINode|null{return this.querySelectorAll(selector==='.footer > div'?'.footer':selector)[0]??null;}
 click(){assert.ok(this.onclick,'Unbound UI control '+this.id+JSON.stringify(this.dataset));return this.onclick();}
}
type Faults={audio?:boolean;warm?:boolean;venue?:boolean;recovery?:boolean;storage?:boolean};
function harness(faults:Faults={}){
 const ui=new UINode(),storage=new Map<string,string>(),writes:string[]=[],construction:any[]=[],notices:string[]=[],logs:unknown[]=[];
 const calls={physics:0,render:0,archive:0,capture:0,warm:0,reload:0};let serial=0,venueCalls=0;
 const quarry={course:getRaceCourse('quarry-v1'),props:[],puddles:[]},ironfield={course:getRaceCourse('ironfield-figure-eight-v1'),props:[],puddles:[]};
 const context:any={clubRecords:{version:1,best:[]},openClubCup(){},...Career,showCareer,careerOpen:false,careerRun:false,...DamageRules,...GridSetup,...Grid,...Timed,...Timed,T,AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey,...Challenges,activeTimeTrial:null,openTimeTrialSetup(){},showDriverProfile,MEDALS,awardText,SessionTelemetry,readProfile,settleRun,PROFILE_KEY,ReplayRecorder,
  CAR_KINDS,DEFINITIONS,RACE_NAMES,readEventOptions,directionForCar,derbyGridSlot,eventDerbyOrder,courseRoute,courseGridSlot,COURSE_NAMES,resolveCourseId,CLUB_ROUNDS,demoCarKind,demoVehicleSetup,WaypointRace,structuredClone,Error,Date,
  ui,document:{querySelector:(selector:string)=>ui.querySelector(selector),createElement:()=>new UINode(),hidden:false},
  localStorage:{getItem:(key:string)=>storage.get(key)??null,setItem(key:string,value:string){if(faults.storage)throw Error('Storage blocked');storage.set(key,value);writes.push(key);}},
  crypto:{randomUUID:()=>`unit-run-${++serial}`},console:{warn:(...v:unknown[])=>logs.push(v),error:(...v:unknown[])=>logs.push(v)},location:{reload(){calls.reload++;}},
  activeClubRound:null,clubCup:null,clubWarning:'',clubOpen:false,clubRetired:false,clubPlayerStopped:false,clubFirstFinish:null,clubPlayerRow:null,clubRunStats:undefined,
  activeChallenge:undefined,profile:readProfile(),profileStorageWarning:'',profileOpen:false,garageOpen:false,eventSetupOpen:false,garage:readGarage(),kind:'buggy',mode:'race',
  eventOptions:{...readEventOptions(),course:'ironfield-figure-eight-v1',field:24,laps:9,direction:'opposing',race:'random',derby:'score',duration:420},demoOptions:{field:24,laps:9,duration:30,camera:'director',lineup:'mixed',build:'garage'},
  online:null,demo:false,demoRestart:0,demoHudHidden:false,autopilot:false,testInput:null,keys:new Set(['KeyW']),traffic:true,
  state:'menu',preparingEvent:false,preparationInterrupted:false,telemetry:null,runId:'',runSettled:true,lastAward:null,resultTitle:'',elapsed:0,countdown:0,accumulator:0,eventFrameTimes:[],wreckHold:0,
  recorder:null,lastReplay:null,replayEpochs:[],studio:null,cars:[],scene:new T.Scene(),activeVenue:quarry,quarryVenue:quarry,waypointRace:null,
  orbit:{enabled:false,maxDistance:22,enablePan:true},camera:new T.PerspectiveCamera(),cameraImpactOffset:new T.Vector3(),staticShadows:undefined,
  director:{reset(){},select(){}},sound:{async init(){if(faults.audio)throw Error('Audio unavailable');},pause(){},clearCars(){},attach(){}},
  drivers:{reset(){}},combat:new CombatScoreboard(),collisionScars:new CollisionScars(),captureCollisionMotion,collisionPointVelocity,impactAdjudicator:{clear(){}},collisions:0,vehicleFire:undefined,puddleSplashes:undefined,
  physics:{step(){calls.physics++;}},events:{clear(){}},fx:{reset(){}},quarry:{resetProps(){}},DERBY_ARENA:{x:0,z:0,radius:45},
  ensureVenue(id:string){venueCalls++;if(faults.venue&&(venueCalls===1||faults.recovery))throw Error('Venue unavailable');return id==='quarry-v1'?quarry:ironfield;},
  activateVenue(venue:unknown){context.activeVenue=venue;},setQuarryMode(){},archiveReplay(){calls.archive++;},captureReplay(){calls.capture++;},syncClubAwards(){},
  loading(){ui.innerHTML='<div class="loading"></div>';},hud(){ui.innerHTML='<div class="hud"></div>';},async warmPrograms(){calls.warm++;if(faults.warm)throw Error('GPU compile failed');},
  toast(message:string){notices.push(message);},pause(){context.state='paused';},studioButtons(container:unknown){assert.ok(container,'Result studio container exists');},
  isPlayer:(car:any)=>car.id===0,rankRace:()=>context.cars,saved:{best:{}},persist(){assert.fail('Challenge results must not update ordinary best records');},
  replayMenu(){},openGarage(){},openEventSetup(){},openClubCup(){},fullScreen(){},onlineUI:{show(){}},showDemoSetup(){},
 };
 context.Vehicle=class {
  root=new T.Group();current=new T.Vector3();previous=new T.Vector3();currentQ=new T.Quaternion();setup:any;paintColor:T.Color;
  health=100;passed=0;nextCheckpoint=0;lap=1;finished=false;finishTime=0;penalty=0;inflicted=0;speed=0;disposed=false;waters:unknown;onVisualEvent:unknown;
  constructor(readonly id:number,readonly kind:CarKind,color:number,_scene:unknown,_world:unknown,_fx:unknown,supplied:unknown,readonly ground:any){
   this.setup=normalizeSetup(supplied,kind);this.paintColor=new T.Color(color);construction.push({id,kind,supplied,ground,car:this});
  }
  place(x:number,z:number,yaw:number){this.current.set(x,.89,z);this.currentQ.setFromAxisAngle(new T.Vector3(0,1,0),yaw);}
  preStep(){}postStep(){}render(){calls.render++;}dispose(){this.disposed=true;}
 };
 for(const kind of CAR_KINDS)context.garage.cars[kind].setup={...stockSetup(kind),engine:3,tires:3,armor:3,paint:0xab00cd,trim:0xffffff,tune:{gearing:1,suspension:-1,differential:1,brakeBias:-1,steering:1},livery:[{...newLayer('number','left'),name:'hostile-'+kind}]};
 runInNewContext(executable,context);const f=context.handlers as Record<string,(...args:any[])=>any>;
 const preferences=()=>JSON.stringify({event:context.eventOptions,garage:context.garage});
 const click=(selector:string)=>{const node=ui.querySelector(selector);assert.ok(node,'Missing real markup control '+selector);return node.click();};
 const settle=()=>new Promise<void>(resolve=>setImmediate(resolve));
 async function select(challenge:Challenges.Challenge){f.openProfile();click(`[data-filter="${challenge.discipline}"]`);click(`[data-challenge="${challenge.id}"]`);await settle();}
 return{context,f,calls,ui,storage,writes,construction,notices,logs,preferences,click,settle,select};
}

test('unit plumbing: all 38 current board entries create their declared stock cars and fixed rules despite hostile preferences',async()=>{
 assert.equal(Challenges.CHALLENGES.length,38);
 for(const challenge of Challenges.CHALLENGES){
  const h=harness(),preferences=h.preferences();await h.select(challenge);
  assert.equal(h.context.activeChallenge,challenge);assert.equal(h.context.kind,challenge.car);assert.equal(h.context.mode,challenge.mode);
  assert.equal(h.context.state,challenge.mode==='playground'?'playing':'countdown');assert.equal(h.context.preparingEvent,false);
  assert.equal(h.context.activeVenue.course.id,(challenge as any).course??'quarry-v1');assert.equal(h.f.raceFormat(),'laps');
  assert.equal(h.f.raceDirection(0),'forward');assert.equal(h.f.raceDirection(1),'forward');assert.equal(h.f.scoreDerby(),false);
  assert.equal(h.f.eventDuration(),challenge.limit);assert.equal(h.f.raceLaps(),challenge.laps??9);
  assert.equal(h.context.cars.length,challenge.mode==='playground'?(challenge.traffic?5:1):8);
  for(const created of h.construction){assert.equal(created.supplied,undefined);assert.deepEqual(plain(created.car.setup),stockSetup(created.kind));assert.equal(created.ground,h.context.activeVenue.course);}
  assert.equal(h.calls.physics,90,'Only mocked creation-settling calls; no physics completion claim');
  assert.equal(h.context.waypointRace,null);assert.equal(h.context.recorder.meta.reverse,false);
  assert.equal(h.context.recorder.meta.courseId,h.context.activeVenue.course.id==='quarry-v1'?undefined:h.context.activeVenue.course.id);
  assert.equal(h.preferences(),preferences);assert.deepEqual(h.writes,[]);
  const carBefore=plain(h.context.cars[0].current);h.f.recover();assert.deepEqual(plain(h.context.cars[0].current),carBefore);assert.match(h.notices.at(-1)!,/NO RECOVERIES/);
 }
});

function unitRaceOutcome(h:ReturnType<typeof harness>,finished=true){
 h.context.state='playing';h.context.elapsed=64;
 Object.assign(h.context.cars[0],{finished,passed:finished?24:23,health:80,finishTime:finished?64:0});
 Object.assign(h.context.telemetry.stats,{seconds:64,distance:700,health:80,checkpoints:finished?24:23});
}
test('unit plumbing: injected qualifying outcome settles once, persists, and Retry uses new stock car/run identity',async()=>{
 const h=harness(),challenge=Challenges.CHALLENGES.find(c=>c.id==='first-lap')!;await h.select(challenge);
 const original=h.context.cars[0],id=h.context.runId,preferences=h.preferences();unitRaceOutcome(h);h.f.finish('UNIT FINISH FIXTURE');
 assert.equal(h.context.state,'result');assert.equal(h.context.lastAward.medal,3);assert.match(h.ui.innerHTML,/GOLD MEDAL/);
 assert.equal(h.context.profile.challenges[challenge.id].attempts,1);const saved=JSON.stringify(h.context.profile);
 h.f.finish('DUPLICATE FIXTURE');assert.equal(JSON.stringify(h.context.profile),saved);
 assert.deepEqual(readProfile(h.storage.get(PROFILE_KEY)),plain(h.context.profile));
 h.click('#challenge-retry');await h.settle();assert.equal(h.context.state,'countdown');assert.equal(h.context.activeChallenge,challenge);
 assert.notEqual(h.context.runId,id);assert.notEqual(h.context.cars[0],original);assert.equal(original.disposed,true);
 assert.equal(h.context.cars[0].health,100);assert.equal(h.context.cars[0].passed,courseGridSlot(h.context.activeVenue.course,0,'forward').passed);assert.equal(h.context.telemetry.stats.damage,0);
 assert.deepEqual(plain(h.context.cars[0].setup),stockSetup(challenge.car));assert.equal(JSON.stringify(h.context.profile),saved);assert.equal(h.preferences(),preferences);
});

test('unit plumbing: DNF awards no medal and real result callbacks restore Quarry menu or board',async()=>{
 for(const button of ['#challenge-menu','#challenge-board']){
  const h=harness();await h.select(Challenges.CHALLENGES.find(c=>c.id==='first-lap')!);const preferences=h.preferences();
  unitRaceOutcome(h,false);h.f.finish('UNIT DNF FIXTURE');assert.equal(h.context.lastAward.medal,0);assert.match(h.ui.innerHTML,/Race not finished/);assert.match(h.ui.innerHTML,/TRY AGAIN/);
  h.click(button);assert.equal(h.context.state,'menu');assert.equal(h.context.activeChallenge,undefined);assert.equal(h.context.telemetry,null);
  assert.equal(h.context.activeVenue.course.id,'quarry-v1');assert.equal(h.context.cars.length,1);assert.equal(h.preferences(),preferences);
  assert.equal(h.context.profileOpen,button==='#challenge-board');assert.ok(h.ui.querySelector(button==='#challenge-board'?'#profile-close':'#start'));
 }
});

test('unit plumbing: result storage failure is visible and does not prevent retry or duplicate protection',async()=>{
 const h=harness({storage:true});await h.select(Challenges.CHALLENGES[0]);unitRaceOutcome(h);h.f.finish('UNIT STORAGE FIXTURE');
 assert.equal(h.context.lastAward.medal,3);assert.match(h.ui.innerHTML,/browser storage could not save/);assert.equal(h.storage.size,0);
 const before=JSON.stringify(h.context.profile);h.f.finish('DUPLICATE');assert.equal(JSON.stringify(h.context.profile),before);
 h.click('#challenge-retry');await h.settle();assert.equal(h.context.state,'countdown');assert.equal(h.context.preparingEvent,false);
});

test('unit plumbing: real startup failures clear challenge state and return a usable menu or explicit reload',async()=>{
 for(const faults of [{venue:true},{warm:true},{venue:true,recovery:true}]){
  const h=harness(faults),preferences=h.preferences();await h.select(Challenges.CHALLENGES[0]);
  assert.equal(h.context.preparingEvent,false);assert.equal(h.context.activeChallenge,undefined);assert.equal(h.context.telemetry,null);assert.equal(h.context.runSettled,true);
  assert.equal(h.context.profile.events,0);assert.deepEqual(h.context.profile.challenges,{});assert.equal(h.preferences(),preferences);
  if(faults.recovery){assert.equal(h.context.state,'loading');h.click('#event-reload');assert.equal(h.calls.reload,1);}
  else {assert.equal(h.context.state,'menu');assert.ok(h.ui.querySelector('#start'));assert.equal(h.context.activeVenue.course.id,'quarry-v1');}
 }
 const audio=harness({audio:true});await audio.select(Challenges.CHALLENGES[0]);assert.equal(audio.context.state,'countdown');assert.match(audio.notices[0],/Sound unavailable/);
});

test('unit plumbing: ordinary custom-event and online selectors retain their existing meanings',()=>{
 const h=harness();assert.equal(h.f.raceFormat(),'random');assert.equal(h.f.preferredCourse(),'quarry-v1');assert.equal(h.f.raceLaps(),9);
 h.context.eventOptions.race='laps';assert.equal(h.f.preferredCourse(),'ironfield-figure-eight-v1');assert.equal(h.f.raceDirection(1),'reverse');
 h.f.createCars();assert.equal(h.context.cars.length,24);assert.equal(h.context.activeVenue.course.id,'ironfield-figure-eight-v1');
 assert.equal(h.construction[0].supplied,h.context.garage.cars.buggy.setup);assert.deepEqual(plain(h.context.cars[0].setup),plain(h.context.garage.cars.buggy.setup));
 assert.ok(h.construction.slice(1).every(car=>car.supplied===undefined));
 h.context.online={active:true,network:{snapshot:{event:{rules:{race:'laps',direction:'reverse',laps:5,duration:99,derby:'score'}}}}};
 assert.equal(h.f.preferredCourse(),'quarry-v1');assert.equal(h.f.raceLaps(),5);assert.equal(h.f.eventDuration(),99);assert.equal(h.f.raceDirection(),'reverse');
});

test('extension unit plumbing: a declared Ironfield challenge uses actual venue/grid/replay routing',async()=>{
 const h=harness(),challenge:Challenges.Challenge={...Challenges.CHALLENGES[0],id:'unit-ironfield-routing',car:'tern',course:'ironfield-figure-eight-v1'};
 Object.assign(h.context,{activeChallenge:challenge,kind:challenge.car,mode:challenge.mode});const preferences=h.preferences();
 assert.equal(Challenges.challengeCourse(challenge),'ironfield-figure-eight-v1');assert.equal(await h.f.start(false),true);
 assert.equal(h.context.activeVenue.course.id,'ironfield-figure-eight-v1');assert.equal(h.context.recorder.meta.courseId,'ironfield-figure-eight-v1');
 assert.equal(h.context.cars.length,8);
 for(const car of h.context.cars){
  const expected=courseGridSlot(h.context.activeVenue.course,car.id,'forward');
  assert.equal(car.current.x,expected.x);assert.equal(car.current.z,expected.z);assert.equal(car.nextCheckpoint,expected.next);assert.equal(car.passed,expected.passed);
  assert.deepEqual(plain(car.setup),stockSetup(car.kind));
 }
 unitRaceOutcome(h,false);h.f.finish('UNIT COURSE DNF');assert.ok(h.ui.innerHTML.includes(Challenges.challengeVenueName(challenge)));
 h.click('#challenge-retry');await h.settle();assert.equal(h.context.activeVenue.course.id,'ironfield-figure-eight-v1');
 assert.equal(h.preferences(),preferences);
});

test('extension unit plumbing: non-race challenges cannot leave Quarry and omitted/unknown race courses default there',async()=>{
 for(const mode of ['derby','playground','race'] as const){
  const challenge={...Challenges.CHALLENGES.find(c=>c.mode===mode)!,course:mode==='race'?'unrecognized':'ironfield-figure-eight-v1'} as Challenges.Challenge;
  assert.equal(Challenges.challengeCourse(challenge),'quarry-v1');
  const h=harness();Object.assign(h.context,{activeChallenge:challenge,mode,kind:challenge.car});await h.f.start(false);
  assert.equal(h.context.activeVenue.course.id,'quarry-v1');assert.equal(h.context.recorder.meta.courseId,undefined);
 }
 assert.equal(Challenges.challengeCourse(Challenges.CHALLENGES[0]),'quarry-v1');
});

test('extension unit plumbing: result-to-board retains discipline and displays the actual venue',async()=>{
 for(const discipline of ['racing','impact','stunts'] as const){
  const h=harness(),challenge=Challenges.CHALLENGES.find(c=>c.discipline===discipline)!;await h.select(challenge);
  h.context.state='playing';h.context.elapsed=challenge.limit;
  Object.assign(h.context.telemetry.stats,{distance:50,damage:50,drift:40});h.f.finish('UNIT CATEGORY RESULT');
  assert.ok(h.ui.innerHTML.includes(Challenges.challengeVenueName(challenge)));h.click('#challenge-board');
  assert.equal(h.context.activeChallenge,undefined);assert.equal(h.context.profileOpen,true);
  const category=h.ui.querySelector(`[data-filter="${discipline}"]`);assert.equal(category?.attributes.get('aria-pressed'),'true');
  assert.ok(h.ui.querySelector(`[data-challenge="${challenge.id}"]`));assert.ok(h.ui.innerHTML.includes(Challenges.challengeVenueName(challenge)));
 }
});


test('career production flow earns points, opens another discipline, returns to career after results and preserves stock rules',async()=>{
 const h=harness(),preferences=h.preferences();h.f.openCareer();assert.equal(h.context.careerOpen,true);
 assert.equal(await h.f.startCareerEvent('ravine-flight'),false,'locked group cannot launch');
 await h.f.startCareerEvent('first-lap');assert.equal(h.context.careerRun,true);assert.equal(h.context.careerOpen,false);assert.equal(h.context.activeChallenge.id,'first-lap');assert.equal(h.context.cars.length,8);assert.ok(h.context.cars.every((c:any)=>JSON.stringify(c.setup)===JSON.stringify(stockSetup(c.kind))));
 unitRaceOutcome(h);h.f.finish('CAREER RACE');assert.equal(Career.careerStatus(h.context.profile).available,3);assert.match(h.ui.innerHTML,/CAREER BOARD/);h.click('#challenge-board');assert.equal(h.context.careerOpen,true);assert.equal(h.context.careerRun,false);
 h.click('[data-career-filter="stunts"]');h.click('[data-career-unlock="flight-school"]');assert.equal(Career.careerStatus(h.context.profile).available,0);assert.equal(Career.careerStatus(readProfile(h.storage.get(PROFILE_KEY))).open.includes('flight-school'),true);
 await h.f.startCareerEvent('ravine-flight');assert.equal(h.context.activeChallenge.id,'ravine-flight');assert.equal(h.context.mode,'playground');assert.equal(h.context.cars.length,1);assert.equal(h.preferences(),preferences);
 h.f.menu();h.f.openProfile();assert.equal(h.context.careerRun,false);assert.equal(h.context.profileOpen,true);
});
test('career storage failure leaves points unspent and unlock closed; start failure preserves progress and returns to career',async()=>{
 const h=harness({storage:true});h.context.profile.challenges['first-lap']={medal:3,best:64,attempts:1};h.f.openCareer('stunts');h.click('[data-career-unlock="flight-school"]');assert.equal(Career.careerStatus(h.context.profile).available,3);assert.equal(Career.careerChallenge(h.context.profile,'ravine-flight'),undefined);assert.match(h.ui.innerHTML,/points have not been spent/);
 const broken=harness({venue:true});broken.f.openCareer();assert.equal(await broken.f.startCareerEvent('first-lap'),false);assert.equal(broken.context.state,'menu');assert.equal(broken.context.careerOpen,true);assert.equal(broken.context.activeChallenge,undefined);assert.match(broken.ui.innerHTML,/could not start/);
});

test('all 27 career entries launch their actual declared rules and no closed or busy launch bypasses admission',async()=>{
 for(const group of Career.CAREER_GROUPS)for(const id of group.events){
  const h=harness();for(const g of Career.CAREER_GROUPS)for(const event of g.events)h.context.profile.challenges[event]={medal:3,best:1,attempts:1};h.context.profile.career={unlocked:Career.CAREER_GROUPS.filter(g=>g.cost).map(g=>g.id)};
  assert.equal(await h.f.startCareerEvent(id),false,'requires the career board');h.f.openCareer(group.discipline);h.context.preparingEvent=true;assert.equal(await h.f.startCareerEvent(id),false);h.context.preparingEvent=false;
  assert.equal(await h.f.startCareerEvent(id),true);const c=Challenges.CHALLENGES.find(c=>c.id===id)!;assert.equal(h.context.activeChallenge,c);assert.equal(h.context.kind,c.car);assert.equal(h.context.mode,c.mode);assert.equal(h.context.activeVenue.course.id,Challenges.challengeCourse(c));assert.equal(h.f.eventDuration(),c.limit);assert.equal(h.context.careerRun,true);assert.equal(await h.f.startCareerEvent(id),false,'double launch is refused');
 }
});

test('career imports archived championship medals once and preserves them through unlocks and failed saves',()=>{
 const h=harness();h.context.clubRecords={version:1,best:[{series:'road-rally',difficulty:'novice',kind:'buggy',place:1,points:100,wins:4}]};h.f.openCareer('stunts');assert.equal(Career.careerStatus(h.context.profile).available,3);h.click('[data-career-unlock="flight-school"]');assert.equal(Career.careerStatus(h.context.profile).available,0);h.f.openCareer();assert.equal(Career.careerStatus(h.context.profile).available,0);assert.match(h.ui.innerHTML,/Road &amp; Rally|Road & Rally/);assert.equal(readProfile(h.storage.get(PROFILE_KEY)).career?.podiums?.['road-rally'],3);
 const blocked=harness({storage:true});blocked.context.clubRecords=h.context.clubRecords;blocked.f.openCareer('stunts');assert.match(blocked.ui.innerHTML,/could not be saved/);blocked.click('[data-career-unlock="flight-school"]');assert.equal(Career.careerStatus(blocked.context.profile).available,3);assert.equal(Career.careerChallenge(blocked.context.profile,'ravine-flight'),undefined);
});
