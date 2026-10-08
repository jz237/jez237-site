import * as Arenas from '../src/arena-id';
import * as Ghost from '../src/trial-ghost';
import {TrialGhostView} from '../src/trial-ghost-view';
import * as DamageRules from '../src/damage-rules';
import * as GridSetup from '../src/grid-setup';
import * as Grid from '../src/grid-rules';
import * as Timed from '../src/timed-race';
import {AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey} from '../src/ai-difficulty';
import {CollisionScars,captureCollisionMotion,collisionPointVelocity} from '../src/collision-contact';
/** Time Trial production-handler plumbing fixture. No rendering, physics simulation or earned medal
 * is claimed. Production handlers run unmodified; explicit unit outcomes below
 * isolate result/award wiring. Physical attainability is separate evidence. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import ts from 'typescript';
import * as T from 'three';
import * as Trial from '../src/time-trial';
import {showTimeTrialSetup,showTimeTrialResult} from '../src/time-trial-ui';
import {defaultControls} from '../src/driving-controls';
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
const names=[...selectors,'modes','openProfile','bankRun','createCars','start','beginReplay','finish','menu','recover','openTimeTrialSetup','startTimeTrial','finishTimeTrial','beginTrialGhost','finishTrialGhost','controllerContext','pause'];
const declarations=names.map(name=>{
 const fn=main.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text===name);if(fn)return fn.getText(main);
 for(const node of main.statements)if(ts.isVariableStatement(node)){
  const declaration=node.declarationList.declarations.find(d=>ts.isIdentifier(d.name)&&d.name.text===name);
  if(declaration)return 'const '+declaration.getText(main)+';';
 }
 assert.fail('Missing production boundary '+name);
});
const executable=ts.transpileModule(declarations.join('\n')+'\nreturn {'+names.join(',')+'};',
 {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const plain=<T>(value:T):T=>JSON.parse(JSON.stringify(value));

/** Only callback binding/markup identity is modeled here. This is not a browser
 * layout, focus, accessibility or native form-behavior test. */
class UINode {
 id='';className='';textContent='';dataset:Record<string,string>={};children:UINode[]=[];
 onclick:undefined|(()=>unknown);onchange:undefined|(()=>unknown);value='';disabled=false;hidden=false;style={};attributes=new Map<string,string>();
 classList={remove(){},add(){}};
 private html='';
 set innerHTML(html:string){
  this.html=html;this.children=[];
  for(const match of html.matchAll(/<(button|div|section|p|nav|header|footer|input|select|output|h1)\b([^>]*)>/g)){
   const node=new UINode();
   for(const attribute of match[2].matchAll(/([\w-]+)="([^"]*)"/g))node.setAttribute(attribute[1],attribute[2]);
   this.children.push(node);
  }
 }
 get innerHTML(){return this.html;}
 setAttribute(name:string,value:string){this.attributes.set(name,value);if(name==='id')this.id=value;if(name==='class')this.className=value;if(name.startsWith('data-'))this.dataset[name.slice(5)]=value;}
 getAttribute(name:string){return this.attributes.get(name)??null;}
 insertAdjacentHTML(_position:string,html:string){const holder=new UINode();holder.innerHTML=html;this.children.push(...holder.children);}
 append(node:UINode){this.children.push(node);}prepend(node:UINode){this.children.unshift(node);}
 matches(selector:string){
  if(selector.startsWith('#'))return this.id===selector.slice(1);
  if(selector.startsWith('.'))return this.className.split(/\s+/).includes(selector.slice(1));
  const data=/^\[data-([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
  return !!data&&data[1] in this.dataset&&(data[2]===undefined||this.dataset[data[1]]===data[2]);
 }
 querySelectorAll(selector:string):UINode[]{return this.children.flatMap(node=>[...(node.matches(selector)?[node]:[]),...node.querySelectorAll(selector)]);}
 querySelector(selector:string):UINode|null{return this.querySelectorAll(selector==='.footer > div'?'.footer':selector.split(/\s+/).at(-1)!)[0]??null;}
 click(){assert.ok(this.onclick,'Unbound UI control '+this.id+JSON.stringify(this.dataset));return this.onclick();}
}
type Faults={audio?:boolean;warm?:boolean;venue?:boolean;recovery?:boolean;storage?:boolean;trialStorage?:boolean};
function harness(faults:Faults={}){
 const ui=new UINode(),storage=new Map<string,string>(),writes:string[]=[],construction:any[]=[],notices:string[]=[],logs:unknown[]=[];
 const calls={physics:0,render:0,archive:0,capture:0,warm:0,reload:0};let serial=0,venueCalls=0;
 const venues=Object.fromEntries(Object.keys(COURSE_NAMES).map(id=>[id,{course:getRaceCourse(id as any),props:[],puddles:[]} ])),quarry=venues['quarry-v1'];
 const context:any={...Arenas,controllerRumble:{stop(){}},...Ghost,TrialGhostView,trialGhostLibrary:Ghost.readGhostLibrary(null),trialGhostWarning:'',trialGhostRecorder:null,trialGhostView:null,trialGhostTarget:null,trialGhostSplit:'',trialGhostLabel:'PERSONAL BEST',...DamageRules,...GridSetup,...Grid,...Timed,...Timed,T,AI_DIFFICULTIES,readAIDifficulty,sessionAIDifficulty,difficultyRecordKey,...Challenges,...Trial,stockSetup,showTimeTrialSetup,showTimeTrialResult,activeTimeTrial:null,timeTrialOpen:false,timeTrialRecords:Trial.readTimeTrialRecords(),timeTrialSelection:undefined,timeTrialWarning:'',timeTrialInvalidReason:'',timeTrialResult:null,showDriverProfile,MEDALS,awardText,SessionTelemetry,readProfile,settleRun,PROFILE_KEY,ReplayRecorder,
  CAR_KINDS,DEFINITIONS,RACE_NAMES,readEventOptions,directionForCar,derbyGridSlot,eventDerbyOrder,courseRoute,courseGridSlot,COURSE_NAMES,resolveCourseId,CLUB_ROUNDS,demoCarKind,demoVehicleSetup,WaypointRace,structuredClone,Error,Date,
  ui,document:{querySelector:(selector:string)=>ui.querySelector(selector),createElement:()=>new UINode(),hidden:false},
  localStorage:{getItem:(key:string)=>storage.get(key)??null,setItem(key:string,value:string){if(faults.storage||faults.trialStorage&&key===Trial.TIME_TRIAL_KEY)throw Error('Storage blocked');storage.set(key,value);writes.push(key);}},
  crypto:{randomUUID:()=>`unit-run-${++serial}`},console:{warn:(...v:unknown[])=>logs.push(v),error:(...v:unknown[])=>logs.push(v)},location:{reload(){calls.reload++;}},
  activeClubRound:null,clubCup:null,clubWarning:'',clubOpen:false,clubRetired:false,clubPlayerStopped:false,clubFirstFinish:null,clubPlayerRow:null,clubRunStats:undefined,
  activeChallenge:undefined,profile:readProfile(),profileStorageWarning:'',careerOpen:false,careerRun:false,openCareer(){},profileOpen:false,garageOpen:false,eventSetupOpen:false,garage:readGarage(),kind:'buggy',mode:'race',
  eventOptions:{...readEventOptions(),course:'ironfield-figure-eight-v1',field:24,laps:9,direction:'opposing',race:'random',derby:'score',duration:420},demoOptions:{field:24,laps:9,duration:30,camera:'director',lineup:'mixed',build:'garage'},
  online:null,demo:false,demoRestart:0,demoHudHidden:false,autopilot:false,testInput:null,keys:new Set(['KeyW']),traffic:true,
  state:'menu',preparingEvent:false,preparationInterrupted:false,telemetry:null,runId:'',runSettled:true,lastAward:null,resultTitle:'',elapsed:0,countdown:0,accumulator:0,eventFrameTimes:[],wreckHold:0,
  recorder:null,lastReplay:null,replayEpochs:[],studio:null,closeReplayLibrary:null,cars:[],scene:new T.Scene(),activeVenue:quarry,quarryVenue:quarry,waypointRace:null,
  orbit:{enabled:false,maxDistance:22,enablePan:true},camera:new T.PerspectiveCamera(),cameraImpactOffset:new T.Vector3(),staticShadows:undefined,
  director:{reset(){},select(){}},sound:{async init(){if(faults.audio)throw Error('Audio unavailable');},pause(){},clearCars(){},attach(){}},
  drivers:{reset(){}},combat:new CombatScoreboard(),collisionScars:new CollisionScars(),captureCollisionMotion,collisionPointVelocity,impactAdjudicator:{clear(){}},collisions:0,vehicleFire:undefined,puddleSplashes:undefined,
  physics:{step(){calls.physics++;}},events:{clear(){}},fx:{reset(){}},quarry:{resetProps(){}},DERBY_ARENA:{x:0,z:0,radius:45},
  ensureVenue(id:string){venueCalls++;if(faults.venue&&(venueCalls===1||faults.recovery))throw Error('Venue unavailable');return venues[id];},
  activateVenue(venue:unknown){context.activeVenue=venue;},setQuarryMode(){},archiveReplay(){calls.archive++;},captureReplay(){calls.capture++;},syncClubAwards(){},
  loading(){ui.innerHTML='<div class="loading"></div>';},hud(){ui.innerHTML='<div class="hud"></div>';},async warmPrograms(){calls.warm++;if(faults.warm)throw Error('GPU compile failed');},
  toast(message:string){notices.push(message);},pause(){context.state='paused';},studioButtons(container:UINode){assert.ok(container,'Result studio container exists');const replay=new UINode();replay.id='replay-mode';container.append(replay);},openStudio(...args:unknown[]){logs.push({studio:args});},
  isPlayer:(car:any)=>car.id===0,rankRace:()=>context.cars,saved:{best:{}},persist(){assert.fail('Time Trial must not update ordinary best records or preferences');},
  replayMenu(){},openGarage(){},openEventSetup(){},openClubCup(){},fullScreen(){},onlineUI:{show(){}},showDemoSetup(){},closeClubCup(){},closeStudio(){},resume(){context.state=context.resumeState;},resumeState:'playing',settings:{quality:'high',engine:1,effects:1,ambience:1,performance:false},drivingControls:defaultControls(),mountDrivingControls(){},applyQuality(){},CONTROLS_KEY:'unit-controls',updateHud(){},finishClubEvent(){assert.fail('Time Trial must not finish a cup');},
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
 // Same-realm function scope preserves strict plain-object validation in the actual pure/UI modules.
 // The injected storage remains explicit; no globals or production guards are changed.
 context.saveGhostLibrary=(library:Ghost.GhostLibrary)=>Ghost.saveGhostLibrary(library,context.localStorage);
 context.saveTimeTrialRecords=(records:Trial.TimeTrialRecords)=>Trial.saveTimeTrialRecords(records,context.localStorage);
 const f=new Function('context','with(context){'+executable+'}')(context) as Record<string,(...args:any[])=>any>;
 const preferences=()=>JSON.stringify({event:context.eventOptions,garage:context.garage});
 const click=(selector:string)=>{const node=ui.querySelector(selector);assert.ok(node,'Missing real markup control '+selector);return node.click();};
 const settle=()=>new Promise<void>(resolve=>setImmediate(resolve));
 async function select(config:Trial.TimeTrialConfig){f.menu();click('#time-trial');for(const [id,value] of Object.entries(config)){const node=ui.querySelector('#time-trial-'+id)!;node.value=value;node.onchange?.();}click('#time-trial-start');await settle();}
 return{context,f,calls,ui,storage,writes,construction,notices,logs,preferences,click,settle,select};
}

const configurations:Trial.TimeTrialConfig[]=[
 {kind:'coupe',course:'quarry-v1',direction:'forward'},
 {kind:'coupe',course:'quarry-v1',direction:'reverse'},
 {kind:'tern',course:'ironfield-figure-eight-v1',direction:'forward'},
 {kind:'marten',course:'ironfield-figure-eight-v1',direction:'reverse'},
 {kind:'buggy',course:'cinderbank-oval-v1',direction:'forward'},
 {kind:'hatch',course:'cinderbank-oval-v1',direction:'reverse'},
];
/** This explicit unit outcome tests production adjudication, never physical attainment. */
function outcome(h:ReturnType<typeof harness>,seconds=40,finished=true,health=100){
 h.context.state='playing';h.context.elapsed=seconds;
 Object.assign(h.context.cars[0],{finished,passed:finished?24:12,health,finishTime:finished?seconds:0});
 Object.assign(h.context.telemetry.stats,{seconds,distance:700,health,checkpoints:finished?24:12});
}
function result(h:ReturnType<typeof harness>){
 h.f.finish('EXPLICIT UNIT OUTCOME');
 assert.equal(h.context.state,'result');assert.ok(h.ui.querySelector('#time-trial-result'));
 const nav=h.f.controllerContext();assert.equal(nav.key,'time-trial-result');assert.equal(nav.root,h.ui.querySelector('#time-trial-result'));assert.equal(nav.initial,'#again');
 return h.context.timeTrialResult as Trial.TimeTrialResult;
}

test('real menu/setup handlers route six trials to one stock car, one ordered lap and matching replay without changing preferences',async()=>{
 for(const config of configurations){
  const h=harness(),preferences=h.preferences();await h.select(config);
  assert.equal(h.context.state,'countdown',JSON.stringify(h.logs));assert.equal(h.context.preparingEvent,false);
  assert.deepEqual(h.context.activeTimeTrial,config);assert.ok(Object.isFrozen(h.context.activeTimeTrial));assert.notEqual(h.context.activeTimeTrial,config);
  assert.equal(h.context.activeChallenge,undefined);assert.equal(h.context.activeClubRound,null);assert.equal(h.context.timeTrialOpen,false);
  assert.equal(h.f.customEvent(),false);assert.equal(h.f.raceFormat(),'laps');assert.equal(h.f.raceLaps(),1);assert.equal(h.f.raceDirection(),config.direction);
  assert.equal(h.context.activeVenue.course.id,config.course);assert.equal(h.context.cars.length,1);assert.equal(h.context.waypointRace,null);
  const car=h.context.cars[0],grid=courseGridSlot(getRaceCourse(config.course),0,config.direction);
  assert.equal(car.kind,config.kind);assert.deepEqual(car.setup,stockSetup(config.kind));assert.equal(car.ground,h.context.activeVenue.course);
  assert.equal(car.current.x,grid.x);assert.equal(car.current.z,grid.z);assert.equal(car.nextCheckpoint,grid.next);assert.equal(car.passed,grid.passed);
  assert.equal(h.calls.physics,90,'Only creation settling calls through the explicit non-physical fixture');
  assert.equal(h.context.recorder.meta.courseId,config.course==='quarry-v1'?undefined:config.course);assert.equal(h.context.recorder.meta.reverse,config.direction==='reverse');assert.equal(h.context.recorder.meta.cars.length,1);
  assert.equal(h.context.telemetry.stats.seconds,0);assert.equal(h.context.runSettled,false);assert.equal(h.preferences(),preferences);assert.deepEqual(h.writes,[]);
 }
});

test('actual setup/controller Back and guarded starts cannot bypass selection or disturb an active run',async()=>{
 const h=harness();h.f.menu();h.click('#time-trial');const navigation=h.f.controllerContext();
 assert.equal(navigation.key,'time-trial-setup');assert.equal(navigation.initial,'#time-trial-course');assert.equal(navigation.root,h.ui.querySelector('#time-trial-setup'));
 navigation.back();assert.equal(h.context.timeTrialOpen,false);assert.ok(h.ui.querySelector('#time-trial'));
 const preferences=h.preferences();
 for(const config of [{...configurations[0],course:'unknown'},{...configurations[0],direction:'opposing'},{...configurations[0],kind:'unknown'}])assert.equal(await h.f.startTimeTrial(config),false);
 for(const change of [{preparingEvent:true},{online:{active:true}},{state:'playing'}]){
  Object.assign(h.context,change);assert.equal(await h.f.startTimeTrial(configurations[0]),false);Object.assign(h.context,{preparingEvent:false,online:null,state:'menu'});
 }
 assert.equal(h.construction.length,0);assert.equal(h.context.activeTimeTrial,null);assert.equal(h.preferences(),preferences);
 await h.select(configurations[1]);const original=h.context.cars[0],runId=h.context.runId;
 assert.equal(await h.f.startTimeTrial(configurations[0]),false);assert.equal(h.context.cars[0],original);assert.equal(h.context.runId,runId);
});

test('actual finish/retry handlers retain precise bests, replace only faster laps and settle profile once without race wins',async()=>{
 const h=harness(),config=configurations[2];await h.select(config);const preferences=h.preferences();
 const times=[41.123456789,39.876543219,44.123456789,39.876543219];
 let best:number|null=null;
 for(const seconds of times){
  const original=h.context.cars[0],runId=h.context.runId,events=h.context.profile.events;outcome(h,seconds);
  const prior=best,r=result(h);best=Math.min(best??Infinity,seconds);
  assert.equal(r.eligible,true);assert.equal(r.time,seconds);assert.equal(r.previousBest,prior);assert.equal(r.best,best);assert.equal(r.newBest,prior===null||seconds<prior);
  assert.equal(Trial.timeTrialBest(h.context.timeTrialRecords,config),best);assert.deepEqual(Trial.readTimeTrialRecords(h.storage.get(Trial.TIME_TRIAL_KEY)),h.context.timeTrialRecords);
  assert.equal(h.context.telemetry.stats.seconds,seconds);assert.equal(h.context.telemetry.stats.won,false);assert.equal(h.context.telemetry.stats.rank,0);assert.equal(h.context.profile.wins,0);assert.equal(h.context.profile.events,events+1);
  assert.deepEqual(h.context.saved.best,{});assert.deepEqual(h.context.profile.challenges,{});
  const profile=plain(h.context.profile),records=plain(h.context.timeTrialRecords),writes=[...h.writes];h.f.finish('DUPLICATE CALLBACK');
  assert.deepEqual(h.context.profile,profile);assert.deepEqual(h.context.timeTrialRecords,records);assert.deepEqual(h.writes,writes);
  h.click('#again');await h.settle();assert.equal(h.context.state,'countdown');assert.notEqual(h.context.cars[0],original);assert.equal(original.disposed,true);assert.notEqual(h.context.runId,runId);
  assert.equal(h.context.cars[0].health,100);assert.equal(h.context.cars[0].finished,false);assert.equal(h.context.cars[0].penalty,0);assert.deepEqual(h.context.cars[0].setup,stockSetup(config.kind));assert.equal(h.context.telemetry.stats.seconds,0);
  assert.equal(h.context.timeTrialResult,null);assert.equal(h.context.timeTrialInvalidReason,'');assert.deepEqual(h.context.profile,profile);assert.deepEqual(h.context.timeTrialRecords,records);assert.equal(h.preferences(),preferences);
 }
});

test('actual recovery invalidates the run and eligible evidence cannot be forged by mismatched setup, venue, clock or assistance',async()=>{
 const h=harness();await h.select(configurations[4]);h.context.state='playing';h.f.recover();
 assert.equal(h.context.telemetry.stats.recovered,true);assert.equal(h.context.cars[0].penalty,5);assert.equal(h.context.timeTrialInvalidReason,'RECOVERY USED');assert.match(h.notices.at(-1)!,/PRACTICE ONLY/);
 outcome(h);h.context.cars[0].finishTime+=5;const recovered=result(h);assert.equal(recovered.status,'invalid');assert.equal(recovered.eligible,false);assert.match(recovered.reason,/Recovery/);assert.deepEqual(h.context.timeTrialRecords.bests,{});
 const invalidate=[
  (h:any)=>{h.context.cars[0].setup.armor=3;},
  (h:any)=>{h.context.activeVenue=h.context.quarryVenue;},
  (h:any)=>{h.context.activeTimeTrial={...h.context.activeTimeTrial,direction:'reverse'};h.context.cars.push(h.context.cars[0]);},
  (h:any)=>{h.context.telemetry.stats.seconds-=1;},
  (h:any)=>{h.context.testInput={throttle:1};},
  (h:any)=>{h.context.autopilot=true;},
  (h:any)=>{h.context.timeTrialInvalidReason='ASSISTED RUN';},
  (h:any)=>{h.context.telemetry=null;},
 ];
 for(const mutate of invalidate){const h=harness();await h.select(configurations[4]);outcome(h);mutate(h);const r=result(h);assert.equal(r.eligible,false);assert.deepEqual(h.context.timeTrialRecords.bests,{});assert.equal(h.writes.includes(Trial.TIME_TRIAL_KEY),false);}
});

test('explicit retirement and wreck outcomes retain Retry and create no PB; changing trial and Back return through actual callbacks',async()=>{
 for(const health of [100,0]){
  const h=harness();await h.select(configurations[5]);const preferences=h.preferences();outcome(h,12,false,health);
  if(health>0){h.f.pause();assert.equal(h.context.state,'paused');assert.ok(h.ui.querySelector('#time-trial-retire'));h.click('#time-trial-retire');}
  else h.f.finish('UNIT WRECK OUTCOME');
  assert.equal(h.context.state,'result');assert.equal(h.context.timeTrialResult.status,'dnf');assert.equal(h.context.timeTrialResult.time,null);assert.deepEqual(h.context.timeTrialRecords.bests,{});assert.equal(h.context.telemetry.stats.won,false);assert.equal(h.context.telemetry.stats.finished,false);
  assert.ok(h.ui.querySelector('#again'));h.click('#again');await h.settle();assert.equal(h.context.cars[0].health,100);assert.equal(h.context.state,'countdown');assert.equal(h.context.timeTrialInvalidReason,'');
  outcome(h,12,false);result(h);h.click('#time-trial-setup-back');assert.equal(h.context.state,'menu');assert.equal(h.context.activeTimeTrial,null);assert.equal(h.context.activeVenue.course.id,'quarry-v1');assert.equal(h.context.timeTrialOpen,true);assert.equal(h.f.controllerContext().key,'time-trial-setup');
  assert.equal(h.ui.querySelector('#time-trial-course')!.value,configurations[5].course);assert.equal(h.ui.querySelector('#time-trial-direction')!.value,'reverse');
  h.f.controllerContext().back();assert.equal(h.context.timeTrialOpen,false);assert.ok(h.ui.querySelector('#time-trial'));assert.equal(h.preferences(),preferences);
 }
});

test('selective PB save failure retains session result and retry, does not replay XP on reload, and successful retry persists',async()=>{
 const faults:Faults={trialStorage:true},h=harness(faults),config=configurations[3];await h.select(config);outcome(h,42.25);const r=result(h);
 assert.equal(r.eligible,true);assert.equal(r.newBest,true);assert.equal(Trial.timeTrialBest(h.context.timeTrialRecords,config),42.25);assert.match(h.context.timeTrialWarning,/session.*storage/);assert.match(h.ui.innerHTML,/session.*storage/);
 assert.equal(h.storage.has(Trial.TIME_TRIAL_KEY),false);assert.equal(h.storage.has(PROFILE_KEY),true);assert.deepEqual(Trial.loadTimeTrialRecords(h.context.localStorage).records.bests,{});
 const profile=readProfile(h.storage.get(PROFILE_KEY)),events=profile.events;h.f.finish('DUPLICATE');assert.equal(h.context.profile.events,events);
 const reloaded=harness();for(const [key,value] of h.storage)reloaded.storage.set(key,value);reloaded.context.profile=readProfile(reloaded.storage.get(PROFILE_KEY));reloaded.context.timeTrialRecords=Trial.loadTimeTrialRecords(reloaded.context.localStorage).records;
 reloaded.f.menu();assert.deepEqual(reloaded.context.profile,profile);assert.equal(reloaded.writes.length,0,'Boot/menu does not invent an award from a lost PB');
 faults.trialStorage=false;h.click('#again');await h.settle();outcome(h,40.5);result(h);assert.equal(h.context.timeTrialWarning,'');assert.equal(Trial.timeTrialBest(Trial.readTimeTrialRecords(h.storage.get(Trial.TIME_TRIAL_KEY)),config),40.5);assert.equal(h.context.profile.events,events+1);
});

test('Time Trial result owns its replay row and controller Back without modifying eligibility or settled state',async()=>{
 const h=harness(),config=configurations[3];await h.select(config);outcome(h);result(h);
 const panel=h.ui.querySelector('#time-trial-result .event-panel')!,row=panel.children.find(n=>n.className==='event-actions');assert.ok(row);assert.ok(row.querySelector('#replay-mode'));assert.equal(h.ui.querySelector('.overlay'),null);
 const before=plain({records:h.context.timeTrialRecords,profile:h.context.profile,result:h.context.timeTrialResult}),writes=[...h.writes];h.click('#replay-mode');
 assert.deepEqual(h.logs.at(-1),{studio:[false,undefined,`${COURSE_NAMES[config.course]} · Time Trial · ${DEFINITIONS[config.kind].name} · reverse`]});
 assert.deepEqual({records:h.context.timeTrialRecords,profile:h.context.profile,result:h.context.timeTrialResult},before);assert.deepEqual(h.writes,writes);
 // This only proves the opening callback. Actual replay physics/camera restoration is browser evidence.
 h.f.controllerContext().back();assert.equal(h.context.state,'menu');assert.equal(h.context.activeTimeTrial,null);assert.equal(h.context.activeVenue.course.id,'quarry-v1');assert.deepEqual(h.context.profile,before.profile);assert.deepEqual(h.context.timeTrialRecords,before.records);
});

test('actual start failures clear attempt state, preserve records/previous replay and recover a usable menu',async()=>{
 for(const faults of [{venue:true},{warm:true},{venue:true,recovery:true}]){
  const h=harness(faults),config=configurations[1],preferences=h.preferences(),record={version:1 as const,bests:{[Trial.timeTrialKey(config)]:38.5}},replay={unit:'previous recording'};
  h.context.timeTrialRecords=record;h.context.lastReplay=replay;assert.equal(await h.f.startTimeTrial(config),false);
  assert.equal(h.context.activeTimeTrial,null);assert.equal(h.context.timeTrialOpen,false);assert.equal(h.context.timeTrialResult,null);assert.equal(h.context.telemetry,null);assert.equal(h.context.preparingEvent,false);assert.equal(h.context.runSettled,true);
  assert.equal(h.context.lastReplay,replay);assert.deepEqual(h.context.timeTrialRecords,record);assert.equal(h.context.profile.events,0);assert.deepEqual(h.writes,[]);assert.equal(h.preferences(),preferences);
  if(faults.recovery){assert.equal(h.context.state,'loading');h.click('#event-reload');assert.equal(h.calls.reload,1);}
  else {assert.equal(h.context.state,'menu');assert.ok(h.ui.querySelector('#time-trial'));assert.equal(h.context.activeVenue.course.id,'quarry-v1');}
 }
 const h=harness({audio:true});assert.equal(await h.f.startTimeTrial(configurations[0]),true);assert.equal(h.context.state,'countdown');assert.match(h.notices[0],/Sound unavailable/);
});

test('leaving trial restores custom-event, garage, demo and online defaults rather than retaining solo overrides',async()=>{
 const h=harness();await h.select(configurations[5]);h.context.state='playing';h.f.pause();h.click('#main-menu');
 assert.equal(h.context.activeTimeTrial,null);assert.equal(h.f.customEvent(),true);assert.equal(h.f.raceFormat(),'random');assert.equal(h.f.raceLaps(),9);assert.equal(h.f.preferredCourse(),'ironfield-figure-eight-v1');
 h.context.eventOptions.race='laps';h.f.createCars();assert.equal(h.context.cars.length,24);assert.equal(h.context.activeVenue.course.id,'ironfield-figure-eight-v1');assert.equal(h.f.raceDirection(1),'reverse');assert.deepEqual(h.context.cars[0].setup,h.context.garage.cars[h.context.kind].setup);
 h.context.state='menu';await h.f.startTimeTrial(configurations[0]);await h.f.start(true);assert.equal(h.context.activeTimeTrial,null);assert.equal(h.context.demo,true);assert.equal(h.context.cars.length,24);assert.equal(h.context.telemetry,null);
 h.context.demo=false;h.context.online={active:true,network:{snapshot:{event:{rules:{race:'laps',direction:'reverse',laps:5,duration:99,derby:'score'}}}}};
 assert.equal(h.f.preferredCourse(),'quarry-v1');assert.equal(h.f.raceLaps(),5);assert.equal(h.f.raceDirection(),'reverse');assert.equal(h.f.eventDuration(),99);
});

test('actual Time Trial handlers save a complete PB ghost, race it on Retry and preserve it after a rejected attempt',async()=>{
 const h=harness(),config=configurations[0];await h.select(config);
 const p=h.context.cars[0];
 // Explicit unit motion/gate evidence exercises settlement plumbing; physical
 // laps and rendered ghost positions are covered by the browser acceptance.
 for(let i=1;i<=2400;i++){const t=i/60;p.current.set(t,1,t);h.context.trialGhostRecorder.sample(t,p.current,p.currentQ);if(i%100===0)h.context.trialGhostRecorder.gate(i/100,t);}
 outcome(h,40);const r=result(h);assert.equal(r.newBest,true);
 const saved=h.storage.get(Ghost.TRIAL_GHOST_KEY);assert.ok(saved);const ghost=Ghost.findTrialGhost(Ghost.readGhostLibrary(saved),config,40);assert.ok(ghost);
 await h.f.start(false);assert.equal(h.context.trialGhostTarget.time,40);assert.ok(h.context.trialGhostView);
 assert.equal(h.context.trialGhostRecorder.gates.length,0);assert.equal(h.context.cars.length,1);
 outcome(h,35);h.context.timeTrialInvalidReason='ASSISTED RUN';result(h);assert.equal(h.storage.get(Ghost.TRIAL_GHOST_KEY),saved);
});
