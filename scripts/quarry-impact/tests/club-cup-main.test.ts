import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

/** Execute unmodified production declarations with explicit external boundaries.
 * Only requested top-level variables/functions are extracted; method bodies and
 * event predicates are never copied into this harness. */
function mainBoundaries(names:readonly string[],context:Record<string,unknown>,main=new URL('../src/main.ts',import.meta.url)){
 const text=readFileSync(main,'utf8'),source=ts.createSourceFile('main.ts',text,ts.ScriptTarget.ES2022,true,ts.ScriptKind.TS);
 const declarations=names.map(name=>{
  const fn=source.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text===name);
  if(fn)return fn.getText(source);
  for(const statement of source.statements)if(ts.isVariableStatement(statement)){
   const declaration=statement.declarationList.declarations.find(d=>ts.isIdentifier(d.name)&&d.name.text===name);
   if(declaration)return `const ${declaration.getText(source)};`;
  }
  assert.fail(`Missing production main boundary ${name}`);
 });
 const code=ts.transpileModule(`${declarations.join('\n')}\nglobalThis.boundaries={${names.join(',')}};`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
 runInNewContext(code,context);return context.boundaries as Record<string,(...args:any[])=>any>;
}

import * as T from 'three';
import R from '@dimforge/rapier3d-compat';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadCarWithoutImages} from '../tools/car-asset-audit';
import {loadCars} from '../src/assets';
import {Vehicle} from '../src/vehicle';
import {stockSetup} from '../src/garage';
import {CAR_KINDS,DEFINITIONS,type CarKind} from '../src/rules';
import {RACE_NAMES,CombatScoreboard,derbyGridSlot,directionForCar,eventDerbyOrder,checkRoute,lapProgress,stepScoreRespawns,readEventOptions} from '../src/event-rules';
import {getRaceCourse,courseRoute,courseRecoverySlot} from '../src/race-course';
import {ImpactAdjudicator} from '../src/impact-adjudication';
import {vehicleContact,vehicleContactManifold} from '../src/vehicle-contact';
import * as Cup from '../src/club-cup';
import {SessionTelemetry} from '../src/session-telemetry';
let initialized:Promise<void>|undefined;
function init(){return initialized??=(async()=>{
 await R.init();const original=GLTFLoader.prototype.loadAsync;
 GLTFLoader.prototype.loadAsync=async url=>loadCarWithoutImages(/\/(coupe|sedan|hatch|muscle|wagon|utility|compact|van|tern|marten|buggy|wheel-machining)\.glb$/.exec(String(url))![1]);
 try{await loadCars(()=>{});}finally{GLTFLoader.prototype.loadAsync=original;}
})();}
/** Actual prepared Vehicle objects and current controllers; only GPU, sound and
 * UI are replaced. The production step itself stays unmodified. */
async function physicsMainHarness(names:readonly string[],overrides:Record<string,unknown>={},kinds:readonly CarKind[]=['tern','marten','buggy']){
 await init();const world=new R.World({x:0,y:-9.81,z:0}),events=new R.EventQueue(true),scene=new T.Scene();world.timestep=1/60;
 world.createCollider(R.ColliderDesc.cuboid(120,.5,120).setTranslation(0,-.5,0));
 const fx={emit(){},mark(){},detach(m:T.Mesh){m.visible=false;},reset(){},update(){}} as any;
 const surface={height:()=>0,surface:()=> 'asphalt' as const},cars=kinds.map((kind,i)=>new Vehicle(i,kind,0xffffff,scene,world,fx,stockSetup(kind),surface));
 cars.forEach((car,i)=>car.place(-30+i*10,0,0));
 for(let tick=0;tick<90;tick++){cars.forEach(c=>c.preStep(1/60));world.step();cars.forEach(c=>c.postStep(1/60,0));}
 const venue={course:{...getRaceCourse('quarry-v1'),...surface,outside:()=>false},props:[]},calls:{finish:string[];input:number;ai:number;recover:number;impacts:number}={finish:[],input:0,ai:0,recover:0,impacts:0};
 const context:any={T,...Cup,structuredClone,activeClubRound:null,clubRetired:false,clubPlayerStopped:false,clubFirstFinish:null,clubPlayerRow:null,clubRunStats:undefined,keys:new Set(),runSettled:false,quarry:{arenaLayout:{x:0,z:0,radius:45}},CAR_KINDS,DEFINITIONS,derbyGridSlot,directionForCar,eventDerbyOrder,checkRoute,lapProgress,stepScoreRespawns,courseRoute,courseRecoverySlot,vehicleContact,vehicleContactManifold,
  cars,physics:world,events,fx,state:'playing',elapsed:0,countdown:0,demo:false,autopilot:false,testInput:null,online:null,activeChallenge:undefined,waypointRace:null,activeVenue:venue,quarryVenue:venue,
  eventOptions:readEventOptions(),demoOptions:{laps:2,duration:90},impactAdjudicator:new ImpactAdjudicator(),combat:new CombatScoreboard(),telemetry:new SessionTelemetry(),collisions:0,
  drivers:{memory:new Map()},DERBY_ARENA:{x:0,z:0,radius:45},mode:'race',impactAudioSeverity:()=>0,
  toast(){},sound:{impact(){calls.impacts++;}},input(){calls.input++;return{throttle:1,steer:.25,brake:0,handbrake:false};},ai(){calls.ai++;return{throttle:.6,steer:0,brake:0,handbrake:false};},recover(){calls.recover++;},finish(title:string){calls.finish.push(title);context.state='result';},...overrides};
 const functions=mainBoundaries(names,context);return{context,functions,calls,cars,world,events,dispose(){cars.forEach(c=>c.dispose());events.free();world.free();}};
}

import test from 'node:test';
import {resolveCourseId} from '../src/course-id';
import {courseGridSlot} from '../src/race-course';
import {readGarage,normalizeSetup} from '../src/garage';
import {ReplayRecorder} from '../src/replay-data';
import {readProfile,PROFILE_KEY,settleRun} from '../src/progression';
import {demoCarKind,demoVehicleSetup} from '../src/demo-session';
import {WaypointRace} from '../src/waypoint-race';
const selectors=['clubRound','customEvent','onlineRules','raceFormat','raceDirection','raceRoute','scoreDerby','derbyRanking','eventDuration','raceLaps','preferredCourse'] as const;
const clubNames=['saveClubCup','syncClubAwards','bankRun','openClubCup','closeClubCup','startClubRound','clubRow','freezeClubPlayer','finishClubEvent'] as const;
const uuid='08f09f83-cd9e-4db9-972e-3d99bd654578';
const plain=<T>(v:T):T=>JSON.parse(JSON.stringify(v));
function readyCup(index=0){
 let cup=Cup.createClubCup('tern',uuid,1000);
 while(cup.results.length<index){cup=Cup.beginClubRound(cup);cup=Cup.finishClubRound(cup,cup.roster.map(r=>({slot:r.slot,status:'finished',finishTime:80+r.slot,health:100,progress:48,damage:0})));}
 return cup;
}
function node(){return {textContent:'',className:'',style:{},onclick:null as null|(()=>void),append(){},prepend(){},setAttribute(){},remove(){}};}
function base(overrides:Record<string,unknown>={}){
 const nodes=new Map<string,ReturnType<typeof node>>(),storage=new Map<string,string>(),writes:string[]=[],calls={capture:0,render:0,studio:0,menu:0,start:0,physics:0};
 const ui={innerHTML:'',classList:{remove(){}},querySelector(selector:string){if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);},querySelectorAll(){return[];}};
 const car=(id:number,kind:CarKind='tern')=>({id,kind,setup:stockSetup(kind),paintColor:new T.Color(0xffffff),root:new T.Group(),previous:new T.Vector3(),current:new T.Vector3(id*8,0,0),currentQ:new T.Quaternion(),health:100,passed:0,nextCheckpoint:1,checkpointDistance:Infinity,lap:1,finished:false,finishTime:0,penalty:0,inflicted:0,input:{throttle:1,steer:0,brake:0,handbrake:false},velocity:new T.Vector3(),forward:new T.Vector3(0,0,1),right:new T.Vector3(1,0,0),controller:{wheelIsInContact:()=>true},preStep(){},postStep(){},render(){calls.render++;},dispose(){},place(x:number,z:number){this.current.set(x,.89,z);}});
 const quarryVenue={course:getRaceCourse('quarry-v1'),props:[]},ironfieldVenue={course:getRaceCourse('ironfield-figure-eight-v1'),props:[]};
 const context:any={T,...Cup,RACE_NAMES,structuredClone,Error,Date,console,resolveCourseId,derbyGridSlot,directionForCar,eventDerbyOrder,courseRoute,courseRecoverySlot,courseGridSlot,checkRoute,lapProgress,stepScoreRespawns,stockSetup,readProfile,PROFILE_KEY,settleRun,SessionTelemetry,ReplayRecorder,CAR_KINDS,DEFINITIONS,WaypointRace,demoCarKind,demoVehicleSetup,
  activeClubRound:null,clubCup:null,clubWarning:'',clubOpen:false,clubRetired:false,clubPlayerStopped:false,clubFirstFinish:null,clubPlayerRow:null,clubRunStats:undefined,
  activeChallenge:undefined,demo:false,online:null,kind:'tern',mode:'race',eventOptions:{...readEventOptions(),course:'ironfield-figure-eight-v1',field:24,laps:9,direction:'reverse',race:'random',derby:'score',duration:420},demoOptions:{field:6,laps:4,duration:30,camera:'director',loop:'stop',lineup:'mixed',build:'stock'},
  profile:readProfile(),profileStorageWarning:'',telemetry:new SessionTelemetry(),runId:'ordinary-run',runSettled:false,lastAward:null,state:'playing',elapsed:10,preparingEvent:false,keys:new Set(['KeyW']),testInput:null,cars:CAR_KINDS.map((kind,i)=>car(i,kind)),activeVenue:quarryVenue,quarryVenue,waypointRace:null,combat:new CombatScoreboard(),autopilot:false,
  director:{reset(){}},orbit:{enabled:false,maxDistance:22,enablePan:true},openGarage(){},openProfile(){},openEventSetup(){},replayMenu(){},pause(){},fullScreen(){},onlineUI:{show(){}},
  ui,document:{createElement:node,querySelector:ui.querySelector,hidden:false},localStorage:{getItem:(key:string)=>storage.get(key)??null,setItem:(key:string,value:string)=>{writes.push(key);storage.set(key,value);},removeItem:(key:string)=>{storage.delete(key);}},crypto:{randomUUID:()=>uuid},
  sound:{pause(){},clearCars(){},attach(){},async init(){},impact(){}},captureReplay(){calls.capture++;},studioButtons(){calls.studio++;},showClubCup(_ui:unknown,_cup:unknown,_kind:unknown,callbacks:unknown){context.board=callbacks;},
  bankRun(){},async start(){calls.start++;context.state='countdown';context.runSettled=false;return true;},createCars(){},menu(){calls.menu++;context.state='menu';context.activeClubRound=null;},archiveReplay(){},toast(){},isPlayer:(c:any)=>c.id===0,
  updateHud(){},saved:{best:{}},persist(){throw Error('Cup leaked into ordinary records');},eventLabel:()=> 'TEST EVENT',resultTitle:'',collisions:0,impactAdjudicator:new ImpactAdjudicator(),drivers:{memory:new Map(),reset(){}},physics:{step(){calls.physics++;}},events:{clear(){},drainContactForceEvents(){}},fx:{reset(){},update(){}},vehicleFire:undefined,puddleSplashes:undefined,quarry:{resetProps(){},arenaLayout:{x:0,z:0,radius:45}},scene:new T.Scene(),traffic:true,garage:readGarage(),DERBY_ARENA:{x:0,z:0,radius:45},setQuarryMode(){},
  ensureVenue:(id:string)=>id==='quarry-v1'?quarryVenue:ironfieldVenue,activateVenue(venue:unknown){context.activeVenue=venue;},impactAudioSeverity:()=>0,
  ...overrides};
 return {context,calls,nodes,storage,writes,car};
}
function load(h:ReturnType<typeof base>,names:readonly string[]){return mainBoundaries(names,h.context);}

test('club selectors and actual creation override saved custom rules/builds, retaining ordinary defaults and replay identity',()=>{
 for(let index=0;index<3;index++){
  const h=base({clubCup:readyCup(index),activeClubRound:index});
  h.context.garage.cars.tern.setup={...stockSetup('tern'),engine:3,armor:3,tires:3};
  const supplied:Array<unknown>=[];
  h.context.Vehicle=class {
   id:number;kind:CarKind;setup:any;paintColor:T.Color;root=new T.Group();current=new T.Vector3();previous=new T.Vector3();waters=[];nextCheckpoint=0;passed=0;
   constructor(id:number,kind:CarKind,color:number,_scene:unknown,_world:unknown,_fx:unknown,setup:unknown,readonly ground:unknown){this.id=id;this.kind=kind;this.paintColor=new T.Color(color);this.setup=normalizeSetup(setup,kind);supplied.push(setup);}
   place(x:number,z:number){this.current.set(x,.89,z);}preStep(){}postStep(){}render(){}dispose(){}
  };
  const f=load(h,[...selectors,'createCars','beginReplay']);h.context.mode=Cup.CLUB_ROUNDS[index].mode;
  assert.equal(f.raceFormat(),'laps');assert.equal(f.raceDirection(0),'forward');assert.equal(f.raceDirection(1),'forward');assert.equal(f.scoreDerby(),false);assert.equal(f.raceLaps(),Cup.CLUB_ROUNDS[index].laps);assert.equal(f.eventDuration(),Cup.CLUB_ROUNDS[index].duration);
  f.createCars();assert.equal(h.context.cars.length,11);assert.deepEqual(plain(h.context.cars.map((c:any)=>c.kind)),Cup.CLUB_KINDS.map((_,i)=>Cup.CLUB_KINDS[(8+i)%11]));assert.ok(supplied.every(s=>s===undefined));
  for(const c of h.context.cars)assert.deepEqual(plain(c.setup),plain(stockSetup(c.kind)));
  assert.equal(h.context.activeVenue.course.id,Cup.CLUB_ROUNDS[index].course);assert.equal(h.calls.physics,90);assert.equal(h.context.waypointRace,null);
  if(index<2)for(const c of h.context.cars){const p=courseGridSlot(h.context.activeVenue.course,c.id,'forward');assert.equal(c.current.x,p.x);assert.equal(c.current.z,p.z);assert.equal(c.passed,p.passed);assert.equal(c.nextCheckpoint,p.next);}
  f.beginReplay();assert.equal(h.context.recorder.meta.reverse,false);assert.equal(h.context.recorder.meta.courseId,index===1?'ironfield-figure-eight-v1':undefined);assert.equal(h.context.recorder.meta.cars.length,11);
 }
 const h=base(),f=load(h,selectors);assert.equal(f.raceFormat(),'random');assert.equal(f.raceDirection(),'forward');assert.equal(f.raceLaps(),9);assert.equal(f.preferredCourse(),'quarry-v1');
 h.context.eventOptions.race='laps';assert.equal(f.raceDirection(),'reverse');assert.equal(f.preferredCourse(),'ironfield-figure-eight-v1');
 h.context.activeChallenge={laps:1,limit:70};assert.equal(f.raceLaps(),1);assert.equal(f.preferredCourse(),'quarry-v1');assert.equal(f.raceDirection(),'forward');
 h.context.activeChallenge=undefined;h.context.demo=true;assert.equal(f.raceLaps(),4);assert.equal(f.eventDuration(),30);
 h.context.demo=false;h.context.online={active:true,network:{snapshot:{event:{rules:{race:'laps',direction:'opposing',laps:6,duration:45,derby:'score'}}}}};assert.equal(f.raceDirection(1),'reverse');assert.equal(f.raceLaps(),6);assert.equal(f.preferredCourse(),'quarry-v1');
});

test('a living retired player brakes in actual Vehicle physics while AI and genuine collision damage continue without extra XP',async()=>{
 const names=[...selectors.filter(n=>n!=='preferredCourse'),'rankRace','clubRow','freezeClubPlayer','recover','step'];
 const h=await physicsMainHarness(names,{activeClubRound:0});
 try{
  for(let tick=0;tick<30;tick++)h.functions.step(1/60);
  const player=h.cars[0],health=player.health,telemetry=h.context.telemetry,otherPosition=h.cars[2].current.clone();
  h.functions.freezeClubPlayer(true);const observed=JSON.stringify(h.context.clubRunStats),row=JSON.stringify(h.context.clubPlayerRow),inputCalls=h.calls.input;
  assert.equal(player.health,health,'Retirement itself must not damage the car');assert.equal(h.context.telemetry,null);assert.equal(h.context.clubPlayerRow.status,'retired');
  const beforeRecovery=player.current.clone(),penalty=player.penalty;h.functions.recover();assert.deepEqual(player.current,beforeRecovery);assert.equal(player.penalty,penalty);
  // Real chassis-to-chassis collision after retirement, not a fabricated hit coordinate.
  player.place(0,0,0);h.cars[1].place(0,10,Math.PI);h.cars[1].body.setLinvel({x:0,y:0,z:-24},true);
  for(let tick=0;tick<90;tick++)h.functions.step(1/60);
  assert.equal(h.context.state,'playing');assert.equal(h.calls.input,inputCalls);assert.deepEqual(plain(player.input),{throttle:0,steer:0,brake:1,handbrake:false});
  assert.ok(h.cars[2].current.distanceTo(otherPosition)>2,'Unretired opponent keeps driving');assert.ok(h.calls.impacts>0&&player.health<health&&h.cars[1].health<100,'Actual contact still causes both cars structural damage');
  assert.equal(JSON.stringify(h.context.clubRunStats),observed);assert.equal(JSON.stringify(h.context.clubPlayerRow),row);assert.deepEqual(plain(telemetry.stats),plain(h.context.clubRunStats));assert.equal(h.context.clubPlayerRow.finishTime,null);
 }finally{h.dispose();}
});

test('a true finish freezes player control/statistics while the field continues, and later damage cannot erase the result',async()=>{
 const h=await physicsMainHarness([...selectors.filter(n=>n!=='preferredCourse'),'rankRace','clubRow','freezeClubPlayer','recover','step'],{activeClubRound:0});
 try{
  const player=h.cars[0],route=courseRoute(getRaceCourse('quarry-v1'),'forward');
  // Boundary fixture: only the final gate remains; crossing uses production checkRoute.
  player.passed=47;player.nextCheckpoint=0;player.checkpointDistance=Infinity;player.place(route[0].x,route[0].z,0);h.context.elapsed=80;
  h.functions.step(1/60);assert.equal(player.finished,true);assert.equal(player.passed,48);assert.equal(h.context.clubPlayerStopped,true);assert.equal(h.context.state,'playing');
  assert.equal(h.context.clubRunStats.seconds,player.finishTime);const frozen=JSON.stringify(h.context.clubRunStats),finishTime=player.finishTime,inputCalls=h.calls.input;
  for(let tick=0;tick<30;tick++)h.functions.step(1/60);
  assert.equal(h.calls.input,inputCalls);assert.ok(h.calls.ai>0);assert.equal(JSON.stringify(h.context.clubRunStats),frozen);
  player.health=0;assert.equal(h.functions.clubRow(player).status,'finished');assert.equal(h.functions.clubRow(player).finishTime,finishTime);
  const ai=h.cars[1];ai.finished=true;ai.finishTime=81;ai.health=0;assert.equal(h.functions.clubRow(ai).status,'finished');assert.equal(h.functions.clubRow(ai).finishTime,81);
 }finally{h.dispose();}
});

function stepFixture(index:number){
 const h=base({activeClubRound:index,clubCup:Cup.beginClubRound(readyCup(index)),mode:Cup.CLUB_ROUNDS[index].mode});
 h.context.activeVenue={course:{...getRaceCourse('quarry-v1'),outside:()=>false},props:[]};h.context.quarryVenue=h.context.activeVenue;
 h.context.input=()=>({throttle:0,steer:0,brake:0,handbrake:false});h.context.ai=h.context.input;h.context.telemetry=null;
 const titles:string[]=[];h.context.finish=(title:string)=>{titles.push(title);h.context.state='result';};
 const f=load(h,[...selectors,'rankRace','clubRow','freezeClubPlayer','step']);return{...h,f,titles};
}
test('production completion waits for real finishers or explicit deadlines, including retirement and survival limits',()=>{
 const a=stepFixture(0);a.context.elapsed=100;a.context.cars[1].finished=true;a.context.cars[1].finishTime=98;a.f.step(1/60);assert.equal(a.context.state,'playing');assert.equal(a.context.clubFirstFinish,100+1/60);
 a.context.elapsed=a.context.clubFirstFinish+45-1/30;a.f.step(1/60);assert.equal(a.context.state,'playing');a.f.step(1/60);assert.equal(a.context.state,'result');assert.equal(a.context.cars[0].finished,false);assert.equal(a.context.cars[0].finishTime,0);
 const b=stepFixture(1);b.context.elapsed=300-1/30;b.f.step(1/60);assert.equal(b.context.state,'playing');b.context.elapsed=300;b.f.step(1/60);assert.equal(b.context.state,'result');assert.ok(b.context.cars.every((c:any)=>!c.finished&&c.finishTime===0));
 const c=stepFixture(0);c.f.freezeClubPlayer(true);c.context.cars.slice(1).forEach((v:any,i:number)=>i%2?Object.assign(v,{finished:true,finishTime:50+i}):v.health=0);c.f.step(1/60);assert.equal(c.context.state,'result');assert.equal(c.context.cars[0].health,100);
 const d=stepFixture(2);d.f.freezeClubPlayer(true);d.context.elapsed=89.9;d.f.step(1/60);assert.equal(d.context.state,'playing');d.context.elapsed=90;d.f.step(1/60);assert.equal(d.context.state,'result');assert.equal(d.context.cars[0].health,100);
 const e=stepFixture(2);e.context.cars[0].health=0;e.f.step(1/60);assert.equal(e.context.state,'playing');assert.equal(e.context.clubPlayerStopped,true);e.context.cars.slice(2).forEach((v:any)=>v.health=0);e.f.step(1/60);assert.equal(e.context.state,'result');
});

test('actual cup finish saves canonical outcome before XP, keeps replay controls, and bypasses single-event records/wreck exit',()=>{
 const h=base({activeClubRound:0,clubCup:Cup.beginClubRound(readyCup()),elapsed:90});
 Object.assign(h.context.telemetry.stats,{seconds:80,distance:1200,damage:8,checkpoints:35});h.context.cars[0].health=0;h.context.cars[0].passed=35;
 h.context.cars.slice(1).forEach((c:any,i:number)=>Object.assign(c,{finished:true,finishTime:81+i,passed:48}));
 const f=load(h,[...selectors,...clubNames,'finish']);f.finish('RETIRED');
 assert.equal(h.context.state,'result');assert.equal(h.context.clubCup.results.length,1);assert.equal(h.context.clubCup.phase,'ready');assert.ok(h.calls.capture>0);assert.ok(h.calls.studio>0);assert.equal(h.context.saved.best&&Object.keys(h.context.saved.best).length,0);
 const row=h.context.clubCup.results[0].rows.find((r:any)=>r.slot===0);assert.equal(row.status,'wrecked');assert.equal(row.finishTime,null);assert.equal(row.points,0);assert.equal(h.writes[0],Cup.CLUB_CUP_KEY);assert.equal(h.writes[1],PROFILE_KEY);
 const points=JSON.stringify(h.context.clubCup),profile=JSON.stringify(h.context.profile);f.finish('LATE DUPLICATE');f.finishClubEvent();assert.equal(JSON.stringify(h.context.clubCup),points);assert.equal(JSON.stringify(h.context.profile),profile);
 assert.equal(h.context.profile.events,1);assert.equal(h.context.profile.settled.filter((id:string)=>id===Cup.clubRoundRunId(h.context.clubCup,0)).length,1);
});

test('interrupted rounds skip partial XP, retry the same deterministic run, and saved completion recovers a failed profile write once',async()=>{
 const h=base({clubCup:readyCup(1),activeClubRound:1});Object.assign(h.context.telemetry.stats,{seconds:20,distance:500,damage:10});
 const f=load(h,[...selectors,...clubNames]);f.bankRun(false);assert.equal(h.context.profile.distance,0);assert.equal(h.context.runSettled,false);assert.equal(h.writes.length,0);
 assert.equal(await f.startClubRound(),true);const id=h.context.runId;assert.equal(id,Cup.clubRoundRunId(h.context.clubCup,1));assert.equal(h.context.clubCup.phase,'running');assert.equal(h.context.kind,'tern');assert.equal(h.context.mode,'race');
 const reloaded=base({clubCup:Cup.readClubCup(h.storage.get(Cup.CLUB_CUP_KEY)),state:'menu'}),g=load(reloaded,[...selectors,...clubNames]);assert.equal(await g.startClubRound(),true);assert.equal(reloaded.context.runId,id);assert.equal(reloaded.context.activeClubRound,1);assert.equal(reloaded.context.clubCup.results.length,1);
 const fail=base({activeClubRound:0,clubCup:Cup.beginClubRound(readyCup())});Object.assign(fail.context.telemetry.stats,{seconds:80,distance:1200,damage:10,checkpoints:48});fail.context.cars.forEach((c:any,i:number)=>Object.assign(c,{finished:true,finishTime:80+i,passed:48}));
 const save=fail.context.localStorage.setItem;fail.context.localStorage.setItem=(key:string,value:string)=>{if(key===PROFILE_KEY)throw Error('quota');save(key,value);};const finish=load(fail,[...selectors,...clubNames]);finish.finishClubEvent();assert.ok(fail.storage.has(Cup.CLUB_CUP_KEY));assert.equal(fail.storage.has(PROFILE_KEY),false);assert.match(fail.context.profileStorageWarning,/XP will be recovered/);
 const boot=base({clubCup:Cup.readClubCup(fail.storage.get(Cup.CLUB_CUP_KEY))}),sync=load(boot,['saveClubCup','syncClubAwards']);sync.syncClubAwards();assert.equal(boot.context.profile.events,1);const awarded=JSON.stringify(boot.context.profile);sync.syncClubAwards();assert.equal(JSON.stringify(boot.context.profile),awarded);
 const noSave=base({activeClubRound:0,clubCup:Cup.beginClubRound(readyCup())});Object.assign(noSave.context.telemetry.stats,{seconds:80,distance:1200});noSave.context.localStorage.setItem=()=>{throw Error('storage blocked');};load(noSave,[...selectors,...clubNames]).finishClubEvent();assert.equal(noSave.context.profile.events,0);assert.match(noSave.context.clubWarning,/Keep this page open/);assert.equal(noSave.context.clubCup.results.length,1);
});

test('retirement during countdown waits for green, then blocks player control without changing health',()=>{
 const h=stepFixture(0);h.context.state='countdown';h.context.countdown=.5;let inputCalls=0;h.context.input=()=>{inputCalls++;return {throttle:1,steer:1,brake:0,handbrake:false};};
 h.f.freezeClubPlayer(true);const before=plain(h.context.clubPlayerRow);h.f.step(.25);assert.equal(h.context.state,'countdown');assert.equal(inputCalls,0);h.f.step(.25);assert.equal(h.context.state,'playing');h.f.step(1/60);
 assert.equal(inputCalls,0);assert.deepEqual(plain(h.context.cars[0].input),{throttle:0,steer:0,brake:1,handbrake:false});assert.equal(h.context.cars[0].health,100);assert.deepEqual(plain(h.context.clubPlayerRow),before);assert.equal(h.context.elapsed,10+1/60);
});

test('real menu exit clears active cup overrides but preserves the interrupted round and never banks its partial attempt',async()=>{
 const h=base({clubCup:Cup.beginClubRound(readyCup(1)),activeClubRound:1,state:'paused'});Object.assign(h.context.telemetry.stats,{seconds:20,distance:500,damage:10});
 const f=load(h,[...selectors,...clubNames,'raceLabel','modes','menu']);const cup=JSON.stringify(h.context.clubCup);f.closeClubCup();
 assert.equal(h.context.state,'menu');assert.equal(h.context.activeClubRound,null);assert.equal(h.context.telemetry,null);assert.equal(JSON.stringify(h.context.clubCup),cup);assert.equal(h.context.profile.events,0);assert.equal(h.context.profile.distance,0);assert.equal(f.raceLaps(),9);assert.equal(f.raceFormat(),'random');
 assert.equal(await f.startClubRound(),true);assert.equal(h.context.activeClubRound,1);assert.equal(h.context.clubCup.results.length,1);assert.equal(h.context.runId,Cup.clubRoundRunId(h.context.clubCup,1));
 h.context.start=async()=>{h.context.menu();return false;};assert.equal(await f.startClubRound(),false);assert.equal(h.context.state,'menu');assert.equal(h.context.activeClubRound,null);assert.equal(h.context.clubCup.phase,'running');assert.match(h.context.clubWarning,/could not start/);assert.ok(h.context.board.start);
});

test('selective cup-save failure still protects old award receipts through ordinary main settlements and reloads',()=>{
 const rows=()=>Array.from({length:11},(_,slot)=>({slot,status:'finished' as const,finishTime:80+slot,health:100,progress:48,damage:0}));
 const stats=new SessionTelemetry().stats;Object.assign(stats,{seconds:80,distance:1200,checkpoints:48});
 const first=Cup.finishClubRound(Cup.beginClubRound(readyCup()),rows(),stats),pending=Cup.finishClubRound(Cup.beginClubRound(first),rows(),stats);
 const profile=readProfile();Cup.replayCupAwards(profile,first);const before=profile.xp.racing,id=Cup.clubRoundRunId(first,0);
 const h=base({clubCup:pending,profile}),f=load(h,['saveClubCup','syncClubAwards','bankRun']);const save=h.context.localStorage.setItem;
 h.context.localStorage.setItem=(key:string,value:string)=>{if(key===Cup.CLUB_CUP_KEY)throw Error('only cup writes unavailable');save(key,value);};
 for(let i=0;i<300;i++){
  h.context.telemetry=new SessionTelemetry();Object.assign(h.context.telemetry.stats,{seconds:4,distance:12});h.context.runId='ordinary-'+i;h.context.runSettled=false;f.bankRun(true);
  h.context.profile=readProfile(h.storage.get(PROFILE_KEY));assert.ok(h.context.profile.settled.includes(id));assert.equal(h.context.profile.settled.includes(Cup.clubRoundRunId(first,1)),false);
 }
 assert.equal(h.context.profile.xp.racing,before+300);assert.equal(h.context.profile.events,301);
 h.context.localStorage.setItem=save;f.syncClubAwards();assert.equal(h.context.profile.events,302);const after=JSON.stringify(h.context.profile);f.syncClubAwards();assert.equal(JSON.stringify(h.context.profile),after);
});
