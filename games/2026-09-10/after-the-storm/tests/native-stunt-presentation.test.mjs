import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace,aiInput} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureNativeStuntWorld,nativeStuntVolumePositions,createNativeStuntPresentation} from '../native-stunt-presentation.js';
import {prepareNativeRaceStuntRingUpdate,createNativeRaceState} from '../native-race-state.js';
import {createRecorder,recordMoment,replaySample} from '../instant-replay.js';
const create=(id='greyhaven',options={})=>createRace({course:getCourse(id),mode:'stunt',physics:'native',...options});
const ri=a=>(a-0x1f94)/4;
function frames(s,n){const end=s.nativeHost.world.frames+n;for(let guard=0;s.nativeHost.world.frames<end;guard++){
 assert.ok(guard<n*5+10,'source run unexpectedly stopped');stepRace(s,{},1/60);
}}
function queuedRingState(){
 const s=create(),raw=s.nativeLaunch.snapshot(),a=raw.objectWordsC940,d=new DataView(new ArrayBuffer(4));
 Object.assign(raw.scene,{phase650:3,simulation648:3,clockStopped817c:0});
 const row=Array.from({length:raw.scene.objectCountFa40},(_,i)=>i).find(i=>a[i*49+19]===8&&a[i*49+48]===0);
 const read=j=>{d.setUint32(0,a[row*49+j]);return d.getFloat32(0);};
 return prepareNativeRaceStuntRingUpdate(createNativeRaceState(raw),{primaryBodyPositionNative:{x:read(0),y:read(1)-8,z:read(2)}}).state;
}

test('four native Stunt races retain high-resolution courses and bind every ring and ramp to source state',()=>{
 for(const [id,ringCount,volumeCount]of [['greyhaven',12,6],['amber',9,12],['tempest',10,6],['glacier',14,0]]){
  const s=create(id),r=s.racers[0],modern=createRace({course:getCourse(id),mode:'stunt'});
  for(const [x,z]of [[0,0],[-80,50],[120,-60]]){assert.equal(s.course.ground(x,z),modern.course.ground(x,z));if(s.course.renderGround)assert.equal(s.course.renderGround(x,z),modern.course.renderGround(x,z));}
  assert.deepEqual(s.course.rings,modern.course.rings);assert.deepEqual(s.course.ramps,modern.course.ramps);
  assert.equal(s.nativeStuntWorld.rings.length,ringCount);assert.equal(s.nativeStuntWorld.volumes.length,volumeCount);
  assert.equal(r.stunt.score,0);assert.equal(r.stunt.remaining,id==='tempest'||id==='glacier'?20:15);
  assert.equal(r.stunt.native,true);assert.ok(Object.isFrozen(r.stunt));assert.throws(()=>r.stunt.score=999,TypeError);
  assert.throws(()=>r.stunt={score:999},TypeError);assert.equal(s.demoRun,true);assert.equal(s.nativePreview,true);
  frames(s,60);assert.equal(s.phase,'running');assert.equal(r.stunt.score,s.nativeLaunch.stuntView().awards.totals.total);
  assert.equal(r.stunt.remaining,s.nativeLaunch.stuntView().remainingMs/1000);
  const raw=s.nativeLaunch.snapshot(),d=new DataView(new ArrayBuffer(4)),read=w=>{d.setUint32(0,w);return d.getFloat32(0);};
  for(const ring of s.nativeStuntWorld.rings){
   const expected=raw.objectWordsC940.slice(ring.sourceIndex*49+29,ring.sourceIndex*49+45).map(read);
   for(let j=12;j<15;j++)expected[j]*=.025;
   assert.deepEqual(ring.matrix,expected);assert.deepEqual(ring.matrix.slice(12,15),ring.position);
   assert.ok(Math.abs(Math.hypot(...ring.matrix.slice(0,3))-1)<1e-6,'ring radius stays in world units');
  }
  for(const v of s.nativeStuntWorld.volumes){
   const p=raw.collisionPlaneWordsFd78.slice(v.planeIndex*16,(v.planeIndex+1)*16).map(read);
   assert.deepEqual(v.origin,p.slice(0,3).map(n=>n*.025));assert.deepEqual(v.axes,[p.slice(3,6),p.slice(6,9),p.slice(9,12)]);
   const positions=nativeStuntVolumePositions(v);assert.ok(positions.length>108,'retain the detailed subdivided surfaces');
   for(let i=0;i<positions.length;i+=3){
    let onFace=false;
    for(let axis=0;axis<3;axis++){
     const projection=v.axes[axis].reduce((sum,n,j)=>sum+n*(v.origin[j]-positions[i+j]),0);
     assert.ok(projection>=-.0002&&projection<=v.spans[axis]+.0002,'mesh lies within its selected finite planes');
     onFace||=Math.min(Math.abs(projection),Math.abs(projection-v.spans[axis]))<.0002;
    }
    assert.ok(onFace,'tessellated vertices lie on a selected surface');
   }
  }
 }
});

test('ring and HUD views cannot score early; pause holds the queue and result waits for source display transfer',()=>{
 const s=create('greyhaven',{nativeInitialRaceState:queuedRingState()}),r=s.racers[0];
 assert.equal(r.stunt.rings,1);assert.equal(r.stunt.ringStatus[0],'hit');assert.equal(s.nativeStuntWorld.rings[0].visible,false);
 assert.equal(r.stunt.score,0);const initial=s.nativeLaunch.snapshot();
 for(let i=0;i<50;i++){s.nativeStuntDisplay.snapshot();captureNativeStuntWorld(s.nativeStuntWorld);}assert.deepEqual(s.nativeLaunch.snapshot(),initial);
 frames(s,22);assert.equal(r.stunt.score,0);const before=s.nativeLaunch.snapshot(),view=s.nativeStuntHud;
 s.phase='paused';for(let i=0;i<120;i++)stepRace(s,{},1/60);assert.equal(s.nativeStuntHud,view);assert.deepEqual(s.nativeLaunch.snapshot(),before);
 s.phase='running';frames(s,1);assert.equal(r.stunt.score,50);assert.equal(s.nativeStuntHud,s.racers[0].stunt);
 const terminal=structuredClone(queuedRingState());terminal.raceWords1f94[ri(0x2c2c)]=1;terminal.raceWords1f94[ri(0x2928)]=1;
 const finished=create('greyhaven',{nativeInitialRaceState:terminal});frames(finished,1);assert.equal(finished.phase,'postrace');assert.equal(finished.result.score,0);
 frames(finished,22);assert.equal(finished.result.score,50);assert.equal(finished.racers[0].stunt.complete,true);
 for(let i=0;i<1000&&finished.phase!=='results';i++)stepRace(finished,{},1/60);
 assert.equal(finished.phase,'results');assert.equal(finished.result.score,50);assert.equal(finished.nativeResult.exit.consumer,'801ecf18');
});

test('display bindings reject changed source layouts and snapshots are detached from live scoring and geometry',()=>{
 const s=create(),before=s.nativeLaunch.snapshot(),a=captureNativeStuntWorld(s.nativeStuntWorld);
 a.rings[0].position[0]=999;a.rings[0].matrix[0]=999;a.volumes[0].axes[0][0]=999;assert.deepEqual(s.nativeLaunch.snapshot(),before);
 assert.throws(()=>createNativeStuntPresentation({course:{...s.course,rings:s.course.rings.slice(1)},readState:s.nativeLaunch.snapshot}),/Every source/);
 const wrong=s.course.rings.map(r=>({...r}));wrong[0].x+=1;
 assert.throws(()=>createNativeStuntPresentation({course:{...s.course,rings:wrong},readState:s.nativeLaunch.snapshot}),/ordinal and center/);
 assert.throws(()=>captureNativeStuntWorld({...s.nativeStuntWorld,rings:[s.nativeStuntWorld.rings[0],s.nativeStuntWorld.rings[0]]}),/Duplicate/);
 for(const bad of [[1],Array(16).fill(NaN),Array(16).fill(0)])assert.throws(()=>captureNativeStuntWorld({...s.nativeStuntWorld,rings:[{...s.nativeStuntWorld.rings[0],matrix:bad}]}));
 const legacy=structuredClone(s.nativeStuntWorld);legacy.rings.forEach(r=>delete r.matrix);
 assert.deepEqual(captureNativeStuntWorld(legacy),legacy,'older version1 replay snapshots retain their heading fallback');
});

test('replay records Stunt object visibility and geometry without retaining or advancing an owner',()=>{
 const s=create('greyhaven',{nativeInitialRaceState:queuedRingState()}),rec=createRecorder();
 const water={wake:[],impacts:[],craft:[],level:0};
 frames(s,1);recordMoment(rec,s,water);frames(s,1);recordMoment(rec,s,water);
 assert.equal(rec.frames.length,2);const [a,b]=rec.frames,before=s.nativeLaunch.snapshot();
 const sampled=replaySample({frames:rec.frames,start:a.time,end:b.time},(a.time+b.time)/2);
 assert.deepEqual(sampled.nativeStuntWorld,a.nativeStuntWorld);sampled.nativeStuntWorld.rings[0].position[0]=999;sampled.nativeStuntWorld.rings[0].matrix[0]=999;
 assert.notEqual(a.nativeStuntWorld.rings[0].position[0],999);assert.notEqual(a.nativeStuntWorld.rings[0].matrix[0],999);assert.deepEqual(s.nativeLaunch.snapshot(),before);
});

test('ring display follows opposite source spins and holds them exactly while paused',()=>{
 const s=create();frames(s,60);const before=s.nativeStuntWorld,raw=s.nativeLaunch.snapshot();frames(s,1);
 const after=s.nativeStuntWorld,next=s.nativeLaunch.snapshot(),d=new DataView(new ArrayBuffer(4));
 const read=w=>{d.setUint32(0,w);return d.getFloat32(0);};
 for(const r of after.rings){
  const b=r.sourceIndex*49,angle=read(raw.objectWordsC940[b+5]),updated=read(next.objectWordsC940[b+5]);
  assert.equal((updated-angle+360)%360,r.index%2?4:356);
  assert.notDeepEqual(r.matrix,before.rings[r.index].matrix);assert.deepEqual(r.position,before.rings[r.index].position);
 }
 s.phase='paused';for(let i=0;i<144;i++)stepRace(s,{},1/144);
 assert.equal(s.nativeStuntWorld,after);assert.deepEqual(s.nativeLaunch.snapshot(),next);
});


test('a fresh physical start reaches a ring using only helm input and transfers its score once',()=>{
 const s=create(),r=s.racers[0],start={x:r.x,z:r.z};let firstHit=null;
 for(let i=0;i<600;i++){
  stepRace(s,aiInput(s,r),1/60);
  if(r.stunt.rings&&!firstHit)firstHit={frame:s.nativeHost.world.frames,score:r.stunt.score};
 }
 assert.ok(firstHit);assert.equal(firstHit.score,0,'contact queues the award before display transfer');
 assert.equal(r.dq,'');assert.equal(r.stunt.rings,1);assert.equal(r.stunt.score,50);
 assert.ok(Math.hypot(r.x-start.x,r.z-start.z)>100);
 assert.equal(s.nativeStuntWorld.rings.filter(r=>r.collected).length,1);
 assert.equal(s.nativeStuntWorld.rings.find(r=>r.collected).visible,false);
 const restored=create('greyhaven',{nativeInitialRaceState:s.nativeLaunch.snapshot()});
 assert.deepEqual(restored.nativeStuntWorld,s.nativeStuntWorld);assert.deepEqual(restored.nativeStuntHud,s.nativeStuntHud);
});
