import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeTwoPlayerCatchup} from '../native-two-player-catchup.js';
import {createNativeRaceAdapter,stepNativeRaceAdapter,nativeRaceSnapshot} from '../native-race-adapter.js';
import {createRace,stepRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {captureRaceWater} from '../race-water.js';
import {createNativeRacePilot} from '../native-race-pilot.js';
const F=Math.fround,buffer=new DataView(new ArrayBuffer(4)),bits=v=>{buffer.setFloat32(0,v);return buffer.getUint32(0);};
const base={players:2,enabled4970:1,place293c:1,riderIndex:0,primaryPositionNative:{x:0,z:0},secondaryPositionNative:{x:200,z:0},powerFactor1578:1,steeringDegrees1588:30};
test('532 prepared original assistance executions match both output words exactly',()=>{
 const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-two-player-catchup.json',import.meta.url)));
 assert.equal(fixture.cases.length,532);assert.equal(fixture.instructions,15774);
 for(const {input,expectedBits}of fixture.cases){const before=structuredClone(input),r=prepareNativeTwoPlayerCatchup(input);
  assert.deepEqual({powerFactor:bits(r.powerFactor),steeringDegrees:bits(r.steeringDegrees)},expectedBits);assert.deepEqual(input,before);}
});
test('leader reduction and rider-specific trailing caps preserve both source branches',()=>{
 for(const riderIndex of [0,1,2,3]){
  const front=prepareNativeTwoPlayerCatchup({...base,riderIndex,place293c:0});assert.equal(front.multiplier,F(.9));
  const rear=prepareNativeTwoPlayerCatchup({...base,riderIndex});assert.equal(rear.multiplier,F([1.1,1.05,1.15,1.1][riderIndex]));
  assert.ok(front.steeringDegrees>30);assert.ok(rear.steeringDegrees<30);
 }
 assert.throws(()=>prepareNativeTwoPlayerCatchup({...base,primaryPositionNative:{x:NaN,z:0}}),/binary32/);
 assert.throws(()=>prepareNativeTwoPlayerCatchup({...base,enabled4970:65536}),/enabled4970/);
});
test('adapter applies prepared steering and power for five hull ticks, preserving inactive branches',()=>{
 for(const riderIndex of [0,1,2,3]){
  const create=catchup=>createNativeRaceAdapter({riderIndex,sourceState:{catchup}});
  const input={throttle:true,steer:.5},q={...base,riderIndex,checkpointClock2c4:15000};
  const assisted=create(q),plain=create(undefined);stepNativeRaceAdapter(assisted,.01,input);stepNativeRaceAdapter(plain,.01,input);
  assert.ok(assisted.frame.catchup.applied);assert.equal(assisted.lastControls.powerFactor,F([1.1,1.05,1.15,1.1][riderIndex]));
  assert.ok(Math.abs(assisted.water.lastJet.angleIndex)<Math.abs(plain.water.lastJet.angleIndex));
  const held=structuredClone(assisted.frame.catchup);stepNativeRaceAdapter(assisted,.04,input);assert.deepEqual(assisted.frame.catchup,held);
  for(const disabled of [{enabled4970:0},{players:1},{checkpointClock2c4:0}]){
   const a=create({...q,...disabled}),b=create(undefined);stepNativeRaceAdapter(a,.05,input);stepNativeRaceAdapter(b,.05,input);
   assert.equal(a.frame.catchup,null);assert.deepEqual(nativeRaceSnapshot(a),nativeRaceSnapshot(b));
  }
 }
});
test('native two-player assistance uses canonical placement and frame-latched actual centers at30/60/144Hz',()=>{
 for(const venue of ['greyhaven','amber']){
  let reference;
  for(const hz of [30,60,144]){
   const s=createRace({course:getCourse(venue),mode:'versus',physics:'native',handicap:true});
   const input=[t=>({throttle:t>4?1:0,steer:t>7?.15:0}),t=>({throttle:t>6?1:0,steer:0})];
   for(let i=0;i<10*hz;i++)stepRace(s,input,1/hz);
   assert.equal(s.nativeLaunch.snapshot().scene.field4970,1);
   assert.ok(s.nativeHost.world.adapters.every(a=>a.frame.catchup?.applied));
   assert.ok(s.nativeHost.world.adapters.some(a=>a.frame.catchup.multiplier===F(.9)));
   for(let i=0;i<2;i++){
    assert.deepEqual(s.racers[i].nativeTelemetry.catchup,s.nativeHost.world.adapters[i].frame.catchup);
    assert.equal(s.racers[i].handicapBoost,s.nativeHost.world.adapters[i].frame.catchup.multiplier-1);
   }
   const snapshot={bodies:s.nativeHost.world.adapters.map(nativeRaceSnapshot),water:captureRaceWater(s.raceWater),canonical:s.nativeLaunch.snapshot()};
   if(reference)assert.deepEqual(snapshot,reference);else reference=snapshot;
  }
 }
});
for(const [venue,difficulty]of [['greyhaven',0],['greyhaven',1],['greyhaven',2],['greyhaven',3],['amber',0],['amber',1]])test(`native assisted ${venue} class${difficulty} three-lap match retains source judging`,()=>{
 const s=createRace({course:getCourse(venue,difficulty),difficulty,mode:'versus',physics:'native',handicap:true}),pilots=s.racers.map(()=>createNativeRacePilot({course:s.course}));
 const inputs=s.racers.map((r,i)=>()=>pilots[i].input(s,r));
 for(let i=0;i<180*60&&!['results','postrace'].includes(s.phase);i++)stepRace(s,inputs,1/60);
 assert.ok(['results','postrace'].includes(s.phase));const finished=s.racers.filter(r=>r.finishTime!==null);
 assert.ok(finished.length>=1);assert.ok(s.racers.every(r=>!r.dq));
 assert.equal(finished[0].lapTimes.length,3);assert.equal(finished[0].passed,s.course.gates.length*3);
});
