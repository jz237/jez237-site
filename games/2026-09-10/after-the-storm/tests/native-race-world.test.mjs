import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot,prepareNativeRaceAdapterFrame} from '../native-race-adapter.js';
import {createNativeRaceWorld,stepNativeRaceWorld,nativeRaceWorldSnapshot} from '../native-race-world.js';
import {createRaceWater,advanceRaceWaterFrame,advanceRaceWaterRollers,captureRaceWater} from '../race-water.js';
import {createNativeWaterCellSurface} from '../native-water.js';
import {createNativeWaterFollowCamera,stepNativeWaterFollowCamera} from '../native-water-schedule.js';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {applyNativeCraftContacts,refreshNativeCraftContactState} from '../native-craft-contact.js';

const v=(x=0,y=0,z=0)=>({x,y,z});
const camera=a=>({x:a.hull.center.x,y:a.hull.center.y,z:a.hull.center.z,
 sourceForwardXZ:[a.hull.frame.forward.x,a.hull.frame.forward.z]});
function make(count=1,{humanIndices=[0],contacts=[],initialNoise=true,afterFrame=null,deferWaterRollers=false,...options}={}){
 const adapters=Array.from({length:count},(_,i)=>createNativeRaceAdapter({position:v(i*.1,0,i*.2),
  tuneB6c:5,tuneB70:5,tuneB74:5,contacts:contacts[i]??{},...options}));
 const water=createRaceWater({crafts:humanIndices.map(i=>camera(adapters[i])),baseAmplitudeNative:20,seed:17,initialNoise});
 return createNativeRaceWorld({adapters,water,humanIndices,afterFrame,deferWaterRollers});
}
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);

test('course tide runs after every actor and before water once per50ms, independent of rendering',()=>{
 const histories=[];
 for(const hz of [30,60,144]){
  const w=make(),observed=[];
  w.beforeActor=(world,c)=>{assert.equal(world.water.field.datumNative,1-c.logicalFrame);};
  w.beforeWater=(world,c)=>{
   assert.equal(world.adapters[0].logicalFrames,c.logicalFrame);
   assert.equal(world.water.frames,c.logicalFrame-1);
   observed.push(world.water.field.datumNative);
   world.frame.water.datumNative=world.water.field.datumNative-1;
  };
  w.afterFrame=(world,c)=>assert.equal(world.water.field.datumNative,-c.logicalFrame);
  for(let i=0;i<hz;i++)stepNativeRaceWorld(w,1/hz,[{}],{waterOptions:{datumNative:123}});
  assert.deepEqual(observed,Array.from({length:20},(_,i)=>i===0?0:-i));
  assert.equal(w.water.field.datumNative,-20);
  const calls=observed.length;stepNativeRaceWorld(w,1,null,{active:false});assert.equal(observed.length,calls);
  histories.push({hull:nativeRaceSnapshot(w.adapters[0]),water:captureRaceWater(w.water)});
 }
 assert.deepEqual(histories[1],histories[0]);assert.deepEqual(histories[2],histories[0]);
});

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
  const position=v(i*3),bundle=createAuthoredNativeRider({initialHull:createNativeHull({position})}),provider=bundle.riderPose;
  adapters.push(createNativeRaceAdapter({position,...bundle,riderPose:(h,c)=>{
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
  // Source preparation clears impacts before the global contact pass. Then
  // each completed hull refit refreshes its cache before the next pass.
  if(i%5===0)for(let r=1;r>=0;r--)prepareNativeRaceAdapterFrame(manual.adapters[r],inputs[r]);
  applyNativeCraftContacts(manual.adapters.map((a,r)=>({hull:a.hull,contactState:manual.craftContactStates[r],impacts:a.impacts})));
  for(let r=1;r>=0;r--){stepNativeRaceAdapter(manual.adapters[r],.01,inputs[r],{surface});refreshNativeCraftContactState(manual.craftContactStates[r],manual.adapters[r].hull);}
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

test('a deferred roller owner must finish every frame, including a terminal callback',()=>{
 assert.throws(()=>make(1,{deferWaterRollers:true}),/afterFrame owner/);
 assert.throws(()=>make(1,{deferWaterRollers:1,afterFrame:()=>{}}),/afterFrame owner/);
 for(const result of [undefined,false]){
  const w=make(1,{deferWaterRollers:true,afterFrame:()=>result});
  assert.throws(()=>stepNativeRaceWorld(w,.1,[{}]),/complete its course roller stage/);
  assert.equal(w.frames,1);assert.equal(w.water.rollerFrames,0);assert.ok(w.fault);
  assert.throws(()=>stepNativeRaceWorld(w,.05,[{}]),/faulted/);
 }
 const w=make(1,{deferWaterRollers:true,afterFrame:(world,context)=>{
  assert.equal(world.water.rollerFrames,context.logicalFrame-1);
  advanceRaceWaterRollers(world.water,{active:false});return context.logicalFrame<3;
 }});
 stepNativeRaceWorld(w,.2,[{}],{waterOptions:{deferRollers:false}});
 assert.equal(w.frames,3);assert.equal(w.water.rollerFrames,3);assert.equal(w.remainder,0);assert.equal(w.fault,null);
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


test('simulation0 runs outer updates while retaining hull motion, water evolution and rider pose history',()=>{
 let scene=3;const calls=[],adapters=[];
 for(let i=0;i<2;i++){
  const position=v(i*3),bundle=createAuthoredNativeRider({initialHull:createNativeHull({position})});
  adapters.push(createNativeRaceAdapter({position,...bundle,sourceState:()=>({actorState:22,simulationState:scene})}));
 }
 const water=createRaceWater({crafts:adapters.map(camera),baseAmplitudeNative:20,seed:17});
 const w=createNativeRaceWorld({adapters,water,humanIndices:[0,1],beforeFrame:(_,c)=>calls.push(['before',c.logicalFrame]),
  beforeActor:(_,c)=>calls.push(['summary',c.racerIndex]),afterTick:()=>calls.push(['tick']),afterFrame:(_,c)=>calls.push(['after',c.time])});
 stepNativeRaceWorld(w,.1,[{throttle:true},{throttle:true}]);
 const hulls=adapters.map(a=>structuredClone(a.hull)),poses=adapters.map(a=>structuredClone(a.articulatedRider)),histories=adapters.map(a=>nativeRaceSnapshot(a).source),
  field=structuredClone(water.field),passes=w.craftContactPasses;
 scene=0;calls.length=0;
 const inputTimes=[];const inputs=adapters.map((_,i)=>(t,f)=>{inputTimes.push([i,t,f]);return {throttle:false};});
 stepNativeRaceWorld(w,.15,inputs);
 assert.equal(w.ticks,10);assert.equal(w.clockTicks,25);assert.equal(w.frames,5);assert.equal(w.stepsLast,0);assert.equal(w.framesLast,3);
 assert.equal(w.craftContactPasses,passes);assert.deepEqual(adapters.map(a=>a.hull),hulls);
 assert.deepEqual(adapters.map(a=>a.articulatedRider),poses);assert.deepEqual(water.field,field);
 for(const [i,a]of adapters.entries())for(const k of ['frameDisplacementNative','frameSpeedNative','hudSpeed','referenceDisplacementNative','referenceChangeNative'])assert.deepEqual(a.lastFrame[k],histories[i][k]);
 assert.deepEqual(inputTimes.map(x=>[x[0],x[2]]),[[1,2],[0,2],[1,3],[0,3],[1,4],[0,4]]);
 inputTimes.forEach((x,i)=>near(x[1],[.1,.1,.15,.15,.2,.2][i]));
 assert.equal(water.frames,5);assert.equal(water.lastPlan.forcing.length,0);assert.deepEqual(water.lastPlan.patches.map(p=>[p.playerIndex,p.evolve]),[[1,false],[0,false]]);
 assert.equal(calls.filter(c=>c[0]==='tick').length,0);assert.deepEqual(calls.filter(c=>c[0]==='summary').map(c=>c[1]),[1,0,1,0,1,0]);
 const paused=nativeRaceWorldSnapshot(w);stepNativeRaceWorld(w,.8,inputs,{active:false});assert.deepEqual(nativeRaceWorldSnapshot(w),paused);
 scene=3;stepNativeRaceWorld(w,.05,[{throttle:true},{throttle:true}]);assert.equal(w.ticks,15);assert.equal(w.clockTicks,30);assert.equal(w.frames,6);assert.ok(water.field.patchUpdates>field.patchUpdates);
});

test('mixed active/inactive native frames agree at30/60/144Hz without phantom hull ticks',()=>{
 const results=[];
 for(const hz of [30,60,144]){
  const w=make(2,{humanIndices:[0,1],sourceState:(_,c)=>({actorState:22,simulationState:c.logicalFrame>=3&&c.logicalFrame<11?0:3})});
  for(let i=0;i<hz;i++)stepNativeRaceWorld(w,1/hz,[{throttle:true},{throttle:true}]);
  assert.equal(w.frames,20);assert.equal(w.ticks,60);assert.equal(w.clockTicks,100);assert.equal(w.water.field.patchUpdates,24);
  results.push(w);
 }
 for(const w of results.slice(1)){assert.deepEqual(w.adapters.map(nativeRaceSnapshot),results[0].adapters.map(nativeRaceSnapshot));assert.deepEqual(captureRaceWater(w.water),captureRaceWater(results[0].water));}
});
