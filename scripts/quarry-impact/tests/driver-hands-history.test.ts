import {restoreRainFireBytes} from './rain-fire-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDriverHandsPrevious,restoreDriverHandsBytes,verifyDriverHandsRevision} from './driver-hands-invariants';
const source=(file:string)=>restoreRainFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DriverHands preserves every prior fixture, vehicle asset, venue art and history input',verifyDriverHandsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driver-hands/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDriverHandsBytes(file,bytes),readDriverHandsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDriverHandsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDriverHandsBytes('src/unknown.ts',unknown),unknown);
});
