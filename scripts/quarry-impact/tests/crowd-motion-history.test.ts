import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCrowdMotionPrevious,restoreCrowdMotionBytes,verifyCrowdMotionRevision} from './crowd-motion-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CrowdMotion preserves every prior fixture, vehicle asset, control and camera input',verifyCrowdMotionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/crowd-motion/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCrowdMotionBytes(file,bytes),readCrowdMotionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCrowdMotionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCrowdMotionBytes('src/unknown.ts',unknown),unknown);
});
