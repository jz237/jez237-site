import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {verificationInput} from '../race-verification.js';
import {bindRaceWaterCameraStorage} from '../race-water.js';
const base=(0x2938-0x1f94)/4,record=(s,slot,index)=>s.nativeLaunch.snapshot().raceWords1f94[base+slot*222+index]|0;
function frames(s,n,input={}){const end=s.nativeHost.world.frames+n;while(s.nativeHost.world.frames<end)stepRace(s,input,1/60);}
const create=(mode='time',difficulty=0)=>createRace({mode,difficulty,physics:'native',course:getCourse('greyhaven',difficulty)});

test('source reset starts at lap0/finish and selects the actual native class, reverse flag and timing defaults',()=>{
 for(let difficulty=0;difficulty<4;difficulty++){
  const s=create('time',difficulty),r=s.racers[0],a=s.nativeLaunch.snapshot();
  assert.equal(r.lap,0);assert.equal(r.next,0);assert.equal(r.passed,0);assert.deepEqual(r.lapTimes,[]);
  assert.equal(record(s,0,3),0);assert.equal(record(s,0,7),-1);assert.equal(record(s,0,90),0);
  assert.equal(record(s,0,92),599999);assert.equal(record(s,0,177),15000);
  assert.equal(a.profileWordsB330[2],[0,1,2,2][difficulty]);assert.equal(a.scene.reverseDab68,Number(difficulty===3));
  assert.equal(a.scene.configuredLaps728,3);assert.equal(a.scene.primaryCount,s.course.sourceBuoyLayout.nodes.length);
  assert.throws(()=>s.nativeLaunch.advanceClock(),/already owns/);
  assert.throws(()=>s.nativeLaunch.advanceLaunch([0]),/already owns/);
 }
});

test('ordinary judging runs before GO and the initial start line enters lap1 without awarding a completed lap',()=>{
 const s=create(),r=s.racers[0];frames(s,10);
 assert.equal(r.sourceBuoys.logicalTicks,10);assert.equal(r.raceTime,0);assert.equal(r.lap,0);
 let sawStart=false;
 for(let i=0;i<20*60&&r.lap===0;i++){
  stepRace(s,()=>verificationInput(s,r),1/60);
  if(r.sourceBuoyObservation?.initialStartLine)sawStart=true;
 }
 assert.ok(sawStart);assert.equal(r.lap,1);assert.equal(r.passed,0);assert.deepEqual(r.lapTimes,[]);
 assert.equal(record(s,0,200),1,'actual legal-lap counter2c58 advances with the initial crossing');
 assert.ok(r.raceTime>0);
});

test('water and all ordinary consumers share canonical source camera words with atomic invalid writes',()=>{
 const s=create('versus'),water=s.raceWater,store=s.nativeLaunch.cameraStorage;
 assert.throws(()=>bindRaceWaterCameraStorage(water,store),/once/);
 frames(s,1,[{},{}]);
 const snapshot=s.nativeLaunch.snapshot(),cameras=water.cameras,view=new DataView(new ArrayBuffer(4));
 const value=w=>{view.setUint32(0,w);return view.getFloat32(0);};
 for(let index=0;index<2;index++){
  const at=0x7c80+index*0x10c,read=off=>value(snapshot.hudWords7788[(at+off-0x7788)/4]);
  assert.equal(cameras[index].eyeNative[0],read(0x4c));assert.equal(cameras[index].targetNative[2],read(0x84));
  assert.equal(cameras[index].forward[0],read(0x64));assert.equal(cameras[index].horizontalForward[1],read(0xf4));
 }
 cameras[0].eyeNative[0]=999;assert.notEqual(water.cameras[0].eyeNative[0],999);
 const before=s.nativeLaunch.snapshot(),bad=water.cameras;bad[1].forward[0]=NaN;
 assert.throws(()=>store.write(bad),/float32/);assert.deepEqual(s.nativeLaunch.snapshot(),before);
 assert.equal(s.nativeHost.primary.state.motionFrames,1);
 assert.deepEqual(s.nativeHost.lastOrdinary.diagnostic.consumers.map(c=>c.consumer),
  ['overlayFc39c','overlayEf504','overlayF23a0','overlayF03e0','overlayF8dd0','overlayF9ea0','overlayF0e7c','overlayF1cfc']);
});

test('source two-player simultaneous finishes choose a tie and apply the numeric status consumer once',()=>{
 const s=create('versus');frames(s,130,[{},{}]);
 // Prepared result-boundary fixture. Driven three-lap matches are covered
 // separately; this isolates the same-source-frame finish equality branch.
 for(const r of s.racers)r.finishTime=1.025;
 frames(s,1,[{},{}]);assert.equal(s.phase,'results');assert.equal(s.result.winner,null);assert.equal(s.result.time,1.025);
 const a=s.nativeLaunch.snapshot();assert.equal(a.scene.result6f0,3);assert.equal(a.profileWordsB330[48],0);assert.equal(a.profileWordsB330[49],0);
 frames(s,0,[{},{}]);stepRace(s,[{},{}],1);assert.deepEqual(s.nativeLaunch.snapshot(),a);
});
