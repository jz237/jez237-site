import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace} from '../race-core.js';
import {getCourse,conditions} from '../courses.js';
import {nativeRaceScene} from '../native-race-scene.js';
import {createNativeRaceCourseRuntime} from '../native-race-course-runtime.js';
import {prepareNativeChampionshipLaunch,prepareNativeChampionshipWebLaunch} from '../native-championship-setup.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {createNativeRaceHost,stepNativeRaceHost} from '../native-race-host.js';
import {createRaceWater} from '../race-water.js';

function setup({primaryHumanIndex=0,difficulty=0,selectedRider=0}={}){
 const avatarsBySlot=[selectedRider,...[0,1,2,3].filter(i=>i!==selectedRider)];
 const c={courseIndex:1,difficulty,primaryHumanIndex,avatarsBySlot},source=nativeRaceScene(getCourse('greyhaven',difficulty));
 const courseRuntime=createNativeRaceCourseRuntime({course:source,difficulty,players:1,raceMode:'championship'});
 const racers=createRace({mode:'championship',rider:selectedRider,course:getCourse('greyhaven',difficulty),difficulty}).racers;
 let prepared=prepareNativeChampionshipWebLaunch({racers,courseRuntime});
 if(primaryHumanIndex!==0){
  // Unsupported live mapping remains an explicit prepared diagnostic for the
  // rejection check. Actual physical runs use the fresh application selector.
  const state=structuredClone(prepared.state);state.scene.primaryHumanIndex=primaryHumanIndex;
  prepared=prepareNativeChampionshipLaunch(state,{courseRuntime,avatarsBySlot:c.avatarsBySlot});
 }
 const scale=courseRuntime.courseView.sourceMetadata?.nativeScale??.025;
 for(let i=0;i<4;i++){
  const r=racers[i],start=prepared.hullStarts[i].prepared;
  r.id=avatarsBySlot[i];r.human=i===primaryHumanIndex;r.player=r.human?0:null;
  r.x=start.centerNative.x*scale;r.z=start.centerNative.z*scale;r.hydro.y=start.centerNative.y*scale;
  r.heading=Math.atan2(start.frameNative.forward.x,start.frameNative.forward.z);
  r.sourceForwardXZ=[start.frameNative.forward.x,start.frameNative.forward.z];
 }
 const args={racers,courseIndex:1,players:1,courseRuntime,championshipLaunch:prepared};
 return {courseRuntime,prepared,racers,args,scale};
}
function physical(options){
 const q=setup(options),course=q.courseRuntime.courseView,runtime=createNativeRaceLaunchRuntime(q.args);
 const water=createRaceWater({crafts:q.racers.filter(r=>r.human),scale:q.scale,initialNoise:false,
  baseAmplitudeNative:q.prepared.state.scene.wave49b0,datumNative:Math.round(conditions(course,0).seaLevel/q.scale),
  primaryPointsNative:course.sourceRouteRowsByClass[options?.difficulty??0].map(row=>row.slice(0,2)),
  rollerRows:course.rollersForPlayers?.(1,{difficulty:options?.difficulty??0,mode:'race'}).map(row=>row.nativeRow)??[]});
 runtime.initializeWater(water.field,water.baseAmplitudeNative);
 const host=createNativeRaceHost({racers:q.racers,water,course,raceRuntime:runtime,staticGeometry:q.courseRuntime.staticContactGeometry});
 return {...q,host,runtime,water};
}

test('four-rider runtime requires the actual prepared course handoff and exact human/avatar mapping',()=>{
 const q=setup(),before=structuredClone(q.prepared.state);
 assert.throws(()=>createNativeRaceLaunchRuntime({...q.args,championshipLaunch:structuredClone(q.prepared)}),/remains prepared/);
 assert.throws(()=>createNativeRaceLaunchRuntime({...q.args,courseRuntime:{...q.courseRuntime}}),/remains prepared/);
 for(const patch of [{initialState:q.prepared.state},{recordSession:{}},{tunes:[{}]},{tuneModes:['custom']}])
  assert.throws(()=>createNativeRaceLaunchRuntime({...q.args,...patch}),/owns the selected/);
 for(const patch of [{players:2},{courseIndex:2},{racers:q.racers.slice(0,3)},
  {racers:q.racers.map((r,i)=>({...r,id:i===0?1:r.id}))},{racers:q.racers.map(r=>({...r,human:true}))}])
  assert.throws(()=>createNativeRaceLaunchRuntime({...q.args,...patch}),/participants must match/);
 assert.deepEqual(q.prepared.state,before);
 assert.throws(()=>createNativeRaceLaunchRuntime(setup({primaryHumanIndex:1}).args),/primary human in slot0/);
});

test('prepared physical championship consumes all grid/profile outputs and starts three computers without device polls',()=>{
 for(let selectedRider=0;selectedRider<4;selectedRider++){
  const q=physical({selectedRider}),h=q.host;let polls=0;
  assert.equal(h.world.adapters.length,4);assert.equal(h.world.water.players,1);
  for(let i=0;i<4;i++){
   const a=h.world.adapters[i],p=q.prepared.bodyProfiles[i];
   assert.equal(a.computerProfile,i!==0);assert.equal(a.controlOrigin,i===0?'human':'ai');
   for(const key of ['tuneB6c','tuneB70','tuneB74'])assert.equal(a.water.profile[key],p[key]);
   assert.deepEqual(a.hull.center,Object.fromEntries(Object.entries(q.prepared.hullStarts[i].prepared.centerNative).map(([k,v])=>[k,v*q.scale])));
  }
  const input=q.racers.map(r=>r.human?()=>{polls++;return {};}:()=>{throw new Error('Computer polled browser AI/device');});
  stepNativeRaceHost(h,.05,input);assert.equal(polls,1);assert.equal(h.lastAIInput.frame.phase,'start');
  assert.deepEqual(h.aiBodies,Array.from({length:4},()=>({heldButtons:0,powerFactor:1,action16f4:0})));
  assert.deepEqual(h.world.adapters.map(a=>a.lastControls.controlOrigin),q.racers.map(r=>r.human?'human':'ai'));
  assert.equal(h.world.frames,1);assert.equal(h.world.ticks,5);
  stepNativeRaceHost(h,.05,input);assert.equal(polls,2);
  assert.ok(h.aiBodies.every(b=>Object.values(b.positionNative).every(Number.isFinite)));
  assert.deepEqual(q.prepared.pendingEffects.filter(o=>o.kind==='externalCall').map(o=>o.consumer),['80096960','8009684c','800c21f4']);
 }
});

test('four-rider startup and actual driving retain identical physical/canonical histories at30/60/144Hz',()=>{
 let expected;
 for(const hz of [30,60,144]){
  const q=physical(),h=q.host,start=h.world.adapters.map(a=>structuredClone(a.hull.center));let polls=0;
  const input=q.racers.map(r=>r.human?()=>{polls++;return {throttle:1};}:()=>{throw new Error('Computer device poll');});
  for(let i=0;i<hz*12;i++)stepNativeRaceHost(h,1/hz,input);
  assert.equal(h.world.frames,240);assert.equal(polls,240);
  assert.equal(q.runtime.scene().phase650,3);assert.equal(h.lastAIInput.frame.phase,'driving');
  for(let i=1;i<4;i++){
   const a=h.world.adapters[i];assert.equal(a.lastControls.controlOrigin,'ai');assert.notDeepEqual(a.hull.center,start[i]);
   assert.ok(a.hull.points.every(p=>Object.values(p.position).every(Number.isFinite)));
   assert.ok(a.articulatedRider.points.every(p=>Object.values(p.position).every(Number.isFinite)));
   assert.deepEqual(h.spray.levels()[i],{left:0,right:0},'CPU spray does not write human audio levels');
  }
  assert.equal(q.runtime.snapshot().scene.previousNavigationD9874,q.runtime.aiRecords()[1].navigationSourceRow);
  const value={canonical:q.runtime.snapshot(),hulls:h.world.adapters.map(a=>a.hull.points),
   riders:h.world.adapters.map(a=>a.articulatedRider.points),controls:h.world.adapters.map(a=>a.lastControls),
   spray:h.spray.snapshot(),height:q.water.field.heightQ,velocity:q.water.field.velocityQ};
  if(expected)assert.deepEqual(value,expected);else expected=structuredClone(value);
  stepNativeRaceHost(h,.5,input,{active:false});assert.equal(polls,240);
  assert.deepEqual(q.runtime.snapshot(),value.canonical);assert.equal(h.world.frames,240);
 }
});
