import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readClutchSlipPrevious,restoreClutchSlipBytes,verifyClutchSlipRevision} from './clutch-slip-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ClutchSlip preserves every prior fixture, vehicle asset, venue art and history input',verifyClutchSlipRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/clutch-slip/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreClutchSlipBytes(file,bytes),readClutchSlipPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreClutchSlipBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreClutchSlipBytes('src/unknown.ts',unknown),unknown);
});
