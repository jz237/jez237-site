import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {prepareNativeFrameKinematics as prepare} from '../native-frame-kinematics.js';
const evidence=JSON.parse(gunzipSync(readFileSync(new URL('./fixtures/native-frame-kinematics.json.gz',import.meta.url))));

test('post-hull movement, reference histories and contact drive match original instructions and every write',()=>{
 for(const [i,c]of evidence.cases.entries()){
  const before=structuredClone(c),q=prepare(c.previous,c.input);assert.deepEqual(q.state,c.state,'state '+i);assert.deepEqual(q.bodyWordWrites,c.bodyWordWrites,'writes '+i);assert.deepEqual(c,before);
 }
});

test('held simulation retains motion histories but still uses engine mask for contact-drive counting',()=>{
 const c=evidence.cases.find(c=>c.input.simulation648===0&&c.input.floorImpactNative===1&&c.input.engineMaskC66!==0&&c.previous.speedNative===0),a={...c.input};
 delete a.positionNative;delete a.priorPositionNative;delete a.upNative;delete a.forwardNative;
 const q=prepare(c.previous,a);assert.equal(q.state.contactDriveFrames,c.previous.contactDriveFrames+1);assert.equal(q.bodyWordWrites.length,1);
 assert.deepEqual({...q.state,contactDriveFrames:c.previous.contactDriveFrames},c.previous);
 assert.equal(prepare(c.previous,{...a,engineMaskC66:0,throttle:1}).state.contactDriveFrames,0);
});

test('a late invalid orientation cannot commit earlier movement or contact-drive writes',()=>{
 const c=evidence.cases.find(c=>c.input.simulation648!==0),a=structuredClone(c.input);a.forwardNative.z=NaN;const before=structuredClone(c.previous);
 assert.throws(()=>prepare(c.previous,a),/forward/);assert.deepEqual(c.previous,before);
});
