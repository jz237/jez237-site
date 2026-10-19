import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHull} from '../native-hull.js';
import {createAuthoredNativeRider} from '../authored-native-rider.js';
import {createNativeRaceAdapter,prepareNativeRaceAdapterFrame,completeNativeRaceAdapterInactiveFrame,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {prepareNativePhysicalBodyWrap as prepare,captureNativePhysicalBoundaryDrift as capture} from '../native-physical-body-wrap.js';
import {nativeWaterWrapBounds} from '../native-water-scene-initialization.js';
import {prepareNativeBodyTranslation} from '../native-body-translation.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {stepNativeRaceHost} from '../native-race-host.js';
import {captureNativeEffectBody} from '../native-effect-body-view.js';
const F=Math.fround,axes=['x','y','z'],bits=new DataView(new ArrayBuffer(4));
const word=v=>{bits.setFloat32(0,v);return bits.getUint32(0);};
const number=w=>{bits.setUint32(0,w);return bits.getFloat32(0);};
function make(x,z=0){
 const position={x,y:.123456789,z},bundle=createAuthoredNativeRider({initialHull:createNativeHull({position})});
 const adapter=createNativeRaceAdapter({position,...bundle,sourceState:{actorState:22,simulationState:0}});
 prepareNativeRaceAdapterFrame(adapter,{});return {adapter,bundle};
}
function plan(a,b,previousCameraPositionNative){return prepare(a,{anchorState:b.anchorState,boundsWords24ac:nativeWaterWrapBounds(),previousCameraPositionNative});}

test('physical crossing matches source translation for all retained position owners and preserves dynamics',()=>{
 for(const [x,z]of [[-700,0],[700,0],[0,-800],[0,800],[-700,800],[700,-800]]){
  const {adapter:a,bundle:b}=make(x,z),before=structuredClone({hull:a.hull,rider:a.articulatedRider,anchors:b.anchorState,frame:{...a.frame,riderPose:null},last:a.lastFrame});
  const previous={x:x/a.hull.scale,y:17,z:z/a.hull.scale},q=plan(a,b,previous),s=a.hull.scale;
  const raw=Array(1478).fill(0),mapped=[];raw[0x28/4]=11;
  const add=(owner,key,at,units)=>{
   const value=owner[key];axes.forEach((k,i)=>raw[at/4+i]=word(value[k]/units));mapped.push({owner,key,at,units,y:value.y});
  };
  [...a.articulatedRider.points,...b.anchorState.points].forEach((p,i)=>add(p,'position',0x664+i*0x28,s));
  a.hull.points.forEach((p,i)=>add(p,'position',0x90+i*0x20,s));
  add(a.hull,'center',0x44,s);add(a.frame,'startCenter',0xbe4,s);add(a.lastFrame,'referencePositionNative',0xc14,1);
  const expected=prepareNativeBodyTranslation({bodyWords:raw,deltaNative:{...q.driftNative,y:0}});
  assert.deepEqual({hull:a.hull,rider:a.articulatedRider,anchors:b.anchorState,frame:{...a.frame,riderPose:null},last:a.lastFrame},before,'prepare is pure');
  q.commit();
  for(const {owner,key,at,units,y}of mapped){
   for(const [k,index]of [['x',0],['z',2]])if(q.driftNative[k]!==0)assert.equal(owner[key][k],number(expected.bodyWords[at/4+index])*units);
   assert.equal(owner[key].y,y,'untranslated double precision axis stays intact');
  }
  assert.deepEqual(a.hull.sprayMotionNative,before.hull.sprayMotionNative,'160C is not translated by source618F4');
  assert.deepEqual(a.hull.velocity,before.hull.velocity);assert.deepEqual(a.hull.frame,before.hull.frame);
  assert.deepEqual(a.hull.points.map(p=>p.velocity),before.hull.points.map(p=>p.velocity));
  assert.deepEqual(a.articulatedRider.points.map(p=>p.storedDelta),before.rider.points.map(p=>p.storedDelta));
  assert.deepEqual(b.anchorState.points.map(p=>p.storedDelta),before.anchors.points.map(p=>p.storedDelta));
  assert.ok(Object.isFrozen(a.frame.prepared)&&Object.isFrozen(a.frame.prepared.jointWorld));
  assert.throws(()=>q.commit(),/already applied/);assert.throws(()=>plan(a,b),/unwrapped/);
  assert.throws(()=>capture(a),/completed/);
  completeNativeRaceAdapterInactiveFrame(a);assert.deepEqual(capture(a),q.driftNative);
  assert.deepEqual(previous,{x:x/s,y:17,z:z/s});
 }
});

test('zero drift preserves every double precision position and wrap failures cannot partly move a rig',()=>{
 const {adapter:a,bundle:b}=make(.123456789,.987654321),before=structuredClone({hull:a.hull,rider:a.articulatedRider,anchors:b.anchorState,frame:{...a.frame,riderPose:null},last:a.lastFrame});
 const q=plan(a,b);q.commit();assert.deepEqual(q.driftNative,{x:0,z:0});
 assert.deepEqual({hull:a.hull,rider:a.articulatedRider,anchors:b.anchorState,frame:{...a.frame,riderPose:null},last:a.lastFrame},before);
 const {adapter:c,bundle:d}=make(-700);d.anchorState.anchors[3].z=NaN;
 const prior=structuredClone({hull:c.hull,rider:c.articulatedRider,frame:{...c.frame,riderPose:null}});
 assert.throws(()=>plan(c,d),/Nonfinite/);assert.deepEqual({hull:c.hull,rider:c.articulatedRider,frame:{...c.frame,riderPose:null}},prior);
 assert.throws(()=>capture(c),/completed/);
});

function hostFor(simulation){
 const options={mode:'time',physics:'native',course:getCourse('greyhaven')},initial=createRace(options).nativeLaunch.snapshot();
 Object.assign(initial.scene,{simulation648:simulation,phase650:3});
 const race=createRace({...options,nativeInitialRaceState:initial}),host=race.nativeHost,a=host.world.adapters[0],b=host.bundles[0];
 // Move the complete test rig one source world period east, keeping its
 // preceding physical/camera position history consistent before preparation.
 const dx=49152,world=dx*a.hull.scale;
 for(const p of [a.hull.center,...a.hull.points.map(p=>p.position),...a.articulatedRider.points.map(p=>p.position),
  a.articulatedRider.jointWorld,...b.anchorState.points.map(p=>p.position),...Object.values(b.anchorState.anchors)])p.x+=world;
 a.lastFrame.referencePositionNative={...a.lastFrame.referencePositionNative,x:F(a.lastFrame.referencePositionNative.x+dx)};
 host.world.water.previousPositions[0].x+=dx;
 return {race,host,a};
}

test('live source host wraps before summary and actor work, using canonical eye storage without moving follow lag',()=>{
 for(const simulation of [0,3]){
  const {host,a}=hostFor(simulation),w=host.world,apply=w.beforeBody,order=[];
  w.beforeBody=(world,context)=>{
   assert.equal(a.logicalFrames,0);assert.equal(a.hull.ticks,simulation?5:0);order.push('wrap');
   const eye=world.water.cameras[0].eyeNative,follow=world.water.follows[0],proxies=structuredClone(world.craftContactStates),
    reference=structuredClone(a.hull.sprayMotionNative),velocities=a.hull.points.map(p=>({...p.velocity}));
   apply(world,context);
   assert.equal(world.water.cameras[0].eyeNative[0],F(eye[0]-49152));
   assert.equal(world.water.cameras[0].eyeNative[2],eye[2]);assert.deepEqual(world.water.follows[0],follow);
   assert.deepEqual(world.craftContactStates,proxies);assert.deepEqual(a.hull.sprayMotionNative,reference);
   assert.deepEqual(a.hull.points.map(p=>p.velocity),velocities);
  };
  const actor=w.beforeActor;w.beforeActor=(world,context)=>{
   order.push('actor');assert.equal(a.logicalFrames,1);assert.ok(Math.abs(a.lastFrame.frameDisplacementNative.x)<100);
   assert.ok(Math.abs(a.lastFrame.referenceDisplacementNative.x)<100);actor(world,context);
  };
  stepNativeRaceHost(host,.049,[{}]);assert.deepEqual(order,[]);assert.throws(()=>capture(a),/completed/);
  stepNativeRaceHost(host,.001,[{}]);assert.deepEqual(order,['wrap','actor']);
  assert.deepEqual(capture(a),{x:-49152,z:0});assert.equal(w.fault,null);
  assert.equal(captureNativeEffectBody(a,{boundaryDriftNative:capture(a)}).boundaryDriftNative.x,-49152);
  stepNativeRaceHost(host,1,[{}],{active:false});assert.deepEqual(order,['wrap','actor']);
 }
});

test('wrap is rejected mid hull frame and cannot supply previous-frame effect drift',()=>{
 const {adapter:a,bundle:b}=make(-700);plan(a,b).commit();completeNativeRaceAdapterInactiveFrame(a);
 assert.ok(capture(a));stepNativeRaceAdapter(a,.01,{}, {sourceState:{actorState:22,simulationState:3}});
 assert.throws(()=>plan(a,b),/completion boundary/);assert.throws(()=>capture(a),/completed/);
 const {adapter:c,bundle:d}=make(-700),pending=plan(c,d);completeNativeRaceAdapterInactiveFrame(c);
 assert.throws(()=>pending.commit(),/stale/);assert.equal(c.hull.center.x,-700);
});

test('a real boundary crossing retains identical physics, rider history and camera results across refresh rates',()=>{
 const histories=[];
 for(const hz of [30,60,144]){
  const {host,a}=hostFor(3),drifts=[],after=host.world.afterFrame;
  host.world.afterFrame=(world,context)=>{drifts.push(capture(a));return after(world,context);};
  for(let i=0;i<hz/2;i++)stepNativeRaceHost(host,1/hz,[{throttle:1,steer:.15}]);
  assert.equal(drifts.length,10);assert.deepEqual(drifts[0],{x:-49152,z:0});
  assert.ok(drifts.slice(1).every(d=>d.x===0&&d.z===0));
  histories.push({body:nativeRaceSnapshot(a),rider:structuredClone(a.articulatedRider),camera:host.world.water.cameras,
   height:host.world.water.field.heightQ.slice(),drifts});
 }
 assert.deepEqual(histories[1],histories[0]);assert.deepEqual(histories[2],histories[0]);
});
