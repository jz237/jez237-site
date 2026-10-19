import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {evaluateNativeCameraSpline as spline,prepareNativeCameraPathSample as sample} from '../native-camera-path.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/native-camera-path.json',import.meta.url)));
const b=new DataView(new ArrayBuffer(4)),word=v=>{b.setFloat32(0,v);return b.getUint32(0);};
test('all five camera spline span types match complete original numeric execution',()=>{
 assert.equal(source.splines.length,1404);
 for(const c of source.splines)assert.equal(word(spline(c.input)),c.resultWord,JSON.stringify(c.input));
});
test('scalar and XYZ path samples match original writes, zero-span skips and signed frame rollover',()=>{
 assert.equal(source.samples.length,384);
 for(const c of source.samples){
  const before=structuredClone(c.input),q=sample(c.input);
  assert.deepEqual(q.operations,c.operations);assert.deepEqual(q.outputWords,c.outputWords);assert.deepEqual(q.stateWords,c.stateWords);
  assert.deepEqual(c.input,before);assert.ok(Object.isFrozen(q.operations));
 }
});
test('a full path samples every timed span then stops without silently looping',()=>{
 let state={frame:0,segment:0};const durations=[0,3,2,4],channels=[[0,10,20,30,50,60,80]];let frames=0;
 while(state.segment!==-1){state=sample({...state,durations,channels});frames++;assert.ok(frames<20);}
 assert.equal(frames,9);assert.equal(state.frame,0);assert.throws(()=>sample({...state,durations,channels}),/segment/);
});
test('invalid path resources fail without changing the caller state',()=>{
 const input={frame:0,segment:0,channels:[[0,1,2,3]],durations:[0]},before=structuredClone(input);
 assert.throws(()=>sample(input),/no remaining timed span/);assert.deepEqual(input,before);
 assert.throws(()=>spline({t:0,segment:0,points:[0,1,Infinity,3]}),/finite/);
 assert.throws(()=>sample({...input,durations:[-1]}),/duration/);
 assert.throws(()=>sample({...input,channels:[[1,2,3,4],[1,2,3,4]]}),/scalar or XYZ/);
});
