import test from 'node:test';
import assert from 'node:assert/strict';
import {createNativeHullFromStart,prepareNativeHullStartFromPose} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter} from '../native-race-adapter.js';
import {createNativeRiderRecovery} from '../native-rider-recovery.js';
import {createAuthoredNativeResultRecords} from '../authored-native-result-records.js';
import {createNativeRiderResultPoseProvider} from '../native-rider-start-provider.js';
import {nativeRiderResultFrameView} from '../native-rider-start-pose.js';

const AXES=['x','y','z'],COUNTS=[0,89,100,54,79,40,54];
const distance=(a,b)=>Math.hypot(...AXES.map(k=>a[k]-b[k]));
function setup(options={}){
 const hullStart=prepareNativeHullStartFromPose(options),hull=createNativeHullFromStart({prepared:hullStart,...options});
 const bundle=createNativeLifecycleRider({initialHull:hull});
 const rest=bundle.restTargets.map(p=>{
  const d=Object.fromEntries(AXES.map(k=>[k,p[k]-hull.center[k]]));
  return Object.fromEntries(['right','up','forward'].map((a,i)=>[AXES[i],AXES.reduce((s,k)=>s+d[k]*hull.frame[a][k],0)/hull.scale]));
 });
 const art=createAuthoredNativeResultRecords({scale:hull.scale,restTargetsLocal:rest,anchorRig:bundle.anchorRig});
 const provider=createNativeRiderResultPoseProvider({scale:hull.scale,...art,readYawFrame:h=>h.yawFrame});
 return {hullStart,hull,bundle,art,provider};
}

test('all authored result records evaluate through source timing with finite detailed anatomy and craft-owned supports',()=>{
 const h=setup(),supports=h.provider.evaluate({actorState:1,animationFrame:0,hull:h.hull}).auxiliaryTargets;
 for(let actor=1;actor<=6;actor++)for(let frame=0;frame<COUNTS[actor];frame++){
  const q={actorState:actor,animationFrame:frame,hull:h.hull},out=h.provider.evaluate(q);
  assert.equal(out.nextAnimationFrame,frame===COUNTS[actor]-1?-1:frame+1);
  assert.deepEqual(out.auxiliaryTargets,supports,'free hands must not drag the steering supports');
  assert.ok([...out.targets,...out.auxiliaryTargets].every(p=>AXES.every(k=>Number.isFinite(p[k]))));
  if(actor!==5)assert.ok(Math.abs(distance(out.targets[3],out.targets[11])-.45)<1e-5);
  for(const [a,b]of [[0,1],[5,6],[13,14],[9,10],[17,18]])
   assert.ok(Math.abs(distance(out.targets[a],out.targets[b])-distance(h.bundle.restTargets[a],h.bundle.restTargets[b]))<.003);
  if(actor===4&&out.targets[2].y<h.bundle.restTargets[2].y-.05)
   assert.ok(out.targets[2].z< -1.4,'low crouch must clear the tall modern saddle before lowering');
 }
});

test('authored result motions distinguish raised hands, a bound second hand, crouch and the retiring backward fall',()=>{
 const h=setup(),pose=(a,f)=>h.provider.evaluate({actorState:a,animationFrame:f,hull:h.hull}).targets;
 const rest=pose(1,0),celebrate=pose(1,32),one=pose(2,8),slump=pose(3,18),crouch=pose(4,24),fall=pose(5,39);
 assert.ok(celebrate[6].y>celebrate[1].y&&celebrate[14].y>celebrate[1].y);
 assert.ok(one[6].y>one[1].y);assert.ok(distance(one[14],rest[14])<.003);
 assert.ok(slump[6].y<rest[6].y);assert.ok(crouch[2].y<rest[2].y-.2);
 assert.ok(fall[2].y<h.hull.center.y-1&&fall[2].z<rest[2].z-.5);
 for(const actor of [1,2,3,4,6]){
  const end=pose(actor,COUNTS[actor]-1);
  for(let i=0;i<19;i++)assert.ok(distance(end[i],h.bundle.restTargets[i])<.006,`actor${actor} role${i} must rejoin modern rest`);
 }
});

test('result record seeking is pure and actor5 never reads retained yaw',()=>{
 const h=setup(),view=nativeRiderResultFrameView({actorState:2,animationFrame:8});
 const first=h.art.selectFrame(view);h.art.selectFrame(nativeRiderResultFrameView({actorState:5,animationFrame:39}));
 assert.deepEqual(h.art.selectFrame(view),first);first.records[0].coordinatesS16[0]=12345;
 assert.notDeepEqual(h.art.selectFrame(view),first);
 assert.throws(()=>h.art.selectFrame({...view,nextAnimationFrame:10}),/actual result descriptor/);
 let reads=0;const p=createNativeRiderResultPoseProvider({scale:h.hull.scale,...h.art,readYawFrame:()=>{reads++;return h.hull.yawFrame;}});
 p.evaluate({actorState:5,animationFrame:39,hull:h.hull});assert.equal(reads,0);
 p.evaluate({actorState:1,animationFrame:8,hull:h.hull});assert.equal(reads,1);
});

// Prepared result selection, not a driven original finish: every subsequent
// actor/frame/pose/point is produced by actual lifecycle and physical solves.
function run(actor,hz=20,riderIndex=0){
 const h=setup({rider:riderIndex}),samples=[],state=createNativeRiderRecovery({riderIndex,selectedActor:actor,selectionCountdown:10,
  hullDamping:h.hull.points.map(p=>Math.fround(p.damping))});
 const adapter=createNativeRaceAdapter({riderIndex,hullStart:h.hullStart,...h.bundle,
  riderPose:(hull,c)=>{const out=h.bundle.riderPose(hull,c);samples.push({request:structuredClone(c.poseRequest),outcome:out.animationOutcome});return out;},
  riderRecovery:{courseDatumNative:0,raceFinished:true,state},sourceState:{simulationState:3,phase650:4}});
 const history=[];let entered=false,returned=false,prior=-1;
 for(let i=0;i<hz*16;i++){
  stepNativeRaceAdapter(adapter,1/hz,{rawXNative:0,rawYNative:0,heldButtons:0});
  if(adapter.logicalFrames===prior)continue;prior=adapter.logicalFrames;
  const s=adapter.riderLifecycle.state;entered||=s.actorState===actor;
  history.push({state:s,points:adapter.articulatedRider.points.map(p=>({...p.position})),
   auxiliary:h.bundle.anchorState.logicalFrames,body:adapter.articulatedRider.logicalFrames});
  if(entered&&s.actorState===22&&s.pendingActor===-1){returned=true;break;}
 }
 assert.ok(entered&&returned,`actor${actor} did not finish: ${JSON.stringify(adapter.riderLifecycle.state)}`);
 for(const row of history){
  assert.equal(row.auxiliary,row.body);assert.equal(row.body,row.state.lifecycleFrame);
  assert.ok(row.points.every(p=>AXES.every(k=>Number.isFinite(p[k]))));
  assert.equal(row.state.crashCountdown,0);assert.equal(row.state.stumbleCountdown,0);
  assert.ok(![23,24].includes(row.state.actorState),'unrelated wipeout cannot substitute for result completion');
 }
 assert.equal(adapter.riderLifecycle.state.selectionCountdown,-1);
 assert.equal(adapter.riderLifecycle.state.selectedActor,actor);
 assert.equal(samples.length,adapter.articulatedRider.logicalFrames);
 return {adapter,history,samples};
}
for(let actor=1;actor<=6;actor++)test(`result${actor} completes actual poses and physical solves for all four riders${actor===5?' through remount7':''}`,()=>{
 for(const riderIndex of [0,1,2,3]){
  const h=run(actor,20,riderIndex);
  const entered=h.samples.filter(s=>s.request.actorState===actor&&!s.request.pending);
  assert.equal(entered.length,COUNTS[actor]-1,'entry frame1 plays every source frame once');
  assert.equal(h.history.some(r=>r.state.actorState===7),actor===5);
  assert.ok(h.samples.some(s=>s.request.pending?.actorState===actor&&s.request.pending.animationFrame===1));
 }
});
test('result completion is identical across30/60/144Hz render cadences',()=>{
 for(const actor of [1,5]){
  const reference=run(actor,30).adapter;
  for(const hz of [60,144]){
   const actual=run(actor,hz).adapter;
   assert.deepEqual(actual.riderLifecycle.state,reference.riderLifecycle.state);
   assert.deepEqual(actual.articulatedRider.points,reference.articulatedRider.points);
   assert.deepEqual(actual.hull.points,reference.hull.points);
  }
 }
});
