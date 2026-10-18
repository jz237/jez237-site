import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareNativeSprayLevels,prepareNativeSprayMotion} from '../native-spray-levels.js';
import {createNativeHull,stepNativeHull} from '../native-hull.js';
const fixture=JSON.parse(readFileSync(new URL('./fixtures/native-spray-levels-reference.json',import.meta.url)));
test('579 original spray executions match camera gates, physical transitions and retained human levels',()=>{
 for(const [i,c]of fixture.cases.entries())assert.deepEqual(prepareNativeSprayLevels(c.previous,c.input),c.expected,'original case '+i);
});
test('80 original motion executions distinguish the per-tick physical reference from the outer-frame rider reference',()=>{
 for(const [i,c]of fixture.motions.entries())assert.deepEqual(prepareNativeSprayMotion(c.previous,c.input),c.expected,'motion case '+i);
});
test('actual hull ticks retain source reference motion and center displacement independently of render batching',()=>{
 const runs=[1,5].map(batch=>{
  const hull=createNativeHull({position:{x:2,y:3,z:4},velocity:{x:1,y:.2,z:3},heading:.4});
  assert.deepEqual(hull.sprayMotionNative.velocity,{x:0,y:0,z:0});
  for(let i=0;i<20/batch;i++)stepNativeHull(hull,batch*.01);
  return {motion:hull.sprayMotionNative,points:hull.points};
 });
 assert.deepEqual(runs[0],runs[1]);assert.ok(Object.values(runs[0].motion.centerVelocity).some(v=>v!==0));
});
test('spray levels retain both sides on gated frames instead of inventing quiet or new particles',()=>{
 const c=structuredClone(fixture.cases.find(c=>c.input.players===1&&c.input.position.z===100&&c.input.racerIndex===0));
 const p={...c.previous,left:97,right:73};
 c.input.cameraForward={x:0,y:0,z:-1};
 assert.deepEqual([prepareNativeSprayLevels(p,c.input).left,prepareNativeSprayLevels(p,c.input).right],[97,73]);
 c.input.cameraForward.z=1;c.input.position.y=50;
 assert.deepEqual([prepareNativeSprayLevels(p,c.input).left,prepareNativeSprayLevels(p,c.input).right],[97,73]);
});
test('source spray inputs are copied and missing physical/view state rejects',()=>{
 const c=structuredClone(fixture.cases[0]),before=structuredClone(c);
 prepareNativeSprayLevels(c.previous,c.input);assert.deepEqual(c,before);
 assert.throws(()=>prepareNativeSprayLevels(c.previous,{...c.input,cameraEye:null}));
 assert.throws(()=>prepareNativeSprayLevels(c.previous,{...c.input,referenceMotion:NaN}));
 assert.throws(()=>prepareNativeSprayLevels({...c.previous,left:undefined},c.input));
});
