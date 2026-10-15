import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld,nativeRaceWorldSnapshot} from '../native-race-world.js';
import {createRaceWater,advanceRaceWaterFrame,captureRaceWater} from '../race-water.js';
import {createNativeWaterCellSurface} from '../native-water.js';
import {createNativeWaterFollowCamera,stepNativeWaterFollowCamera} from '../native-water-schedule.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';

const v=(x=0,y=0,z=0)=>({x,y,z});
const camera=a=>({x:a.hull.center.x,y:a.hull.center.y,z:a.hull.center.z,
 sourceForwardXZ:[a.hull.frame.forward.x,a.hull.frame.forward.z]});
function make(count=1,{humanIndices=[0],contacts=[],initialNoise=true,afterFrame=null,...options}={}){
 const adapters=Array.from({length:count},(_,i)=>createNativeRaceAdapter({position:v(i*.1,0,i*.2),
  tuneB6c:5,tuneB70:5,tuneB74:5,contacts:contacts[i]??{},...options}));
 const water=createRaceWater({crafts:humanIndices.map(i=>camera(adapters[i])),baseAmplitudeNative:20,seed:17,initialNoise});
 return createNativeRaceWorld({adapters,water,humanIndices,afterFrame});
}
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('all four hulls interleave descending on each tick before one water and object update',()=>{
 const calls=[],contacts=Array.from({length:4},(_,i)=>({primarySpheres:(h)=>calls.push(`${h.ticks}:${i}`)&&undefined}));
 const w=make(4,{contacts,afterFrame:(world,c)=>{calls.push(`water:${world.water.frames}`);calls.push(`objects:${c.logicalFrame}`);
  assert.ok(world.adapters.every(a=>a.hull.ticks===c.logicalFrame*5));assert.equal(c.step,.05);}});
 stepNativeRaceWorld(w,.05,Array.from({length:4},()=>({throttle:true})));
 assert.deepEqual(calls,[...Array.from({length:5},(_,t)=>[3,2,1,0].map(i=>`${t}:${i}`)).flat(),'water:1','objects:1']);
 assert.equal(w.water.frames,1);assert.equal(w.water.field.patchUpdates,1);assert.equal(w.stepsLast,5);
 assert.equal(w.framesLast,1);assert.equal(w.remainder,0);
});

test('ALL preparations precede any hull tick and ALL physical rider solves follow the fifth tick',()=>{
 const calls=[],adapters=[];
 for(let i=0;i<4;i++){
  const bundle=createAuthoredNativeRider({initialHull:createNativeHull()}),provider=bundle.riderPose;
  adapters.push(createNativeRaceAdapter({...bundle,riderPose:(h,c)=>{
   assert.ok(adapters.every(a=>a.hull.ticks===5));calls.push(`rider:${i}`);return provider(h,c);
  },sourceState:()=>{assert.ok(adapters.every(a=>a.hull.ticks===0));calls.push(`prepare:${i}`);return {actorState:22};},
  contacts:{primarySpheres:h=>{calls.push(`tick:${h.ticks}:${i}`);}}}));
 }
 const water=createRaceWater({crafts:[camera(adapters[0])],baseAmplitudeNative:20});
 const w=createNativeRaceWorld({adapters,water,afterFrame:()=>calls.push('water-complete')});
 stepNativeRaceWorld(w,.05,[{},{},{},{}]);
 assert.deepEqual(calls,[...[3,2,1,0].map(i=>`prepare:${i}`),
  ...Array.from({length:5},(_,t)=>[3,2,1,0].map(i=>`tick:${t}:${i}`)).flat(),
  ...[3,2,1,0].map(i=>`rider:${i}`),'water-complete']);
});

test('shared hull and field histories match at30/60/144Hz and fractional frames',()=>{
 const histories=[];
 for(const hz of [30,60,144]){
  const w=make(2,{humanIndices:[0,1]});
  for(let i=0;i<hz;i++)stepNativeRaceWorld(w,1/hz,[()=>({throttle:true,steer:.25}),()=>({throttle:true,steer:-.1})]);
  assert.equal(w.ticks,100);assert.equal(w.frames,20);assert.equal(w.water.field.patchUpdates,40);histories.push(w);
 }
 for(const w of histories.slice(1)){
  assert.deepEqual(w.adapters.map(nativeRaceSnapshot),histories[0].adapters.map(nativeRaceSnapshot));
  assert.deepEqual(captureRaceWater(w.water),captureRaceWater(histories[0].water));
  assert.deepEqual(w.water.field.velocityQ,histories[0].water.field.velocityQ);
  near(w.remainder,histories[0].remainder);
 }
});

test('manual interleaving of the same adapters and raw-cell field is numerically identical',()=>{
 const w=make(2,{humanIndices:[1,0]}),manual=make(2,{humanIndices:[1,0]});
 const surface=createNativeWaterCellSurface(manual.water.field),inputs=[{throttle:true,steer:.4},{throttle:true,steer:-.3}];
 for(let i=0;i<60;i++){
  stepNativeRaceWorld(w,.01,inputs);
  for(let r=1;r>=0;r--)stepNativeRaceAdapter(manual.adapters[r],.01,inputs[r],{surface});
  if((i+1)%5===0)advanceRaceWaterFrame(manual.water,[camera(manual.adapters[1]),camera(manual.adapters[0])]);
 }
 assert.deepEqual(w.adapters.map(nativeRaceSnapshot),manual.adapters.map(nativeRaceSnapshot));
 assert.deepEqual(captureRaceWater(w.water),captureRaceWater(manual.water));
 assert.deepEqual(w.water.field.velocityQ,manual.water.field.velocityQ);
});

test('input and options providers run once per frame, with no render-time resampling',()=>{
 const samples=[],options=[],water=[],w=make();
 const input=(t,f)=>{samples.push([t,f]);return {throttle:true};};
 const adapterOptions=[(t,f,i)=>{options.push([t,f,i]);return {};}];
 const waterOptions=(t,f)=>{water.push([t,f]);return {datumNative:f};};
 stepNativeRaceWorld(w,.021,[input],{adapterOptions,waterOptions});
 stepNativeRaceWorld(w,.029,[{throttle:false}],{adapterOptions:[()=>{throw Error('midframe');}],waterOptions:()=>{throw Error('midframe');}});
 assert.equal(w.adapters[0].lastControls.throttle,true);assert.equal(w.water.field.datumNative,0);
 stepNativeRaceWorld(w,.07,[input],{adapterOptions,waterOptions});
 assert.deepEqual(samples,[[0,0],[.05,1],[.1,2]]);assert.deepEqual(options,[[0,0,0],[.05,1,0],[.1,2,0]]);
 assert.deepEqual(water,[[0,0],[.05,1],[.1,2]]);assert.equal(w.water.field.datumNative,1);
});

test('pause keeps the fractional tick and never consumes input, water phase or elapsed time',()=>{
 const w=make(),input=[{throttle:true}];stepNativeRaceWorld(w,.017,input);
 const before=nativeRaceWorldSnapshot(w),height=captureRaceWater(w.water);
 stepNativeRaceWorld(w,1,null,{active:false});assert.deepEqual(nativeRaceWorldSnapshot(w),before);
 assert.deepEqual(captureRaceWater(w.water),height);assert.equal(w.stepsLast,0);
 stepNativeRaceWorld(w,.003,input);assert.equal(w.ticks,2);near(w.remainder,0);
});

test('native camera consumes pitched body forward without horizontal normalization',()=>{
 const a=createNativeRaceAdapter({pitch:.6,heading:.8}),c=camera(a);
 const water=createRaceWater({crafts:[c],baseAmplitudeNative:20,initialNoise:false});
 const expected=createNativeWaterFollowCamera({positionNative:[c.x/.025,c.y/.025,c.z/.025],forwardXZ:c.sourceForwardXZ});
 assert.deepEqual(water.follows[0],expected);
 near(water.follows[0].lagXZ[0],Math.fround(c.x/.025-Math.fround(c.sourceForwardXZ[0]*100)),1e-5);
 assert.ok(Math.abs(water.follows[0].lagXZ[0]+Math.sin(.8)*100)>10);
 advanceRaceWaterFrame(water,[c]);
 assert.deepEqual(water.follows[0],stepNativeWaterFollowCamera(expected,{positionNative:[c.x/.025,c.y/.025,c.z/.025],
  forwardXZ:c.sourceForwardXZ,velocityXZ:[0,0],datumNative:0}).state);
});

test('P2 and P1 overlapping patches remain separate after the shared tick group',()=>{
 const w=make(2,{humanIndices:[1,0]});stepNativeRaceWorld(w,.05,[{},{}]);
 assert.deepEqual(w.water.lastPlan.patches.map(p=>p.playerIndex),[1,0]);assert.equal(w.water.field.patchUpdates,2);
 near(w.water.previousPositions[0].x,w.adapters[1].hull.center.x/.025);
 near(w.water.previousPositions[1].z,w.adapters[0].hull.center.z/.025);
});

test('water and adapters have one owner and snapshots cannot construct a host',()=>{
 const w=make();
 assert.throws(()=>createNativeRaceWorld({adapters:w.adapters,water:w.water}),/already belongs/);
 const other=createRaceWater({crafts:[camera(w.adapters[0])],baseAmplitudeNative:20});
 assert.throws(()=>createNativeRaceWorld({adapters:w.adapters,water:other}),/already belongs/);
 assert.throws(()=>createNativeRaceWorld({adapters:[createNativeRaceAdapter()],water:captureRaceWater(other)}),/host water/);
 const view=nativeRaceWorldSnapshot(w);view.racers[0].position.x=50;view.cameraCraftPositionsNative[0].x=50;view.humanIndices[0]=3;
 assert.notEqual(w.adapters[0].hull.center.x,50);assert.notEqual(w.water.previousPositions[0].x,50);assert.equal(w.humanIndices[0],0);
});

test('outside water or adapter stepping is rejected before any additional tick',()=>{
 const a=make();advanceRaceWaterFrame(a.water,[camera(a.adapters[0])]);
 assert.throws(()=>stepNativeRaceWorld(a,.01,[{}]),/outside its owner/);assert.equal(a.adapters[0].hull.ticks,0);
 const b=make();stepNativeRaceAdapter(b.adapters[0],.01,{});
 assert.throws(()=>stepNativeRaceWorld(b,.01,[{}]),/exclusive clock/);assert.equal(b.ticks,0);
});

test('bad construction cannot reserve ownership of otherwise valid objects',()=>{
 const a=createNativeRaceAdapter(),water=createRaceWater({crafts:[camera(a)],baseAmplitudeNative:20});
 assert.throws(()=>createNativeRaceWorld({adapters:[a],water,humanIndices:[1]}));
 assert.throws(()=>createNativeRaceWorld({adapters:[a,a],water}));
 assert.ok(createNativeRaceWorld({adapters:[a],water}));
 const b=createNativeRaceAdapter({scale:.05}),other=createRaceWater({crafts:[camera(b)],baseAmplitudeNative:20});
 assert.throws(()=>createNativeRaceWorld({adapters:[b],water:other}),/scale/);
});

test('hook failure faults the owner and prevents silent continuation of a partial group',()=>{
 const w=make(2,{contacts:[{shore:()=>{throw Error('contact fixture');}},{}]});
 assert.throws(()=>stepNativeRaceWorld(w,.01,[{},{}]),/contact fixture/);
 assert.equal(w.adapters[1].hull.ticks,1);assert.equal(w.adapters[0].hull.ticks,0);assert.equal(w.water.frames,0);
 assert.equal(nativeRaceWorldSnapshot(w).faulted,true);
 assert.throws(()=>stepNativeRaceWorld(w,.01,[{},{}]),/faulted/);
});

test('floating-object slot cannot recursively step its owning world',()=>{
 let attempts=0;
 const w=make(1,{afterFrame:world=>{attempts++;assert.throws(()=>stepNativeRaceWorld(world,.01,[{}]),/not reentrant/);}});
 stepNativeRaceWorld(w,.1,[{}]);assert.equal(attempts,2);assert.equal(w.frames,2);assert.equal(w.fault,null);
});

test('world never accepts a render-height replacement for its raw-cell sampler',()=>{
 const w=make();
 assert.throws(()=>stepNativeRaceWorld(w,.01,[{}],{adapterOptions:[{surface:0}]}),/raw-cell/);
 assert.equal(w.adapters[0].hull.ticks,0);assert.equal(w.water.frames,0);
});

test('physical sample callback runs once per hull tick and outer callback can end exactly at a frame boundary',()=>{
 const a=createNativeRaceAdapter(),water=createRaceWater({crafts:[camera(a)],baseAmplitudeNative:20}),ticks=[];
 const w=createNativeRaceWorld({adapters:[a],water,afterTick:(_,c)=>ticks.push([c.tick,c.time,c.step]),
  afterFrame:(_,c)=>c.logicalFrame<2});
 stepNativeRaceWorld(w,.5,[{}]);assert.equal(w.ticks,10);assert.equal(w.frames,2);assert.equal(w.remainder,0);
 assert.equal(ticks.length,10);assert.deepEqual(ticks[9],[10,.1,.01]);
 assert.equal(a.logicalFrames,2);assert.equal(w.water.frames,2);assert.equal(w.fault,null);
 stepNativeRaceWorld(w,0,null);assert.equal(ticks.length,10);
});
