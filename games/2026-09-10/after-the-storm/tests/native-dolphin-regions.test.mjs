import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {nativeDolphinPositionBlocked as blocked} from '../native-dolphin-regions.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-regions.json.gz',import.meta.url))));
const bits=new DataView(new ArrayBuffer(4)),number=w=>{bits.setUint32(0,w);return bits.getFloat32(0);};

test('dolphin movement regions match complete original predicate and distance callees',()=>{
 assert.equal(evidence.cases.length,565);assert.equal(evidence.instructions,191401);
 const results=new Set();
 for(const [i,c]of evidence.cases.entries()){
  const [x,z]=c.positionWords.map(number),position=Object.freeze({x,z});
  const result=blocked(position);assert.equal(Number(result),c.inside,'original case '+i);results.add(result);
 }
 assert.equal(results.size,2);
});
test('dolphin region edge is strict and native coordinates reject invalid host inputs',()=>{
 assert.equal(blocked({x:-5290,z:-85}),false);
 assert.equal(blocked({x:-5289.999,z:-85}),true);
 for(const p of [null,{},[0,0],{x:'112',z:5108},{x:NaN,z:0},{x:0,z:Infinity},{x:Number.MAX_VALUE,z:0}])
  assert.throws(()=>blocked(p),/finite native dolphin XZ/);
});
