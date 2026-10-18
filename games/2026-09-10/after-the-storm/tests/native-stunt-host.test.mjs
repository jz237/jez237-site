import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stuntHostFixture} from './helpers/native-stunt-host-fixture.mjs';
import {stuntLaunchFixture} from './helpers/native-stunt-launch-fixture.mjs';
import {nativeRaceBodyFields} from '../native-race-body-fields.js';
import {captureRaceWater} from '../race-water.js';
import {nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
const ri=a=>(a-0x1f94)/4;
const bits=n=>{const d=new DataView(new ArrayBuffer(4));d.setFloat32(0,n);return d.getUint32(0);};

test('all nine Stunt hosts use the complete source objects and real rider, camera, water and input schedule',()=>{
 for(const courseIndex of [0,1,2,3,4,5,6,7,8]){
  const f=stuntHostFixture(courseIndex),{host,runtime,water,racers}=f,a=host.world.adapters[0];
  assert.equal(runtime.stunt,true);assert.equal(runtime.ordinary,false);assert.equal(host.sourceSchedule,true);
  assert.equal(host.contacts.boxes,host.objects.boxContact);assert.equal(host.contacts.fixedSpheres,host.objects.fixedContact);
  assert.ok(a.riderActions);assert.ok(a.riderLanding);assert.ok(host.spray);
  for(let i=0;i<60;i++)f.step(.05,{throttle:i>=56?1:0});
  assert.equal(host.world.frames,60);assert.equal(host.world.ticks,300);assert.equal(water.frames,60);assert.equal(water.rollerFrames,60);
  assert.equal(a.articulatedRider.logicalFrames,60);assert.equal(runtime.inputClock(),60);
  assert.equal(runtime.scene().simulationState,3);assert.ok(runtime.scene().phase650>=2);
  assert.equal(racers[0].power,5);assert.ok(racers[0].nativeCamera);assert.ok(host.lastStunt);assert.equal(host.lastOrdinary,null);
  assert.equal(host.objects.diagnostics().outerFrames,60);assert.ok(host.lastStuntRings);assert.ok(host.lastStuntDisplay);
  const physical=nativeRaceBodyFields(a);assert.ok(Number.isInteger(physical.stuntMove1604));assert.ok(Number.isFinite(physical.stuntArc15ecNative));
 }
});

test('Stunt judging and ring collection precede object motion; display awards precede status once per physical frame',()=>{
 const calls=[],methods=['advanceSourceFrameCounter','advanceMenuInput','advanceNavigation','resultCodeFor','waterDatumAfterPhysics',
  'advanceDisplayClock','advanceStunt','advanceStuntRings','advanceHUD','advanceStuntDisplay','advanceCameraInput','advanceStatus','advanceInputClock'];
 const f=stuntHostFixture(1,{runtimeWrapper:r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k,methods.includes(k)?(...args)=>{calls.push(k);return v(...args);}:v]))});
 f.host.onFrame=()=>{
  assert.equal(f.host.objects.diagnostics().outerFrames,0);assert.equal(f.water.frames,1);
  assert.equal(calls.at(-1),'advanceStuntRings');calls.push('pre-object-observer');
 };
 f.step(.01);assert.deepEqual(calls,['advanceSourceFrameCounter','advanceMenuInput','advanceNavigation']);f.step(.04);
 assert.deepEqual(calls,['advanceSourceFrameCounter','advanceMenuInput','advanceNavigation','resultCodeFor','waterDatumAfterPhysics',
  'advanceDisplayClock','advanceStunt','advanceStuntRings','pre-object-observer','advanceHUD','advanceStuntDisplay','advanceCameraInput','advanceStatus','advanceInputClock']);
 assert.equal(f.host.objects.diagnostics().outerFrames,1);
 const before=f.runtime.snapshot(),water=captureRaceWater(f.water);
 for(let i=0;i<20;i++){f.runtime.stuntView();f.host.objects.snapshot();}
 assert.deepEqual(f.runtime.snapshot(),before);assert.deepEqual(captureRaceWater(f.water),water);
});

test('Stunt result selection uses source record ranking and the current canonical box count and rows',()=>{
 for(const [place,code]of [[0,3],[1,1],[2,2],[3,2]]){
  const f=stuntLaunchFixture(1,{running:true,patch:s=>{s.raceWords1f94[ri(0x2c2c)]=1;s.raceWords1f94[ri(0x2928)]=place;}});
  assert.deepEqual(f.runtime.resultCodeFor(0,{bodyResultCodes16c8:[-1]}).operations,[{kind:'bodyResultCodeWrite',racerIndex:0,value:code}]);
 }
 // Prepared retained plane far outside the actual Sunny floor. Its near face
 // is10 native units below point0; the probe lies five units inside the box.
 for(const [count,y,code]of [[1,5,4],[1,-200,5],[0,5,5]]){
  const f=stuntLaunchFixture(1,{running:true,patch:s=>{
   s.raceWords1f94[ri(0x2c24)]=2;s.scene.collisionPlaneCount0578=count;
   s.collisionPlaneWordsFd78.splice(0,16,...[50000,y,50000,1,0,0,0,1,0,0,0,1,40,60,80,0].map(bits));
  }}),before=f.runtime.snapshot();
  const result=f.runtime.resultCodeFor(0,{bodyResultCodes16c8:[-1],point90Native:{x:49980,y:10,z:49980},datum2458:0});
  assert.equal(result.operations.at(-1).value,code);assert.deepEqual(f.runtime.snapshot(),before);
  assert.equal(result.operations[1].consumer,'8007fae4');assert.equal(result.operations[1].returnValue,code===4?5:0);
 }
 for(const courseIndex of [0,3,4,5,6]){
  const f=stuntLaunchFixture(courseIndex,{running:true,patch:s=>s.raceWords1f94[ri(0x2c24)]=2});
  const result=f.runtime.resultCodeFor(0,{bodyResultCodes16c8:[-1],point90Native:{x:50000,y:10,z:50000},datum2458:0});
  assert.equal(result.operations.at(-1).value,5,'remaining solo courses now select their original floor and live boxes');
 }
});

test('actual physical ring collection queues one award and transfers it after23 source display calls',()=>{
 let ringRow;
 const f=stuntHostFixture(1,{patch:s=>Object.assign(s.scene,{phase650:3,simulation648:3,clockStopped817c:0}),startPose:(s,scale)=>{
  const a=s.objectWordsC940,d=new DataView(new ArrayBuffer(4)),read=i=>{d.setUint32(0,a[i]);return d.getFloat32(0);};
  ringRow=Array.from({length:s.scene.objectCountFa40},(_,i)=>i).find(i=>a[i*49+19]===8&&a[i*49+48]===0);
  return {position:{x:read(ringRow*49)*scale,y:(read(ringRow*49+1)-8)*scale,z:read(ringRow*49+2)*scale},heading:0};
 }});
 f.step();assert.deepEqual(f.host.lastStuntRings.diagnostic.collectedRows,[ringRow]);
 assert.equal(f.runtime.stuntView().rings,1);assert.equal(f.runtime.stuntView().awards.totals.total,0);
 assert.equal(f.host.objects.snapshot()[ringRow].collected,true);
 assert.ok(f.host.lastStuntRings.effects.some(e=>e.consumer==='800c3628'));
 for(let i=1;i<22;i++)f.step();assert.equal(f.runtime.stuntView().awards.totals.total,0);
 f.step();assert.equal(f.runtime.stuntView().awards.totals.ring,50);assert.equal(f.runtime.stuntView().rings,1);
 assert.deepEqual(f.host.lastStuntDisplay.transfers.map(t=>[t.kind,t.points]),[['ring',50]]);
});

test('Stunt physics, source scoring and water are identical at30,60 and144 render calls per second',()=>{
 let reference;
 for(const fps of [30,60,144]){
  const f=stuntHostFixture(2);
  for(let i=0;i<fps*8;i++)f.step(1/fps,(time,frame)=>({throttle:frame>=56?1:0,steer:frame>90?.2:0,lean:frame>105?.3:0}));
  assert.equal(f.host.world.frames,160);
  const snapshot={race:f.runtime.snapshot(),body:nativeRaceSnapshot(f.host.world.adapters[0]),water:captureRaceWater(f.water)};
  if(reference)assert.deepEqual(snapshot,reference);else reference=snapshot;
 }
});

test('expired Stunt time selects the physical retirement actor and source results without running the ordinary judge',()=>{
 const f=stuntHostFixture(1,{patch:s=>{
  Object.assign(s.scene,{phase650:3,simulation648:3,clockStopped817c:0});
  s.raceWords1f94[ri(0x2938)]=1;s.raceWords1f94[ri(0x2bfc)]=50;
 }});
 f.step();assert.equal(f.runtime.stuntView().remainingMs,0);assert.equal(f.runtime.stuntView().disqualification,2);
 assert.equal(f.runtime.resultView().gameState,41);f.step();
 assert.ok(f.host.world.adapters[0].riderLifecycle.state.selectedActor>=0);assert.equal(f.host.lastOrdinary,null);
 for(let i=0;i<140&&!f.runtime.resultView().exit;i++)f.step();
 assert.ok(f.runtime.resultView().exit,'source Stunt retirement returns to its course menu');
});

test('141 support probes match complete original5DD04 calls using current source planes after physical motion',()=>{
 const reference=JSON.parse(fs.readFileSync(new URL('./fixtures/native-stunt-host-support-reference.json',import.meta.url)));
 let matched=0;
 for(const courseIndex of [1,2,7,8]){
  const f=stuntHostFixture(courseIndex);
  for(const frame of [0,1,60]){
   while(f.host.world.frames<frame)f.step();
   const state=f.runtime.snapshot();state.scene.simulation648=3;state.raceWords1f94[ri(0x2c24)]=2;state.raceWords1f94[ri(0x2c2c)]=0;
   const r=createNativeRaceLaunchRuntime({courseRuntime:f.courseRuntime,courseIndex,players:1,racers:[{id:0}],initialState:state});
   for(const c of reference.checks.filter(c=>c.courseIndex===courseIndex&&c.frame===frame)){
    assert.deepEqual(r.resultCodeFor(0,{bodyResultCodes16c8:[-1],point90Native:c.point,datum2458:c.datum}).operations,c.operations,`${courseIndex}/${frame}/${c.plane}`);matched++;
   }
  }
 }
 assert.equal(matched,141);
});

test('inactive Stunt physics keeps source clocks but gates object motion and award advancement by activity',()=>{
 for(const activity624 of [-1,0]){
  const f=stuntHostFixture(1,{patch:s=>Object.assign(s.scene,{simulation648:0,phase650:3,activity624})});
  for(let i=0;i<5;i++)f.step();
  assert.equal(f.host.world.frames,5);assert.equal(f.host.world.ticks,0);assert.equal(f.runtime.inputClock(),5);
  assert.equal(f.host.objects.diagnostics().outerFrames,5);assert.equal(f.host.objects.diagnostics().motionUpdates,activity624===-1?5:0);
  assert.equal(f.host.lastStunt.applied,activity624===-1);assert.equal(f.host.lastStuntDisplay.applied,activity624===-1);
  assert.equal(f.water.rollerFrames,5);assert.deepEqual(f.host.world.adapters[0].lastResultCodeOperations,[]);
 }
});
