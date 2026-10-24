import {restoreRollPopBytes} from './roll-pop-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPinSlamAwardsPrevious,restorePinSlamAwardsBytes,verifyPinSlamAwardsRevision} from './pin-slam-awards-invariants';
const source=(file:string)=>restoreRollPopBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PinSlamAwards preserves every prior fixture, vehicle asset, venue art and history input',verifyPinSlamAwardsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pin-slam-awards/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePinSlamAwardsBytes(file,bytes),readPinSlamAwardsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePinSlamAwardsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePinSlamAwardsBytes('src/unknown.ts',unknown),unknown);
});
