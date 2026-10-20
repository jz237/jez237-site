import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeHull} from '../native-hull.js';
import {createNativeLifecycleRider} from '../native-lifecycle-rider.js';
import {createNativeRiderLifecycle} from '../native-rider-lifecycle.js';
import {createNativeCraftContactState} from '../native-craft-contact.js';
import {createSourceBuoyLayout,createSourceBuoyProgress,stepSourceBuoyProgress} from '../source-buoy-progress.js';

const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
const nearPoint=(a,b)=>{for(const k of ['x','y','z'])near(a[k],b[k]);};

test('race core judges actual primary recoil before the one50ms buoy-motion pass',()=>{
 const options={mode:'time',course:getCourse('greyhaven'),physics:'native'},prepared=createRace(options).nativeLaunch.snapshot();
 const recordBase=(0x2938-0x1f94)/4;
 // Complete prepared numeric owner: this case starts on lap1 at source row2,
 // rather than overriding the source reset's genuine lap0/initial finish.
 for(const [word,value]of [[0,1],[3,2],[7,-1],[8,1],[196,2],[200,1]])prepared.raceWords1f94[recordBase+word]=value>>>0;
 Object.assign(prepared.scene,{phase650:3,simulation648:3,clockStopped817c:0});prepared.i1Words9440[0]=0xffffffff;
 const s=createRace({...options,nativeInitialRaceState:prepared});
 const host=s.nativeHost,a=host.world.adapters[0],r=s.racers[0],layout=s.course.sourceBuoyLayout;
 const authored=layout.nodes.find(n=>n.sourceRow===2),primary=host.primary.state.nodes.find(n=>n.sourceRow===2);
 assert.equal(r.sourceBuoys.nextSourceRow,2);assert.equal(authored.classification,1);
 assert.deepEqual(primary.anchorNative,{x:2032,z:1220});assert.equal(primary.physicsEnabled,true);

 // Prepared state at tick0, rather than a runtime teleport or hand-moved buoy.
 // A small backwards velocity approaches the real sphere from the positive-X
 // side. Both craft and articulated rider start in this same physical pose.
 const initial={x:51.1,y:0,z:30.7};
 const hull=createNativeHull({position:initial,velocity:{x:-10,y:0,z:0},heading:Math.PI/2,rider:0,scale:.025});
 const bundle=createNativeLifecycleRider({initialHull:hull});
 // Replace the complete prepared tick0 physical bundle, including its owner
 // of recovery effects. Keeping the old lifecycle would target another hull
 // and nineteen-point rider after this intentional fixture initialization.
 // A human rider keeps the prepared selection countdown (10); a fresh -1 would
 // hand this craft to source AI.
 const riderLifecycle=createNativeRiderLifecycle({hull,rider:bundle.articulatedRider,
  courseDatumNative:()=>s.raceWater.field.datumNative,raceFinished:()=>r.finishTime!==null,
  state:{riderIndex:hull.rider,hullDamping:hull.points.map(p=>p.damping),selectionCountdown:a.riderLifecycle.state.selectionCountdown}});
 Object.assign(a,bundle,{hull,riderLifecycle});host.bundles[0]=bundle;
 host.world.craftContactStates[0]=createNativeCraftContactState(hull);
 r.sourceBuoys.armed=true;r.sourceBuoys.side=-1;r.sourceBuoyPrevious={x:initial.x,z:initial.z};
 const initialProgress=structuredClone(r.sourceBuoys);
 assert.equal(hull.ticks,0);assert.equal(host.world.frames,0);assert.equal(host.primary.state.motionFrames,0);
 nearPoint(host.primary.positionForSourceRow(2),{x:50.8,y:0,z:30.5});

 const contacts=[],realContact=a.contacts.racingBuoys;
 a.contacts={...a.contacts,racingBuoys(h,c){
  realContact(h,c);
  contacts.push(...host.primary.diagnostics(h).hull.last);
 }};
 let judgeCalls=0,observed;
 const coreJudge=host.onFrame;
 host.onFrame=(h,c,ordinary)=>{
  judgeCalls++;assert.equal(c.logicalFrame,1);assert.equal(a.hull.ticks,5);assert.equal(s.raceWater.frames,1);
  assert.equal(h.primary.state.motionFrames,0);
  const before=h.primary.positionForSourceRow(2),sample={position:{x:r.x,z:r.z},previousPosition:r.sourceBuoyPrevious,lap:1,human:true};
  const fixed=stepSourceBuoyProgress(layout,initialProgress,sample);
  const moving=stepSourceBuoyProgress(layout,initialProgress,{...sample,currentNodePosition:before});
  // Literal outcomes make a missing current-center override fail this test.
  assert.equal(fixed.event.nativeEventCode,1);assert.equal(fixed.event.correct,true);
  assert.equal(moving.event.nativeEventCode,2);assert.equal(moving.event.correct,false);
  near(r.x,51.552672087356285);near(r.z,31.02827385818004);
  nearPoint(before,{x:49.82101745605469,y:-.11119134426116944,z:30.055233764648438});
  near(a.lastFrame.impacts.primaryBuoyImpactNative,3.913475751876831,1e-12);
  for(const channel of ['fixedSphere','shore','floor','box','object'])assert.equal(a.lastFrame.impacts[channel+'ImpactNative'],0);

  const keepRunning=coreJudge(h,c,ordinary);
  assert.equal(r.misses,1);assert.equal(r.power,0);assert.equal(r.sourceBuoys.totalMisses,1);
  assert.equal(r.sourceBuoys.nextSourceRow,4);assert.equal(r.sourceBuoys.logicalTicks,1);assert.equal(r.passed,1);
  assert.equal(r.event,'MISSED BUOY · 1/5');assert.equal(r.dq,'');
  assert.equal(h.primary.state.motionFrames,0);assert.deepEqual(h.primary.positionForSourceRow(2),before);
  observed=before;return keepRunning;
 };

 s.phase='running';
 // stepRace caps dt at1/30; three1/60 calls complete exactly five hull ticks.
 for(let i=0;i<3;i++)stepRace(s,{},1/60);
 assert.equal(judgeCalls,1);assert.equal(a.hull.ticks,5);assert.equal(host.world.frames,1);
 assert.ok(contacts.length>0);assert.ok(contacts.every(q=>q.sourceRow===2&&q.channel==='primaryBuoy'));
 assert.equal(host.primary.state.motionFrames,1);assert.equal(host.primary.diagnostics().motionUpdates,1);
 const after=host.primary.positionForSourceRow(2);
 nearPoint(after,{x:48.94972229003906,y:-.06527613401412964,z:29.659393310546875});
 assert.notDeepEqual(after,observed);assert.deepEqual(primary.anchorNative,{x:2032,z:1220});
 assert.deepEqual(s.primaryBuoys.find(q=>q.sourceRow===2).position,after);
 assert.equal(s.phase,'running');near(s.time,.05);
});

test('race one-sided checkpoint spans keep fixed endpoints under a current-center override',()=>{
 // Native finish halfspan500 and slack512: side0 admits span<=1512 with no
 // lower bound; side1 admits span>=-512 with no upper bound. Moving the center
 // to the rider must not recenter these independently fixed endpoints.
 for(const [checkpointSide,x,expectedSpan,expectedPass]of [
  [0,1100,1600,false],[0,-1100,-600,true],[1,-1100,-600,false],[1,1100,1600,true]
 ]){
  const layout=createSourceBuoyLayout({rows:[[0,0,3,0],[0,1000,7,0]],courseIndex:6,mode:'race',checkpointSide,
   checkpointSlackNative:512,regionsNative:[[-30000,30000,-30000,30000]]});
  const before=structuredClone(layout),progress=createSourceBuoyProgress(layout,{nextSourceRow:0,armed:true});
  const result=stepSourceBuoyProgress(layout,progress,{position:{x:x*.025,z:.25},currentNodePosition:{x:x*.025,z:0},lap:1});
  assert.equal(result.diagnostic.spanCoordinateNative,expectedSpan);assert.equal(result.diagnostic.spanPass,expectedPass);
  if(expectedPass){assert.equal(result.event.kind,'finish');assert.equal(result.event.advanced,true);assert.equal(result.state.nextSourceRow,1);}
  else{assert.equal(result.event,null);assert.equal(result.diagnostic.rejection,'checkpoint-span');assert.equal(result.state.nextSourceRow,0);}
  assert.deepEqual(layout,before);
 }
});
