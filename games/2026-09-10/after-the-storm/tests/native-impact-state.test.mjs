import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeImpactState,resetNativeImpacts,recordNativeImpact,nativeImpactSnapshot,NATIVE_IMPACT_FIELDS} from '../native-impact-state.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';

const v=(x=0,y=0,z=0)=>({x,y,z}),X=v(1),Y=v(0,1),Z=v(0,0,1);
const hit=(s,channel,incomingNative,normal=X,markedBox=false)=>recordNativeImpact(s,{channel,incomingNative,normal,markedBox});

test('seven independent maxima retain the last family increase, not the global-largest normal',()=>{
 const s=createNativeImpactState();hit(s,'shore',10,X);hit(s,'floor',2,Y);
 assert.equal(s.shoreImpactNative,10);assert.equal(s.floorImpactNative,2);assert.deepEqual(s.normal,Y);
 assert.equal(hit(s,'shore',9,Z),false);assert.equal(hit(s,'floor',2,Z),false);assert.deepEqual(s.normal,Y);
 hit(s,'fixedSphere',1,Z);assert.deepEqual(s.normal,Z);
 for(const channel of ['primaryBuoy','racer','box','object'])hit(s,channel,3,X);
 assert.deepEqual(Object.values(NATIVE_IMPACT_FIELDS).map(k=>s[k]),[3,1,3,10,3,2,3]);
});

test('source preparation clears all maxima, normal and box latch, while simulation0 retains all',()=>{
 for(const simulationState of [0,1,2,3]){
  const s=createNativeImpactState();for(const channel of Object.keys(NATIVE_IMPACT_FIELDS))hit(s,channel,8,Y,channel==='box');
  const before=nativeImpactSnapshot(s);resetNativeImpacts(s,{simulationState});
  if(simulationState===0)assert.deepEqual(nativeImpactSnapshot(s),before);
  else{assert.ok(Object.values(NATIVE_IMPACT_FIELDS).every(k=>s[k]===0));assert.deepEqual(s.normal,v());assert.equal(s.markedBox,false);}
 }
});

test('24 raw-checked marked-box combinations preserve strict equality and signed incoming',()=>{
 for(const marked of [false,true])for(const incoming of [-10,0,10])for(const old of [0,4,5,10]){
  const s=createNativeImpactState();hit(s,'floor',1,Z);hit(s,'box',old,Y);
  const previousNormal={...s.normal},expected=incoming===10?(marked?4:10):0;
  const increased=hit(s,'box',incoming,X,marked);
  assert.equal(increased,expected>old,`${marked}/${incoming}/${old}`);
  assert.equal(s.boxImpactNative,Math.max(old,expected));assert.equal(s.markedBox,marked);
  assert.deepEqual(s.normal,expected>old?X:previousNormal);
 }
});

test('native float32 comparison happens after marked-box attenuation',()=>{
 const s=createNativeImpactState();hit(s,'box',Math.fround(.4),X);
 assert.equal(hit(s,'box',1,Y,true),false);assert.deepEqual(s.normal,X);
 assert.equal(s.boxImpactNative,.4000000059604645);
 const q=createNativeImpactState();hit(q,'object',1,X);
 assert.equal(hit(q,'object',1+Number.EPSILON,Y),false);assert.deepEqual(q.normal,X);
});

test('separating contacts leave maxima/normal alone; marked-box latch still records the qualified overlap',()=>{
 const s=createNativeImpactState();hit(s,'primaryBuoy',-1,X);hit(s,'fixedSphere',0,Y);hit(s,'box',-10,Z,true);
 assert.deepEqual(s.normal,v());assert.equal(s.markedBox,true);
 assert.ok(Object.values(NATIVE_IMPACT_FIELDS).every(k=>s[k]===0));
});

test('snapshots are detached and invalid reports cannot partially set the marked-box flag',()=>{
 const s=createNativeImpactState();hit(s,'shore',2,X);const snapshot=nativeImpactSnapshot(s);
 hit(s,'floor',3,Y);assert.equal(snapshot.floorImpactNative,0);assert.deepEqual(snapshot.normal,X);
 assert.ok(Object.isFrozen(snapshot)&&Object.isFrozen(snapshot.normal));
 const before=nativeImpactSnapshot(s);
 for(const invalid of [{channel:'toString',incomingNative:4,normal:Y},{channel:'box',incomingNative:Infinity,normal:Y,markedBox:true},
  {channel:'box',incomingNative:4,normal:v(),markedBox:true},{channel:'floor',incomingNative:4,normal:Y,markedBox:true}]){
  assert.throws(()=>recordNativeImpact(s,invalid));assert.deepEqual(nativeImpactSnapshot(s),before);
 }
 assert.throws(()=>resetNativeImpacts(s,{simulationState:4}),RangeError);assert.deepEqual(nativeImpactSnapshot(s),before);
});

test('adapter geometry and other kernels share impacts across five ticks in exact reporting order',()=>{
 const a=createNativeRaceAdapter({contacts:{shore:(h,c)=>{
  if(c.substep===0){h.points[0].velocity=v(-25);c.applyContact({kind:'shore',pointIndex:0,normal:X,penetration:.1});}
 },floor:(h,c)=>{
  if(c.substep===0){h.points[1].velocity=v(0,-12.5);c.applyContact({kind:'floor',pointIndex:1,normal:Y,penetration:.1});}
 },fixedSpheres:(h,c)=>{
  c.recordImpact({channel:'fixedSphere',incomingNative:1,normal:c.substep===0?Z:X});
 }}});
 stepNativeRaceAdapter(a,.05,{});assert.equal(a.lastFrame.impacts.shoreImpactNative,10);assert.equal(a.lastFrame.impacts.floorImpactNative,5);
 assert.equal(a.lastFrame.impacts.fixedSphereImpactNative,1);assert.deepEqual(a.lastFrame.impacts.normal,Z);
 assert.equal(a.contactWindow.shoreImpactNative,10);assert.equal(a.contactWindow.floorImpactNative,5);
 const snap=nativeRaceSnapshot(a);snap.source.impacts.normal.z=9;snap.source.impacts.fixedSphereImpactNative=9;
 assert.deepEqual(a.lastFrame.impacts.normal,Z);assert.equal(a.impacts.fixedSphereImpactNative,1);
});

test('adapter marked boxes remove full incoming velocity but report the attenuated maximum and latch',()=>{
 const observed=[],a=createNativeRaceAdapter({contacts:{boxes:(h,c)=>{
  if(c.substep!==0)return;
  h.points[4].velocity=v(-25);const report=c.applyContact({kind:'box',pointIndex:4,normal:X,penetration:.1,flag:true});
  observed.push({velocity:{...h.points[4].velocity},report});
 }}});
 stepNativeRaceAdapter(a,.05,{});assert.deepEqual(observed[0].velocity,v());assert.equal(observed[0].report.boxImpactNative,4);
 assert.equal(a.lastFrame.impacts.boxImpactNative,4);assert.equal(a.lastFrame.impacts.markedBox,true);assert.deepEqual(a.lastFrame.impacts.normal,X);
});

test('adapter simulation0 preparation retains impact state and simulation3 clears it before contacts',()=>{
 let produce=true,observed;
 const a=createNativeRaceAdapter({contacts:{racingBuoys:(h,c)=>{
  if(produce)c.recordImpact({channel:'primaryBuoy',incomingNative:6,normal:Z});
  observed=nativeImpactSnapshot(a.impacts);
 }}});
 stepNativeRaceAdapter(a,.05,{});produce=false;
 stepNativeRaceAdapter(a,.05,{}, {sourceState:{simulationState:0}});
 assert.equal(observed.primaryBuoyImpactNative,6);assert.deepEqual(observed.normal,Z);
 stepNativeRaceAdapter(a,.01,{}, {sourceState:{simulationState:3}});
 assert.equal(observed.primaryBuoyImpactNative,0);assert.deepEqual(observed.normal,v());
});

test('legacy contact-drive reports remain compatible without fabricating a shared normal',()=>{
 const a=createNativeRaceAdapter({contacts:{floor:()=>({floorImpactNative:.2})}});stepNativeRaceAdapter(a,.05,{});
 assert.equal(a.lastFrame.contacts.floorImpactNative,.2);assert.equal(a.lastFrame.impacts.floorImpactNative,0);
 assert.deepEqual(a.lastFrame.impacts.normal,v());
});
