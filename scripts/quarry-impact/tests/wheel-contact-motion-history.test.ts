import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWheelContactMotionPrevious,restoreWheelContactMotionBytes,verifyWheelContactMotionRevision} from './wheel-contact-motion-invariants';
const source=(file:string)=>restoreFoundryIndustrialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WheelContactMotion preserves every prior fixture, vehicle asset, control and camera input',verifyWheelContactMotionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wheel-contact-motion/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWheelContactMotionBytes(file,bytes),readWheelContactMotionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWheelContactMotionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWheelContactMotionBytes('src/unknown.ts',unknown),unknown);
});

import {restoreFoundryIndustrialBytes} from './foundry-industrial-invariants';
