import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {nativeDolphinPositionBlocked} from '../native-dolphin-regions.js';
const inside=(x,z)=>nativeDolphinPositionBlocked({x,z});
const e=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-dolphin-region-boundaries.json.gz',import.meta.url))));
const b=new DataView(new ArrayBuffer(4)),number=w=>{b.setUint32(0,w);return b.getFloat32(0);};
test('dolphin course regions match original strict radius queries at every boundary',()=>{
 assert.equal(e.cases.length,360);assert.equal(e.instructions,112572);
 for(const [i,c]of e.cases.entries())assert.equal(inside(number(c.xWord),number(c.zWord)),c.inside,'region case '+i);
 for(const [x,z]of e.regions)assert.equal(inside(x,z),true);
 assert.equal(inside(1e10,-1e10),false);assert.throws(()=>inside(NaN,0),/finite/);
});
