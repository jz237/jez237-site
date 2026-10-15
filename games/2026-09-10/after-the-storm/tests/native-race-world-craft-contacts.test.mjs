import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createNativeHull} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceWorld,stepNativeRaceWorld,nativeRaceWorldSnapshot} from '../native-race-world.js';
import {nativeCraftContactSnapshot,createNativeCraftContactState} from '../native-craft-contact.js';
import {createRaceWater,captureRaceWater} from '../race-water.js';

const v=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>({...p}),near=(a,b,e=1e-6)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const camera=a=>({x:a.hull.center.x,y:a.hull.center.y,z:a.hull.center.z,sourceForwardXZ:[a.hull.frame.forward.x,a.hull.frame.forward.z]});
function make({initial=[{position:v(-.25)},{position:v(.25)}],humanIndices=[0,1],craftContacts=true,
 physical=false,sourceStates=[],contacts=[],afterTick=null,afterFrame=null}={}){
 const bundles=[],adapters=initial.map((options,i)=>{
  const riderIndex=i%4,initialHull=createNativeHull({...options,rider:riderIndex});
  const bundle=physical?createNativeLifecycleRider({initialHull}):null;bundles.push(bundle);
  return createNativeRaceAdapter({...options,riderIndex,tuneB6c:5,tuneB70:5,tuneB74:5,...bundle,
   ...(physical?{riderRecovery:{courseDatumNative:0}}:{}),sourceState:sourceStates[i]??{},contacts:contacts[i]??{}});
 });
 const water=createRaceWater({crafts:humanIndices.map(i=>camera(adapters[i])),baseAmplitudeNative:20,seed:17,initialNoise:false});
 const world=createNativeRaceWorld({adapters,water,humanIndices,craftContacts,afterTick,afterFrame});
 return {world,water,adapters,bundles};
}

test('global contacts follow ALL preparation, precede each descending hull group, and refresh after each individual fit',()=>{
 const calls=[];let s;
 const sourceStates=[0,1].map(i=>(()=>{calls.push(`prepare:${i}`);return {};}));
 const contacts=[0,1].map(i=>({shore:(h)=>{
  calls.push(`hull:${h.ticks}:${i}`);
  assert.equal(s.world.craftContactPasses,h.ticks+1,'one global call before this descending group');
  assert.equal(nativeCraftContactSnapshot(s.world.craftContactStates[i]).tick,h.ticks,'this hull has not refit yet');
  if(i===0)assert.equal(nativeCraftContactSnapshot(s.world.craftContactStates[1]).tick,h.ticks+1,'the earlier descending hull already refreshed');
  if(h.ticks===0){
   assert.equal(s.world.frameCraftContacts.length,4,'all four matching proxies resolve, using one frozen cache');
   assert.ok(s.world.frameCraftContacts.every(c=>c.incomingNative===0),'reset caches have zero delta despite physical separation response');
   near(h.center.x,i===0?-.25:.25);
   near(h.points.reduce((sum,p)=>sum+p.position.x,0)/12,i===0?-.45:.45);
   assert.equal(s.adapters[i].impacts.racerImpactNative,0);
  }
 }}));
 s=make({sourceStates,contacts,afterTick:(w,c)=>{
  calls.push(`refreshed:${c.tick}`);assert.ok(w.craftContactStates.every(p=>nativeCraftContactSnapshot(p).tick===c.tick));
 },afterFrame:(w,c)=>{calls.push(`water:${c.logicalFrame}`);assert.equal(w.water.frames,c.logicalFrame);}});
 stepNativeRaceWorld(s.world,.05,[{},{}]);
 assert.deepEqual(calls,[...['prepare:1','prepare:0'],...Array.from({length:5},(_,i)=>[`hull:${i}:1`,`hull:${i}:0`,`refreshed:${i+1}`]).flat(),'water:1']);
 assert.equal(s.world.craftContactPasses,5);assert.equal(s.world.water.frames,1);
});

test('craft pairs include all four craft independently of the two human cameras',()=>{
 const s=make({initial:[{position:v(-.25)},{position:v(.25)},{position:v(0,.3)},{position:v(0,-.3)}]});
 stepNativeRaceWorld(s.world,.01,[{},{},{},{}]);
 const events=s.world.frameCraftContacts;
 assert.ok(events.some(e=>e.racerA>=2||e.racerB>=2),'nonhuman craft are physical participants');
 assert.deepEqual([...new Set(events.map(e=>`${e.racerA}:${e.racerB}`))],['0:1','0:2','0:3','1:2','1:3']);
 assert.equal(s.world.craftContactPasses,1);assert.equal(s.water.players,2);
 assert.ok(s.adapters.every(a=>a.hull.ticks===1));
});

test('explicit contact switch suppresses response without losing proxy history; pause/render snapshots cannot consume it',()=>{
 const s=make({craftContacts:false}),w=s.world;
 stepNativeRaceWorld(w,.01,[{},{}]);assert.equal(w.craftContactPasses,0);assert.equal(w.craftContactCount,0);
 assert.ok(w.craftContactStates.every(p=>nativeCraftContactSnapshot(p).tick===1));
 const before=nativeRaceWorldSnapshot(w),water=captureRaceWater(s.water);
 for(let i=0;i<20;i++){nativeRaceWorldSnapshot(w);stepNativeRaceWorld(w,.8,null,{active:false});}
 assert.deepEqual(nativeRaceWorldSnapshot(w),before);assert.deepEqual(captureRaceWater(s.water),water);
 w.craftContacts=true;stepNativeRaceWorld(w,.01,[{},{}]);
 assert.equal(w.craftContactPasses,1);assert.ok(w.craftContactCount>0);
 assert.ok(w.craftContactStates.every(p=>nativeCraftContactSnapshot(p).tick===2));
});

test('actual closing hulls produce C40 and enter/recover through the physical lifecycle without synthetic reports',()=>{
 const s=make({physical:true,initial:[{position:v(-3),velocity:v(30),heading:Math.PI/2},
  {position:v(3),velocity:v(-30),heading:-Math.PI/2}]}),events=[];
 const saved=s.adapters.map(a=>a.hull.points.map(p=>p.damping));let hit=null,previous=[22,22];
 for(let i=0;i<1400;i++){
  stepNativeRaceWorld(s.world,.01,[{},{}]);
  if(s.world.ticks%5)continue;
  for(const [r,a]of s.adapters.entries()){
   if(a.lastFrame.impacts.racerImpactNative>0&&!hit)hit={frame:s.world.frames,maximum:a.lastFrame.impacts.racerImpactNative};
   if(a.lastFrame.actorState!==previous[r])events.push([r,a.lastFrame.actorState]);previous[r]=a.lastFrame.actorState;
   assert.equal(a.articulatedRider.logicalFrames,s.world.frames);assert.equal(s.bundles[r].anchorState.logicalFrames,s.world.frames);
   assert.ok(a.articulatedRider.points.every(p=>Object.values(p.position).every(Number.isFinite)));
  }
 }
 assert.ok(hit&&hit.maximum>10,'closing cached proxies, rather than fabricated contact hooks, generate a severe racer impact');
 for(const [r,a]of s.adapters.entries()){
  assert.deepEqual(events.filter(e=>e[0]===r).map(e=>e[1]),[23,7,22]);
  assert.equal(a.lastFrame.actorState,22);assert.equal(a.riderLifecycle.state.crashDampingLatch,false);
  assert.deepEqual(a.hull.points.map(p=>p.damping),saved[r]);
  assert.equal(a.contactWindow.floorImpactNative,0);assert.equal(a.contactWindow.boxImpactNative,0);
 }
 assert.ok(s.world.craftContactCount>0);
});

test('shared collision, recovery, rider and two-camera water histories are refresh independent',()=>{
 let reference=null;
 for(const hz of [30,60,144]){
  const s=make({physical:true,initial:[{position:v(-3),velocity:v(30),heading:Math.PI/2},
   {position:v(3),velocity:v(-30),heading:-Math.PI/2}]});
  for(let i=0;i<14*hz;i++)stepNativeRaceWorld(s.world,1/hz,[{},{}]);
  const value={world:nativeRaceWorldSnapshot(s.world),racers:s.adapters.map(nativeRaceSnapshot),
   body:s.adapters.map(a=>a.articulatedRider.points),anchors:s.bundles.map(b=>b.anchorState),water:captureRaceWater(s.water)};
  if(reference)assert.deepEqual(value,reference);else reference=structuredClone(value);
 }
});

test('mixed or inactive raw source scenes cannot silently run a different global physics schedule',()=>{
 const mixed=make({sourceStates:[{simulationState:3},{simulationState:1}]});
 assert.throws(()=>stepNativeRaceWorld(mixed.world,.01,[{},{}]),/shared by the whole scene/);
 assert.ok(mixed.adapters.every(a=>a.hull.ticks===0));assert.equal(mixed.world.craftContactPasses,0);
 const inactive=make({sourceStates:[{simulationState:0},{simulationState:0}]});
 assert.throws(()=>stepNativeRaceWorld(inactive.world,.01,[{},{}]),/active:false/);
 assert.ok(inactive.adapters.every(a=>a.hull.ticks===0));assert.equal(inactive.world.craftContactPasses,0);
 assert.equal(inactive.water.frames,0);assert.ok(inactive.world.fault);
});

test('a degenerate pair faults the owner before any additional hull advances',()=>{
 const s=make({initial:[{position:v()},{position:v()}]});
 assert.throws(()=>stepNativeRaceWorld(s.world,.01,[{},{}]),/coincident|zero|degenerate/i);
 assert.equal(s.world.ticks,0);assert.ok(s.adapters.every(a=>a.hull.ticks===0));assert.equal(s.water.frames,0);
 assert.throws(()=>stepNativeRaceWorld(s.world,.01,[{},{}]),/faulted/);
});

test('a later preowned proxy cache cannot poison an earlier valid hull after world construction rejects',()=>{
 const a=createNativeRaceAdapter(),b=createNativeRaceAdapter({position:v(3)});
 const existing=createNativeCraftContactState(b.hull),before=nativeCraftContactSnapshot(existing);
 const water=createRaceWater({crafts:[camera(a)],baseAmplitudeNative:20});
 assert.throws(()=>createNativeRaceWorld({adapters:[a,b],water}),/already has/);
 assert.deepEqual(nativeCraftContactSnapshot(existing),before);
 const accepted=createNativeRaceWorld({adapters:[a],water});
 stepNativeRaceWorld(accepted,.01,[{}]);assert.equal(a.hull.ticks,1);
});

test('invalid source water rejects before any proxy or world ownership is reserved',()=>{
 const a=createNativeRaceAdapter(),water=createRaceWater({crafts:[camera(a)],baseAmplitudeNative:20}),field=water.field;
 water.field={};assert.throws(()=>createNativeRaceWorld({adapters:[a],water}));
 water.field=field;const accepted=createNativeRaceWorld({adapters:[a],water});
 stepNativeRaceWorld(accepted,.01,[{}]);assert.equal(a.hull.ticks,1);
});
