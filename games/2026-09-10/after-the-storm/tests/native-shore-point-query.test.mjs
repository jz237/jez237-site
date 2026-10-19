import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {queryNativeShorePoint as query} from '../native-shore-contacts.js';
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-shore-point-query.json.gz',import.meta.url))));
const b=new DataView(new ArrayBuffer(4)),number=w=>{b.setUint32(0,w);return b.getFloat32(0);},bits=v=>{b.setFloat32(0,v);return b.getUint32(0);};
test('shore point probe matches original32-unit band, ordered candidates, grid bounds and normals',()=>{
 assert.equal(e.cases.length,1890);assert.equal(e.instructions,125651);const before=structuredClone(e.geometries);let hits=0;
 for(const [i,c]of e.cases.entries()){
  const [x,z]=c.positionWords.map(number),q=query({x,z},e.geometries[c.geometry]);
  assert.equal(bits(q.penetrationNative),c.depthWord,'shore case '+i);
  const stores=q.normalNative?['x','z'].map((k,component)=>({component,value:bits(q.normalNative[k])})):[];
  assert.deepEqual(stores,c.stores,'shore normal '+i);if(stores.length)hits++;
 }
 assert.ok(hits>0);assert.deepEqual(e.geometries,before);
});
test('shore probe leaves out-of-grid owners unread and keeps strict depth and segment boundaries',()=>{
 const g=e.geometries[0],one={...g,listBytes:[1,0]};
 assert.deepEqual(query({x:-129,z:0},{...g,listBytes:null,lines:null}),{penetrationNative:0,normalNative:null});
 for(const p of [{x:0,z:0},{x:-32,z:0},{x:-1,z:-64},{x:-1,z:64}])assert.equal(query(p,one).penetrationNative,0);
 assert.equal(query({x:-31.999,z:0},one).penetrationNative,Math.fround(31.999));
 assert.throws(()=>query({x:-1,z:0},{...g,listBytes:null}),/candidate byte/);
});
