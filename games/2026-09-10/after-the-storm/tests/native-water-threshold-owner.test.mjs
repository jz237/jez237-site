import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRace} from '../race-core.js';
import {getCourse} from '../courses.js';
import {bindRaceWaterAmplitudeThreshold} from '../race-water.js';
import {stuntHostFixture} from './helpers/native-stunt-host-fixture.mjs';
import {nativeWaterForcingPlan} from '../native-water-schedule.js';
const bits=new DataView(new ArrayBuffer(4));
const read=w=>{bits.setUint32(0,w);return bits.getFloat32(0);};
const word=v=>{bits.setFloat32(0,v);return bits.getUint32(0);};

test('ordinary source water reads the reset-owned1FB4 across admitted courses/classes/player counts',()=>{
 const thresholds=[];
 for(const id of ['greyhaven','amber','tempest','glacier'])for(let difficulty=0;difficulty<4;difficulty++)for(const mode of ['time','versus']){
  const s=createRace({course:getCourse(id,difficulty),difficulty,mode,physics:'native'});
  const expected=read(s.nativeLaunch.snapshot().raceWords1f94[8]);
  assert.equal(s.raceWater.amplitudeThresholdNative,expected,`${id}/${difficulty}/${mode}`);
  assert.equal(s.nativeLaunch.waterAmplitudeThreshold(),expected);
  assert.equal(Object.getOwnPropertyDescriptor(s.raceWater,'amplitudeThresholdNative').get,s.nativeLaunch.waterAmplitudeThreshold);
  assert.throws(()=>s.raceWater.amplitudeThresholdNative=1,TypeError);
  if(id==='amber'&&difficulty===0)thresholds.push(expected);
 }
 assert.deepEqual(thresholds,[10390.365234375,48388.50390625]);
});

test('all nine Stunt hosts use the retained source threshold, including explicitly prepared histories',()=>{
 for(let courseIndex=0;courseIndex<9;courseIndex++){
  const f=stuntHostFixture(courseIndex),expected=read(f.runtime.snapshot().raceWords1f94[8]);
  assert.equal(f.water.amplitudeThresholdNative,expected);
  assert.throws(()=>bindRaceWaterAmplitudeThreshold(f.water,f.runtime.waterAmplitudeThreshold),/once/);
 }
 const f=stuntHostFixture(3,{patch:s=>s.raceWords1f94[8]=word(12345)});
 assert.equal(f.water.amplitudeThresholdNative,12345);
 f.step();assert.equal(f.water.amplitudeThresholdNative,12345);
});

test('original forcing confirms the solo threshold effect and that two-player forcing ignores it',()=>{
 const ref=JSON.parse(readFileSync(new URL('./fixtures/native-water-threshold-owner-reference.json',import.meta.url),'utf8'));
 const actual=[];
 for(const q of ref.cases){
  const c=q.input,plan=nativeWaterForcingPlan({...c,
   previousPatchCentersNative:c.previousPatchCentersNative.map(([xNative,zNative])=>({xNative,zNative})),
   camerasBeforeUpdate:c.horizontalForwards.map(horizontalForward=>({horizontalForward}))});
  const calls=plan.map(({xNative,zNative,amplitudeNative,period,advance})=>({xNative,zNative,amplitudeNative,period,advance}));
  assert.deepEqual(calls,q.sourceCalls);actual.push(calls);
 }
 assert.equal(stuntHostFixture(0).water.amplitudeThresholdNative,ref.cases[1].input.amplitudeThresholdNative);
 assert.equal(createRace({course:getCourse('amber'),mode:'versus',physics:'native'}).raceWater.amplitudeThresholdNative,ref.cases[3].input.amplitudeThresholdNative);
 assert.deepEqual(actual.slice(0,2).map(q=>q[0].amplitudeNative),[28,20]);
 assert.deepEqual(actual[2],actual[3],'the original two-player branch does not consume1FB4');
});
