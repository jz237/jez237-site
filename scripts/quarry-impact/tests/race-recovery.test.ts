import {courseRecoveryArea} from '../src/race-course';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import {RaceRecovery,freeRecoverySlot} from '../src/race-recovery';
import {DEFINITIONS} from '../src/rules';
const car=()=>({kind:'coupe' as const,current:{x:0,z:50},speed:0,health:64,finished:false,passed:5,nextCheckpoint:1});
const route=[{x:0,z:0},{x:0,z:30},{x:30,z:30}];
const course={halfWidth:12,distance:(x:number,_z:number)=>Math.abs(x),height:()=>0};
const wait=(r:RaceRecovery,c:ReturnType<typeof car>,seconds=30,attempts=4)=>{let ready=false;for(let i=0;i<seconds*60;i++)ready=r.ready(c,1/60,attempts)||ready;return ready;};
test('recovery waits for prolonged lack of progress and failed escapes',()=>{
 const r=new RaceRecovery(),c=car();assert.equal(wait(r,c,29),false);assert.equal(wait(r,c,2,3),false);assert.equal(r.ready(c,1/60,4),true);assert.equal(r.ready(c,1/60,4),false);
});
test('gate progress, replaced vehicles and explicit recovery restart the delay',()=>{
 const r=new RaceRecovery(),c=car();wait(r,c,29);c.passed++;c.nextCheckpoint++;assert.equal(wait(r,c,29),false);assert.equal(wait(r,car(),1),false);r.clear(c);assert.equal(wait(r,c,29),false);
});
test('finishers, wrecks and moving cars never trigger a recovery',()=>{
 for(const patch of [{finished:true},{health:0},{speed:4},{speed:-4},{speed:NaN}]){const r=new RaceRecovery(),c={...car(),...patch};assert.equal(wait(r,c,40),false);}
});
test('bad time input cannot accumulate a recovery deadline',()=>{
 const r=new RaceRecovery(),c=car();for(const dt of [NaN,Infinity,-50,0])assert.equal(r.ready(c,dt,8),false);assert.equal(r.ready(c,500,8),false);assert.equal(wait(r,c,29),false);
});
test('safe placement follows gate order in both directions and does not mutate progress',()=>{
 const c=car(),before=structuredClone(c);for(const points of [route,[route[0],route[2],route[1]]]){const at=freeRecoverySlot(c,[c],points,course,()=>false)!;assert.deepEqual(at,{x:0,z:0,yaw:Math.atan2(points[1].x,points[1].z)});}assert.deepEqual(c,before);
});
test('occupied slots include wrecks and finishers; a clear slot stays behind the gate',()=>{
 const c=car(),wreck={...car(),health:0,finished:true,current:{x:0,z:0}};
 const at=freeRecoverySlot(c,[c,wreck],route,course,()=>false)!;assert.ok(at.z<0);assert.ok(Math.hypot(at.x,at.z)>6);
});
test('solid obstacles, narrow shoulders, invalid gates and full grids wait instead of overlapping',()=>{
 const c=car();assert.equal(freeRecoverySlot(c,[c],route,course,()=>true),undefined);assert.equal(freeRecoverySlot(c,[c],route,{...course,halfWidth:1},()=>false),undefined);
 for(const next of [-1,3,NaN,1.5])assert.equal(freeRecoverySlot({...c,nextCheckpoint:next},[c],route,course,()=>false),undefined);
 const occupied=[0,7,14].flatMap(back=>[0,-4,4].map(lane=>({...car(),current:{x:lane,z:-back}})));
 assert.equal(freeRecoverySlot(c,[c,...occupied],route,course,()=>false),undefined);
});

// Execute the actual main-loop AI handler. Preserve damage, progress and replay
// semantics through its normal Vehicle.place entry point rather than a clone.
const main=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8');
const ast=ts.createSourceFile('main.ts',main,ts.ScriptTarget.ES2022,true);
const ai=ast.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text==='ai')!;
const executable=ts.transpileModule(ai.getText(ast),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
function mainHarness(){
 const r=new RaceRecovery(),c:any={...car(),id:0,forward:{x:0,z:1},offTrackTime:0,rollTime:0,penalty:2,checkpointDistance:3,body:{},engineDamage:.6,engineStall:2,scars:7};
 const calls:any[]=[],memory=new Map([[0,{attempts:8}]]);
 c.place=(...args:any[])=>{calls.push(args);c.current={x:args[0],z:args[1]};};
 const context:any={RaceRecovery,freeRecoverySlot,courseRecoveryArea,DEFINITIONS,raceRecovery:r,mode:'race',waypointRace:null,cars:[c],activeVenue:{course},raceRoute:()=>route,drivers:{memory,update:()=>({throttle:.4})},R:{Cuboid:class{}},physics:{intersectionWithShape:()=>null}};
 runInNewContext(executable,context);return{c,r,calls,context,step(){return context.ai(c,1/60);}};
}
test('actual AI handler adds one penalty, clears escape state, and retains damage and checkpoint counts',()=>{
 const h=mainHarness();for(let i=0;i<1900;i++)h.step();assert.equal(h.calls.length,1);assert.equal(h.calls[0].length,3,'Never requests repair');assert.equal(h.c.penalty,7);assert.equal(h.c.passed,5);assert.equal(h.c.nextCheckpoint,1);assert.equal(h.c.checkpointDistance,Infinity);assert.equal(h.c.health,64);assert.equal(h.c.engineDamage,.6);assert.equal(h.c.engineStall,2);assert.equal(h.c.scars,7);assert.equal(h.context.drivers.memory.size,0);
});
test('actual AI handler waits when physics blocks every candidate',()=>{
 const h=mainHarness();let queries=0;h.context.physics.intersectionWithShape=()=>{queries++;return {};};for(let i=0;i<2100;i++)h.step();assert.equal(h.calls.length,0);assert.ok(queries>0&&queries<70,'Blocked placement retries are bounded');assert.equal(h.c.penalty,2);
});
test('legacy waypoint races use delayed recovery while derby events retain their separate recovery behavior',()=>{
 for(const mode of ['race','derby']){const h=mainHarness();h.context.mode=mode;if(mode==='race')h.context.waypointRace={navigation:()=>({next:1})};for(let i=0;i<2100;i++)h.step();assert.equal(h.calls.length,mode==='race'?1:0);}
});

test('rollover and off-track AI recoveries choose free space and never stack on another entrant',()=>{
 for(const reason of ['roll','offTrack']){
  const h=mainHarness(),parked={...car(),id:1,current:{x:0,z:0},health:0,finished:true};h.context.cars.push(parked);
  if(reason==='roll')h.c.rollTime=5;else{h.c.current={x:30,z:50};h.c.offTrackTime=8;}
  h.step();assert.equal(h.calls.length,1);const [x,z]=h.calls[0];assert.ok(Math.hypot(x,z)>6);assert.ok(z<=0);assert.equal(h.c.penalty,7);assert.equal(h.c.passed,5);assert.equal(h.c.health,64);assert.equal(h.c.scars,7);assert.equal(h.c.checkpointDistance,Infinity);
 }
});
test('blocked rollover recovery waits without moving, repairing, penalizing or erasing progress',()=>{
 const h=mainHarness();h.c.rollTime=5;h.context.physics.intersectionWithShape=()=>({});h.step();assert.equal(h.calls.length,0);assert.equal(h.c.penalty,2);assert.equal(h.c.passed,5);assert.equal(h.c.scars,7);assert.equal(h.c.health,64);assert.equal(h.context.drivers.memory.size,1);
 h.context.physics.intersectionWithShape=()=>null;h.step();assert.equal(h.calls.length,1);assert.equal(h.c.penalty,7);
});

test('open waypoint bots recover from prolonged tangles in the infield even when they have not completed four reverse attempts',()=>{
 const h=mainHarness();h.context.activeVenue.course={...course,distance:()=>80,outside:()=>false,waypointStations:route};h.context.waypointRace={navigation:()=>({next:1})};h.context.drivers.memory.set(0,{attempts:0});
 for(let i=0;i<1700;i++)h.step();assert.equal(h.calls.length,0,'open terrain is not treated as off-track');
 for(let i=0;i<200;i++)h.step();assert.equal(h.calls.length,1);assert.equal(h.c.penalty,7);assert.equal(h.c.passed,5);assert.equal(h.c.health,64);assert.equal(h.c.scars,7);
});
