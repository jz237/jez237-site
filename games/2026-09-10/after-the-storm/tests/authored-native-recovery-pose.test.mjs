import test from 'node:test';
import assert from 'node:assert/strict';
import {createAuthoredNativeRecoveryPose} from '../authored-native-recovery-pose.js';
import {createNativeHull} from '../native-hull.js';
import {riderPose} from '../rider-pose.js';
import {authoredNativeRiderTargets} from '../authored-native-rider.js';
import {createNativeRiderRecovery,decideNativeActorAfterHull,finishNativeActorPose} from '../native-rider-recovery.js';

const AXES=['x','y','z'],vec=(x=0,y=0,z=0)=>({x,y,z}),copy=p=>({...p});
const add=(a,b)=>vec(a.x+b.x,a.y+b.y,a.z+b.z),sub=(a,b)=>vec(a.x-b.x,a.y-b.y,a.z-b.z);
const times=(p,s)=>vec(p.x*s,p.y*s,p.z*s),distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const near=(a,b,e=1e-10)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const nearPoint=(a,b,e=1e-10)=>AXES.forEach(k=>near(a[k],b[k],e));
// Independently authored modern rider anatomy, converted explicitly from world
// lengths into local native lengths. No original animation records are loaded.
const REST=authoredNativeRiderTargets(riderPose('',0,0),createNativeHull()).map(p=>times(p,1/.025));
const EDGES=[[2,1],[1,0],[2,3],[3,4],[4,5],[5,6],[2,7],[7,8],[8,9],[9,10],
 [2,11],[11,12],[12,13],[13,14],[2,15],[15,16],[16,17],[17,18]];
function world(local,hull){
 const {right:r,up:u,forward:f}=hull.frame;
 return vec(...AXES.map(k=>hull.center[k]+hull.scale*(r[k]*local.x+u[k]*local.y+f[k]*local.z)));
}
function fallen(hull){
 const root=REST[2],a=1.2,c=Math.cos(a),s=Math.sin(a);
 return REST.map(p=>{
  const q=sub(p,root),rotated=vec(q.x*c-q.y*s,q.x*s+q.y*c,q.z);
  return world(add(add(root,rotated),vec(8,-43,-42)),hull);
 });
}
const provider=(options={})=>createAuthoredNativeRecoveryPose({scale:.025,restTargetsLocal:REST,...options});
function deepFreeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(deepFreeze);Object.freeze(v);}return v;}

test('85-frame source playback timing uses explicit floored frame, with no internal clock or interpolation-time input',()=>{
 const hull=createNativeHull(),p=provider(),entryPositions=fallen(hull);
 p.evaluate({animationFrame:0,hull,entryPositions});
 for(const frame of [0,1,28,55,56,57,76,77,83,84,85,100,28.999,83.999,84.999]){
  const sample=p.evaluate({animationFrame:frame,hull}),evaluated=Math.min(84,Math.floor(frame));
  assert.equal(sample.evaluatedAnimationFrame,evaluated);
  assert.equal(sample.nextAnimationFrame,evaluated<84?evaluated+1:-1);
  assert.deepEqual(p.evaluate({animationFrame:frame,hull}),sample);
 }
 assert.equal(p.evaluate({animationFrame:1,hull}).nextAnimationFrame,2,'seeking backward never advances a private clock');
});

test('entry0 starts at actual fallen points and captures them once, independently of later physical point updates',()=>{
 const hull=createNativeHull({position:vec(4,3,-2),heading:.7,pitch:.2,roll:-.3}),entryPositions=fallen(hull),p=provider();
 const first=p.evaluate({animationFrame:0,hull,entryPositions});
 first.targets.forEach((point,i)=>nearPoint(point,entryPositions[i]));assert.equal(first.entryCaptured,true);
 const expected=p.evaluate({animationFrame:6,hull});
 const changed=entryPositions.map(point=>add(point,vec(100,100,100)));
 assert.deepEqual(p.evaluate({animationFrame:6,hull,entryPositions:changed}),expected,'new solve cannot rebase captured fall');
 p.evaluate({animationFrame:56,hull});
 p.evaluate({animationFrame:0,hull}).targets.forEach((point,i)=>nearPoint(point,entryPositions[i]));
});

test('frame56 onward equals the supplied ordinary pose; direct stumble entry57 requires no fabricated fall',()=>{
 const hull=createNativeHull({position:vec(3,-2,7),heading:.43,roll:.3,pitch:-.2}),expected=REST.map(q=>world(q,hull));
 for(const animationFrame of [56,57,76,77,83,84,100]){
  const noEntry=provider().evaluate({animationFrame,hull});
  noEntry.targets.forEach((point,i)=>nearPoint(point,expected[i]));
  assert.equal(noEntry.entryCaptured,false);assert.equal(noEntry.authoredPhase,'ordinary');
 }
 const withEntry=provider().evaluate({animationFrame:57,hull,entryPositions:fallen(hull)});
 withEntry.targets.forEach((point,i)=>nearPoint(point,expected[i]));assert.equal(withEntry.nextAnimationFrame,58);
 for(const animationFrame of [0,12,28,55])assert.throws(()=>provider().evaluate({animationFrame,hull}),/Actual solved entryPositions/);
});

test('world conversion scales native lengths once and transforms targets through current full physical hull axes',()=>{
 const baselineHull=createNativeHull(),base=provider();base.evaluate({animationFrame:0,hull:baselineHull,entryPositions:fallen(baselineHull)});
 for(const scale of [.025,.05,1]){
  const entryHull=createNativeHull({scale}),p=provider({scale});p.evaluate({animationFrame:0,hull:entryHull,entryPositions:fallen(entryHull)});
  const moved=createNativeHull({scale,position:vec(7,-5,9),heading:1.1,pitch:.37,roll:-.41});
  for(const animationFrame of [0,6,12,28,42,50,56,83]){
   const source=base.evaluate({animationFrame,hull:baselineHull}),actual=p.evaluate({animationFrame,hull:moved});
   const local=source.targets.map(point=>times(sub(point,baselineHull.center),1/.025));
   actual.targets.forEach((point,i)=>nearPoint(point,world(local[i],moved),1e-9));
  }
 }
});

test('new FK anatomy preserves every supplied segment length through approach, climb and settled frames',()=>{
 const hull=createNativeHull(),p=provider();p.evaluate({animationFrame:0,hull,entryPositions:fallen(hull)});
 for(let animationFrame=0;animationFrame<=84;animationFrame++){
  const targets=p.evaluate({animationFrame,hull}).targets;
  for(const [a,b]of EDGES)near(distance(targets[a],targets[b]),distance(REST[a],REST[b])*.025,1e-9);
 }
 const swim=p.evaluate({animationFrame:12,hull}).targets,climb=p.evaluate({animationFrame:42,hull}).targets;
 assert.ok(swim[2].z<-.9,'authored rear approach is behind the native stern station');
 assert.ok(swim[2].y<0);assert.ok(climb[2].y>swim[2].y);
 assert.notEqual(distance(sub(climb[8],climb[7]),sub(climb[16],climb[15])),0,'climb uses independently authored leg angles');
});

test('captured-to-authored transition interpolates actual segment lengths without collapsing antiparallel limbs',()=>{
 const hull=createNativeHull(),reference=provider();reference.evaluate({animationFrame:0,hull,entryPositions:fallen(hull)});
 const approach=reference.evaluate({animationFrame:12,hull}).targets;
 const opposite=approach.map(point=>add(approach[2],times(sub(point,approach[2]),-1)));
 const p=provider();p.evaluate({animationFrame:0,hull,entryPositions:opposite});
 for(const frame of [1,3,6,9,11]){
  const out=p.evaluate({animationFrame:frame,hull});
  for(const [a,b]of EDGES)near(distance(out.targets[a],out.targets[b]),distance(approach[a],approach[b]),1e-9);
  assert.ok(out.targets.every(point=>AXES.every(k=>Number.isFinite(point[k]))));
 }
 const longer=fallen(hull);longer[0]=add(longer[1],times(sub(longer[0],longer[1]),2));
 const changing=provider();changing.evaluate({animationFrame:0,hull,entryPositions:longer});
 const half=changing.evaluate({animationFrame:6,hull}).targets;
 near(distance(half[0],half[1]),distance(REST[0],REST[1])*.025*1.5,1e-9);
});

test('adjacent authored frames stay bounded with no position jump at phase boundaries',()=>{
 const hull=createNativeHull(),p=provider(),entryPositions=fallen(hull),samples=[];
 for(let animationFrame=0;animationFrame<=84;animationFrame++)samples.push(p.evaluate({animationFrame,hull,entryPositions}).targets);
 const height=(Math.max(...REST.map(q=>q.y))-Math.min(...REST.map(q=>q.y)))*.025;
 let maxStep=0;
 for(let frame=1;frame<samples.length;frame++)for(let i=0;i<19;i++)maxStep=Math.max(maxStep,distance(samples[frame][i],samples[frame-1][i]));
 assert.ok(maxStep<height*.3,`prepared authored frame jump ${maxStep} / stature ${height}`);
 for(const frame of [12,28,42,50,56]){
  const incoming=Math.max(...samples[frame].map((q,i)=>distance(q,samples[frame-1][i])));
  const outgoing=Math.max(...samples[frame].map((q,i)=>distance(q,samples[frame+1][i])));
  assert.ok(incoming<height*.04&&outgoing<height*.04,`phase${frame}: ${incoming}/${outgoing}`);
 }
 for(let frame=57;frame<samples.length;frame++)assert.deepEqual(samples[frame],samples[56]);
});

test('caller physics, rest and captured inputs are immutable; returned arrays cannot alter later samples',()=>{
 const hull=deepFreeze(createNativeHull({velocity:vec(2,3,4)})),rest=deepFreeze(REST.map(copy)),entry=deepFreeze(fallen(hull));
 const before=JSON.stringify({hull,rest,entry}),p=provider({restTargetsLocal:rest});
 const out=p.evaluate({animationFrame:0,hull,entryPositions:entry});out.targets[2].y=999;
 const fresh=p.evaluate({animationFrame:0,hull});nearPoint(fresh.targets[2],entry[2]);
 assert.equal(JSON.stringify({hull,rest,entry}),before);assert.ok(Object.isFrozen(p.provenance));
 for(const key of ['positions','velocities','jointWorld','types','anchors','recoveryCounter','courseProgress'])assert.equal(key in fresh,false);
 assert.match(fresh.provenance.geometry,/new authored/);assert.match(fresh.provenance.compatibility,/not established/);
});

test('two recovery entries remain independent and replay order cannot change either captured sequence',()=>{
 const hull=createNativeHull(),a=provider(),b=provider(),entryA=fallen(hull),entryB=entryA.map(q=>add(q,vec(2,-1,3)));
 a.evaluate({animationFrame:0,hull,entryPositions:entryA});b.evaluate({animationFrame:0,hull,entryPositions:entryB});
 const expected=a.evaluate({animationFrame:6,hull});assert.notDeepEqual(expected.targets,b.evaluate({animationFrame:6,hull}).targets);
 for(const frame of [50,3,83,1,56,12])b.evaluate({animationFrame:frame,hull});
 assert.deepEqual(a.evaluate({animationFrame:6,hull}),expected);
 const replay=provider();replay.evaluate({animationFrame:0,hull,entryPositions:entryA});
 assert.deepEqual(replay.evaluate({animationFrame:6,hull}),expected);
});

test('pure authored provider composes with source lifecycle frame56 restore and returned77 transition without physics writes',()=>{
 const hull=deepFreeze(createNativeHull()),entryPositions=fallen(hull),p=provider();
 let state=createNativeRiderRecovery({riderIndex:0,hullDamping:Array(12).fill(.7),actorState:7,crashDampingLatch:true});
 const zero={primaryBuoyImpactNative:0,fixedSphereImpactNative:0,racerImpactNative:0,shoreImpactNative:0,
  boxImpactNative:0,floorImpactNative:0,objectImpactNative:0,normal:vec(),markedBox:false};
 const before=JSON.stringify(hull);let restoredAt=-1,queuedAt=-1;
 for(let logical=0;logical<77;logical++){
  const decided=decideNativeActorAfterHull(state,{simulationState:3,raceFinished:false,frameSpeedNative:0,
   wetCount:8,upY:1,manipulationAction:0,impacts:zero});
  const sample=p.evaluate({animationFrame:decided.state.animationFrame,hull,entryPositions});
  const complete=finishNativeActorPose(decided.state,{nextAnimationFrame:sample.nextAnimationFrame,pressedButtons:0,releasedButtons:0});
  if(complete.effects.some(e=>e.kind==='restoreHullDamping'))restoredAt=sample.evaluatedAnimationFrame;
  if(complete.actorRequest)queuedAt=sample.evaluatedAnimationFrame;
  state=complete.state;
 }
 assert.equal(restoredAt,55,'evaluator55 returns56 to the source restore branch');
 assert.equal(queuedAt,76,'evaluator76 returns77 to the source22 request');
 assert.equal(state.actorState,7);assert.equal(state.pendingActor,22);assert.equal(state.blendProgress,Math.fround(.15));
 assert.equal(JSON.stringify(hull),before);
});

test('invalid/collapsed anatomy, bad physical hull frames and nonfinite sampling fail explicitly',()=>{
 assert.throws(()=>createAuthoredNativeRecoveryPose(),/nineteen/);
 for(const scale of [0,-1,NaN,Infinity])assert.throws(()=>provider({scale}),/scale/);
 assert.throws(()=>provider({restTargetsLocal:REST.slice(1)}),/nineteen/);
 const collapsed=REST.map(copy);collapsed[0]=copy(collapsed[1]);assert.throws(()=>provider({restTargetsLocal:collapsed}),/collapsed 1-0/);
 const flat=REST.map(p=>({...p,y:0}));assert.throws(()=>provider({restTargetsLocal:flat}),/collapsed|vertical extent/);
 const hull=createNativeHull(),p=provider();
 for(const animationFrame of [-1,NaN,Infinity])assert.throws(()=>p.evaluate({animationFrame,hull}),/animationFrame/);
 assert.throws(()=>p.evaluate({animationFrame:57,hull:{...hull,scale:1}}),/scales must match/);
 assert.throws(()=>p.evaluate({animationFrame:57,hull:{...hull,frame:{...hull.frame,right:vec(2,0,0)}}}),/unit/);
 assert.throws(()=>p.evaluate({animationFrame:57,hull:{...hull,frame:{...hull.frame,right:vec(-1,0,0)}}}),/right handed/);
 assert.throws(()=>p.evaluate({animationFrame:57,hull:{...hull,center:vec(0,NaN,0)}}),/finite/);
 const entry=fallen(hull);entry[1]=copy(entry[2]);assert.throws(()=>p.evaluate({animationFrame:0,hull,entryPositions:entry}),/collapsed/);
 assert.equal(p.evaluate({animationFrame:57,hull}).entryCaptured,false,'failed capture cannot latch partial data');
});
