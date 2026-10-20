import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWheelReachPrevious,restoreWheelReachBytes,verifyWheelReachRevision} from './wheel-reach-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WheelReach preserves every prior fixture, vehicle asset, venue art and history input',verifyWheelReachRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wheel-reach/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWheelReachBytes(file,bytes),readWheelReachPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWheelReachBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWheelReachBytes('src/unknown.ts',unknown),unknown);
});
