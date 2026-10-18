import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {stuntLaunchFixture,stuntLaunchTrace} from './helpers/native-stunt-launch-fixture.mjs';
import {nativeRaceCourseRegions} from '../native-course-regions.js';
import {sourceBuoyCourseRules} from '../source-buoy-progress.js';
import {nativeStuntCheckpointSeconds} from '../native-stunt-checkpoint-times.js';
import {createNativeStuntCourseRuntime} from '../native-stunt-course-runtime.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {createNativeRaceState,prepareNativeRaceStartup} from '../native-race-state.js';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
const ri=a=>(a-0x1f94)/4;
const read=name=>JSON.parse(fs.readFileSync(new URL(`./fixtures/${name}.json`,import.meta.url)));
const reference=read('native-stunt-launch-reference'),headers=read('native-course-region-selection-reference');
const primary=read('native-stunt-primary-resources-reference'),objects=read('native-stunt-launch-objects-reference');
function hash(values,float=false){const b=Buffer.alloc(values.length*4);values.forEach((v,i)=>float?b.writeFloatBE(v,i*4):b.writeUInt32BE(v,i*4));return createHash('sha256').update(b).digest('hex');}
function ringPoint(state,ordinal=0){
 const a=state.objectWordsC940,index=Array.from({length:state.scene.objectCountFa40},(_,i)=>i).find(i=>a[i*49+19]===8&&a[i*49+48]===ordinal);
 const v=new DataView(new ArrayBuffer(4)),f=o=>{v.setUint32(0,a[index*49+o]);return v.getFloat32(0);};
 return {row:index,point:{x:f(0),y:f(1)-8,z:f(2)}};
}

test('all nine course header families and checkpoint bytes match the selected original numeric tables',()=>{
 for(const c of headers.cases){
  const a=nativeRaceCourseRegions(c.courseIndex),tables={allowed:a.allowedRegionsNative,warnings:a.warningSuppressionRegionsNative,coarse:sourceBuoyCourseRules(c.courseIndex).regionsNative};
  for(const [key,rows]of Object.entries(tables)){assert.equal(rows.length,c[key].count);assert.equal(hash(rows.flat(),true),c[key].sha256,`${c.courseIndex}/${key}`);}
  assert.deepEqual(nativeStuntCheckpointSeconds(c.courseIndex),c.checkpointSeconds);
 }
 for(const bad of [-1,9,.5,undefined]){assert.throws(()=>nativeStuntCheckpointSeconds(bad));assert.throws(()=>nativeRaceCourseRegions(bad));}
 assert.throws(()=>nativeRaceCourseRegions(3).warningSuppressionRegionsNative[0][0]=99,TypeError);
});

test('prepared Stunt starts select complete source routes/objects, one lap, source difficulty and full power',()=>{
 for(let c=0;c<9;c++){
  const {runtime:r,courseRuntime:k,riders}=stuntLaunchFixture(c),s=r.snapshot(),p=primary.cases.find(p=>p.courseIndex===c&&p.policy==='zero'),o=objects.checks.find(o=>o.courseIndex===c&&o.players===1);
  assert.equal(hash(k.data.recordWordsBySourceRow.flat()),p.recordWordsSha256);
  for(const [key,value]of Object.entries(o.hashes))assert.equal(hash(s[key]),value,`${c}/${key}`);
  assert.equal(r.stunt,true);assert.equal(r.ordinary,false);assert.equal(r.canonicalObjects,true);
  assert.equal(s.scene.mode620,11);assert.equal(s.scene.mode608,11);assert.equal(s.scene.configuredLaps728,1);
  assert.equal(s.profileWordsB330[2],c===5?0:2);assert.equal(s.scene.ready6fc,c===0?1:0);
  assert.equal(riders[0].power,5);assert.equal(riders[0].lap,0);assert.equal(r.stuntView().checkpointIndex,1);
  assert.equal(r.stuntView().remainingMs,k.checkpointSecondsByIndex[0]*1000);
  assert.equal(r.stuntView().rings,0);assert.equal(r.stuntView().chain,0);assert.equal(r.stuntView().nextRing,0);
  assert.equal(r.stuntView().awards.totals.total,0);assert.equal(k.checkpointSourceRows.length,4);
  assert.throws(()=>r.advanceOrdinary({}),/ordinary/);assert.throws(()=>r.advanceClock(),/already owns/);
 }
});

test('all nine prepared start/checkpoint/finish/delayed-bonus/record sequences match original79528 full words and effects',()=>{
 let matched=0;
 for(let courseIndex=0;courseIndex<9;courseIndex++){
  const f=stuntLaunchTrace(courseIndex,q=>{
   const c=reference.checks.find(c=>c.courseIndex===courseIndex&&c.frame===q.frame);if(!c)return;
   for(const [key,value]of Object.entries(c.hashes))assert.equal(hash(q.after[key]),value,`${courseIndex}/${q.stage}/${key}`);
   assert.deepEqual(q.result.effects,c.effects);matched++;
   if(q.stage==='finish'){
    assert.equal(q.fixture.runtime.stuntView().delayedBonus,251);assert.equal(q.fixture.runtime.stuntView().delayedFrames,20);
    assert.equal(q.after.raceWords1f94[ri(0x1fd8)],0,'record insertion waits for award transfer');
   }
  });
  const view=f.runtime.stuntView(),s=f.runtime.snapshot();
  assert.equal(view.finished,true);assert.equal(view.disqualification,0);assert.equal(view.pendingTrick,0);assert.equal(view.delayedBonus,0);
  assert.equal(view.awards.totals.trick,251);assert.ok(view.awards.totals.time>0);assert.ok(view.awards.slots.every(s=>s.type===0));
  assert.equal(s.raceWords1f94[ri(0x1fd8)],1);assert.equal(s.raceWords1f94[ri(0x26e8)+courseIndex*12],view.awards.totals.total);
  assert.equal(f.riders[0].lap,1);assert.ok(Number.isFinite(f.riders[0].finishTime));
 }
 assert.equal(matched,63);
});

test('selected Stunt reset and terminal HUD startup match original execution with the full fixed-object extent',()=>{
 const reference=read('native-stunt-launch-reset-reference');
 for(const c of reference.checks){
  const f=stuntLaunchFixture(c.courseIndex),s=f.runtime.snapshot();s.scene.cold8224=1;s.scene.clockStopped817c=0;
  for(const a of [0x26d0,0x292c,0x2a68,0x2ad4,0x2bfc,0x39cc,0x39d0])s.raceWords1f94[ri(a)]=777;
  const state=createNativeRaceState(s),result=prepareNativeRaceStartup(f.courseRuntime.resetLayout,state);
  for(const [key,value]of Object.entries(c.hashes))assert.equal(hash(result.state[key]),value,`${c.courseIndex}/${key}`);
  assert.equal(result.state.scene.cold8224,0);assert.equal(result.state.scene.clockStopped817c,1);
  assert.equal(state.raceWords1f94[ri(0x39cc)],777,'retained input is immutable');
 }
});

test('ring contacts and award display share the same retained state, with no transfer from rendering reads',()=>{
 for(let c=0;c<9;c++){
  const f=stuntLaunchFixture(c,{running:true}),r=f.runtime,initial=r.snapshot(),ring=ringPoint(initial);
  assert.deepEqual(r.advanceStuntRings(ring.point).diagnostic.collectedRows,[ring.row]);
  const collected=r.snapshot();assert.equal(r.stuntView().rings,1);assert.equal(r.stuntView().chain,1);assert.equal(r.stuntView().nextRing,1);
  assert.equal(collected.objectWordsC940[ring.row*49+47],1);assert.equal(r.stuntView().awards.totals.total,0);
  for(let i=0;i<50;i++){r.stuntView();r.snapshot();}assert.deepEqual(r.snapshot(),collected);
  assert.deepEqual(r.advanceStuntRings(ring.point).diagnostic.collectedRows,[]);
  for(let i=0;i<22;i++)r.advanceStuntDisplay();assert.equal(r.stuntView().awards.totals.total,0);
  r.advanceStuntDisplay();assert.equal(r.stuntView().awards.totals.total,50);assert.equal(r.stuntView().awards.totals.ring,50);
  for(const key of ['collisionPlaneWordsFd78','fixedSphereWordsB138','fixedSphereGridWords1ce8'])assert.deepEqual(r.snapshot()[key],initial[key]);
 }
});

test('retained inactive, terminal and invalid updates preserve source gates and atomic state',()=>{
 const f=stuntLaunchFixture(2,{running:true,patch:s=>s.scene.activity624=0}),b=f.body(0,-20);f.camera(b);const before=f.runtime.snapshot();
 assert.equal(f.runtime.advanceStunt({bodiesBySlot:[b],pressedButtonsB58BySlot:[0]}).applied,false);
 assert.equal(f.runtime.advanceStuntRings(b.positionNative).applied,false);assert.equal(f.runtime.advanceStuntDisplay().applied,false);
 assert.deepEqual(f.runtime.snapshot(),before);
 const expired=stuntLaunchFixture(2,{running:true,patch:s=>s.raceWords1f94[ri(0x2bfc)]=50}),slow=expired.body(0,-20);slow.speedB90Native=0;
 expired.advance(slow);assert.equal(expired.runtime.stuntView().remainingMs,0);assert.equal(expired.runtime.stuntView().disqualification,2);
 const ring=ringPoint(expired.runtime.snapshot());assert.deepEqual(expired.runtime.advanceStuntRings(ring.point).diagnostic.collectedRows,[]);
 const invalid=stuntLaunchFixture(2,{running:true}),saved=invalid.runtime.snapshot(),body=invalid.body(0,-20);body.stuntMove1604=99;
 assert.throws(()=>invalid.runtime.advanceStunt({bodiesBySlot:[body],pressedButtonsB58BySlot:[0]}));assert.deepEqual(invalid.runtime.snapshot(),saved);
});

test('prepared Stunt mode rejects incompatible retained selections and unsupported physical courses',()=>{
 const k=createNativeStuntCourseRuntime({courseIndex:1}),fresh=stuntLaunchFixture(1).runtime.snapshot();
 const launch=options=>createNativeRaceLaunchRuntime({courseIndex:1,players:1,racers:[{id:0}],courseRuntime:k,...options});
 for(const patch of [{mode620:0},{configuredLaps728:3},{reverseDab68:1},{primaryHumanIndex:1}]){
  const s=structuredClone(fresh);Object.assign(s.scene,patch);assert.throws(()=>launch({initialState:s}),/Retained Stunt scene/);
 }
 const missing=structuredClone(fresh);delete missing.scene.ringNext0cb0;assert.throws(()=>launch({initialState:missing}),/ringNext/);
 assert.throws(()=>launch({reverse:true}),/forward/);assert.throws(()=>launch({players:2}),/one rider/);
 assert.throws(()=>createRace({course:getCourse('practice'),physics:'native',mode:'stunt'}),/native|Native/);
});
