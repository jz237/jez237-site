import test from 'node:test';
import assert from 'node:assert/strict';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {createNativeRaceLaunchRuntime} from '../native-race-launch-runtime.js';
import {prepareNativePrimaryRaceClock} from '../native-primary-race-clock.js';
import {captureWindowFrame,readWindowFrame,interpolateWindowFrame} from '../player-window-presentation.js';
import {captureRaceWater} from '../race-water.js';
import {encodeOnlinePacket,decodeOnlinePacket} from '../online-race-codec.js';

const BASE=(0x2938-0x1f94)/4,at=(slot,word)=>BASE+slot*222+word;
const create=mode=>createRace({mode,physics:'native',course:getCourse('greyhaven'),seaState:'course'});
const record=(s,slot,word)=>s.nativeLaunch.snapshot().raceWords1f94[at(slot,word)]|0;
function frames(s,n,input={}){const target=s.nativeHost.world.frames+n;while(s.nativeHost.world.frames<target)stepRace(s,input,1/60);}
const data=r=>({power:0,misses:0,lap:1,grid:r,finishTime:null,dq:'',sourceBuoys:{nextSourceRow:2,side:-1,armed:false,
 power:0,lapMisses:0,totalMisses:0,missLimitReached:false,missedCheckpoint:false,logicalTicks:0}});
const rawClock={main638:1,finished2c2c:0,record2c24:0,clockStopped817c:0,flag1fd4:0,courseIndex:1,lapMs:0,totalMs:0,ambientWord:9,ambientD4b00:-1};

test('source timing block retains gates,50ms stores, unsigned ambient and terminal-store order',()=>{
 assert.deepEqual(prepareNativePrimaryRaceClock(rawClock),{advanced:true,totalLimit:false,lapMs:50,totalMs:50,ambientWord:65535});
 for(const patch of [{main638:8},{finished2c2c:1},{record2c24:1},{clockStopped817c:1},{flag1fd4:1}]){
  const out=prepareNativePrimaryRaceClock({...rawClock,...patch});assert.equal(out.advanced,false);assert.equal(out.totalMs,0);assert.equal(out.ambientWord,9);
 }
 assert.deepEqual(prepareNativePrimaryRaceClock({...rawClock,lapMs:599980,totalMs:599980}),{advanced:true,totalLimit:true,lapMs:599999,totalMs:599999,ambientWord:9});
 assert.equal(prepareNativePrimaryRaceClock({...rawClock,courseIndex:0,totalMs:599980}).ambientWord,65535);
 assert.equal(prepareNativePrimaryRaceClock({...rawClock,totalMs:2147483607}).totalMs,-2147483639,'source signed32 wrap precedes its upper clamp');
});

test('a native race starts with the actual starting rider and physically evolves behind the source clock gate',()=>{
 const s=create('time'),a=s.nativeHost.world.adapters[0];
 assert.deepEqual(s.nativeLaunch.scene(),{simulationState:1,phase650:0});assert.equal(a.riderLifecycle.state.actorState,15);
 assert.equal(a.riderLifecycle.state.animationFrame,56);assert.equal(s.nativeLaunchLabel,'READY');
 frames(s,10,{throttle:1});
 assert.equal(s.nativeHost.world.ticks,50);assert.equal(s.raceWater.frames,10);assert.equal(a.articulatedRider.logicalFrames,10);
 assert.equal(s.nativeHost.bundles[0].anchorState.logicalFrames,10);assert.equal(a.lastControls.throttle,false);
 assert.equal(a.riderLifecycle.state.animationFrame,56);assert.equal(s.racers[0].raceTime,0);
 assert.deepEqual(s.nativeLaunch.scene(),{simulationState:1,phase650:1});
 assert.equal(s.time,.5,'physical/presentation time is distinct from the source record clock');
});

test('the genuine source phase opens on frame56 and releases pose/clock on the following frame',()=>{
 const s=create('time'),r=s.racers[0],a=s.nativeHost.world.adapters[0];frames(s,55);
 assert.equal(s.nativeLaunch.scene().phase650,1);assert.equal(s.phase,'countdown');assert.equal(r.raceTime,0);
 frames(s,1);assert.equal(s.nativeLaunch.scene().phase650,2);assert.equal(s.nativeLaunch.scene().simulationState,3);
 assert.equal(s.phase,'running');assert.equal(r.raceTime,0);assert.equal(a.riderLifecycle.state.animationFrame,56);
 frames(s,1,{throttle:1});
 assert.equal(r.raceTime,.05);assert.equal(record(s,0,103),50);assert.equal(a.riderLifecycle.state.animationFrame,57);
 assert.equal(r.power,5);assert.equal(record(s,0,75),5);assert.equal(record(s,0,197),1);assert.equal(record(s,0,10),1);
 assert.equal(s.nativeCountdownCue.number,0);assert.equal(s.nativeCountdownCue.sequence,4);
 assert.equal(a.powerSteps,0,'the post-physical launch write cannot change the already-completed hull frame');
 frames(s,1,{throttle:1});assert.equal(a.powerSteps,5);assert.equal(r.raceTime,.1);
});

test('held throttle cannot fabricate a newB58 launch edge and an early window edge consumes the real latch',()=>{
 const held=create('time');frames(held,60,{throttle:1});assert.equal(held.racers[0].power,0);
 const early=create('time');frames(early,42);frames(early,1,{throttle:1});frames(early,13);
 frames(early,1,{throttle:1});assert.equal(early.racers[0].power,0,'the actual early source-window latch blocks another attempt');
});

test('two riders share the source108-frame release but retain independent real launch edges and record clocks',()=>{
 const s=create('versus');frames(s,107,[{},{}]);assert.equal(s.phase,'countdown');assert.deepEqual(s.racers.map(r=>r.raceTime),[0,0]);
 frames(s,1,[{},{}]);assert.equal(s.phase,'running');assert.deepEqual(s.nativeHost.world.adapters.map(a=>a.riderLifecycle.state.animationFrame),[56,56]);
 frames(s,1,[{throttle:1},{}]);assert.deepEqual(s.racers.map(r=>r.power),[5,0]);assert.deepEqual(s.racers.map(r=>r.raceTime),[.05,.05]);
 assert.deepEqual(s.nativeHost.world.adapters.map(a=>a.riderLifecycle.state.animationFrame),[57,57]);
 assert.deepEqual(s.nativeHost.bundles.map(b=>b.anchorState.logicalFrames),[109,109]);
});

test('power, misses and source judge fields are live canonical views with no persistent synchronized copy',()=>{
 const racers=[data(0),data(1)],o=createNativeRaceLaunchRuntime({racers,players:2,courseIndex:1}),r=racers[0];
 r.power=3;assert.equal(r.sourceBuoys.power,3);assert.equal(o.snapshot().raceWords1f94[at(0,75)],3);
 r.sourceBuoys.power=4;assert.equal(r.power,4);r.sourceBuoys.totalMisses=2;assert.equal(r.misses,2);
 r.sourceBuoys={...r.sourceBuoys,power:5,totalMisses:3,lapMisses:3,side:1,armed:true,logicalTicks:4};
 assert.equal(r.power,5);assert.equal(r.misses,3);assert.equal(o.snapshot().raceWords1f94[at(0,76)],3);
 assert.equal(o.snapshot().raceWords1f94[at(0,7)],1);assert.equal(o.snapshot().raceWords1f94[at(0,8)],1);
 assert.equal(racers[1].power,0);assert.ok(Object.isFrozen(r.sourceBuoys));
 const before=o.snapshot();assert.throws(()=>r.sourceBuoys={...r.sourceBuoys,power:2,side:99},/side/);assert.deepEqual(o.snapshot(),before);
 const copy=structuredClone(r.sourceBuoys);copy.power=0;assert.equal(r.power,5);
});

test('a genuine wrong-side crossing counts one miss through the canonical judge view',()=>{
 const s=create('time'),r=s.racers[0];let renderedFrames=0;
 while(r.misses===0&&renderedFrames++<15*60)stepRace(s,{throttle:1},1/60);
 assert.ok(renderedFrames<15*60,'ordinary helm input reaches a real missed buoy');
 assert.equal(r.sourceBuoyObservation.correct,false);assert.equal(r.misses,1);assert.equal(r.sourceBuoys.totalMisses,1);
 assert.equal(record(s,0,77),1);assert.equal(r.power,1,'source missed-buoy feedback delays its power cut');assert.equal(r.sourceBuoys.power,1);
 assert.equal(r.event,'MISSED BUOY · 1/5');
 frames(s,16,{throttle:1});assert.equal(r.power,0);assert.equal(r.sourceBuoys.power,0);assert.equal(record(s,0,75),0);
});

test('each record clock stops independently on finish/DQ and lap starts use the same timing words',()=>{
 const racers=[data(0),data(1)],base=createNativeRaceLaunchRuntime({racers,players:2,courseIndex:1}).snapshot();
 base.scene.clockStopped817c=0;base.scene.phase650=3;base.scene.simulation648=3;
 const r=[data(0),data(1)],o=createNativeRaceLaunchRuntime({racers:r,players:2,courseIndex:1,initialState:base});
 o.advanceClock();o.advanceClock();assert.deepEqual(r.map(q=>q.raceTime),[.1,.1]);
 r[0].lapStart=.075;assert.equal(o.snapshot().raceWords1f94[at(0,90)],25);
 r[0].finishTime=.08;o.advanceClock();assert.equal(r[0].finishTime,.08);assert.equal(r[0].raceTime,.08);assert.equal(r[1].raceTime,.15);
 r[1].dq='Outside course for five seconds';o.advanceClock();assert.equal(r[1].raceTime,.15);assert.equal(o.snapshot().raceWords1f94[at(1,187)],1);
});

test('a prepared versus DQ displays the surviving record clock without including prestart physics time',()=>{
 const s=create('versus');frames(s,145,[{},{}]);
 assert.equal(s.phase,'running');assert.ok(s.racers.every(r=>r.raceTime>0&&r.raceTime<s.time));
 // Unit fixture for the host result branch; this is not a driven DQ proof.
 s.racers[0].dq='Outside course for five seconds';frames(s,1,[{},{}]);
 assert.equal(s.phase,'postrace');assert.equal(s.result.winner,1);
 assert.equal(s.result.time,s.racers[1].raceTime);assert.notEqual(s.result.time,s.time);
 assert.equal(record(s,0,187),1);assert.equal(record(s,1,187),0);
});

test('canonical expiry keeps the source ascending metric writes and2P mode1 suppression',()=>{
 function fixture(mode){
  const q=[data(0),data(1)],s=createNativeRaceLaunchRuntime({racers:q,players:2,courseIndex:1}).snapshot();s.scene.clockStopped817c=0;s.scene.mode620=mode;
  for(let i=0;i<2;i++){s.raceWords1f94[at(i,90)]=599980;s.raceWords1f94[at(i,103)]=599980;}
  const r=[data(0),data(1)],o=createNativeRaceLaunchRuntime({racers:r,players:2,courseIndex:1,initialState:s});o.advanceClock();return {r,o};
 }
 const view=new DataView(new ArrayBuffer(4)),f=n=>{view.setUint32(0,n);return view.getFloat32(0);};
 const a=fixture(0),s=a.o.snapshot();assert.deepEqual(a.r.map(r=>r.raceTime),[599.999,599.999]);
 assert.equal(f(s.raceWords1f94[at(0,203)]),-100000);assert.equal(f(s.raceWords1f94[at(1,203)]),-90000);
 const b=fixture(1).o.snapshot();assert.equal(b.raceWords1f94[at(0,203)],0);assert.equal(b.raceWords1f94[at(1,203)],0);
});

test('pause cannot advance source countdown/record clocks or either physical player',()=>{
 const s=create('versus');frames(s,65,[{},{}]);s.phase='paused';
 const before={owner:s.nativeLaunch.snapshot(),ticks:s.nativeHost.world.ticks,water:captureRaceWater(s.raceWater)};
 for(let i=0;i<180;i++)stepRace(s,[{throttle:1},{throttle:1}],1/60);
 assert.deepEqual(s.nativeLaunch.snapshot(),before.owner);assert.equal(s.nativeHost.world.ticks,before.ticks);assert.deepEqual(captureRaceWater(s.raceWater),before.water);
 s.phase='countdown';frames(s,43,[{},{}]);assert.equal(s.phase,'running');assert.equal(s.racers[0].raceTime,0);
});

test('full live launch, physics and canonical state are identical across30/60/144Hz',()=>{
 function run(hz){const s=create('versus');for(let i=0;i<8*hz;i++)stepRace(s,[{},{}],1/hz);
  return {owner:s.nativeLaunch.snapshot(),phase:s.phase,poses:s.racers.map(r=>r.nativeRiderPose),ticks:s.nativeHost.world.ticks,water:captureRaceWater(s.raceWater)};}
 const reference=run(60);assert.equal(reference.phase,'running');for(const hz of [30,144])assert.deepEqual(run(hz),reference);
});

test('source labels/cues and race clocks survive online transport without carrying a simulation owner',async()=>{
 const s=create('versus');frames(s,64,[{},{}]);
 const raw=captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)});
 const wire=await decodeOnlinePacket(await encodeOnlinePacket(raw)),read=readWindowFrame(wire);
 assert.ok(read);assert.equal(read.nativeLaunchLabel,'3');assert.deepEqual(read.nativeCountdownCue,{sequence:1,number:3});
 assert.equal(read.racers[1].raceTime,0);assert.equal(read.nativeLaunch,undefined);assert.deepEqual(wire,raw);
 const later={...read,time:read.time+.05,nativeLaunchLabel:'2',nativeCountdownCue:{sequence:2,number:2}};
 assert.equal(interpolateWindowFrame(read,later,read.time+.02).nativeLaunchLabel,'3');
 assert.deepEqual(interpolateWindowFrame(read,later,later.time).nativeCountdownCue,{sequence:2,number:2});
 assert.equal(readWindowFrame({...read,nativeCountdownCue:{sequence:-1,number:3}}),null);
 s.phase='postrace';
 const finishFrame=captureWindowFrame(s,{wake:[],impacts:[],craft:[],level:0,native:captureRaceWater(s.raceWater)});
 const finishWire=await decodeOnlinePacket(await encodeOnlinePacket(finishFrame));
 assert.equal(readWindowFrame(finishWire).phase,'postrace');
 assert.equal(interpolateWindowFrame(read,readWindowFrame(finishWire),read.time).phase,'postrace');
 assert.equal(finishWire.nativeLaunch,undefined);
});
