import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readShiftSmokePrevious,restoreShiftSmokeBytes,verifyShiftSmokeRevision} from './shift-smoke-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ShiftSmoke preserves every prior fixture, vehicle asset, venue art and history input',verifyShiftSmokeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/shift-smoke/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreShiftSmokeBytes(file,bytes),readShiftSmokePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreShiftSmokeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreShiftSmokeBytes('src/unknown.ts',unknown),unknown);
});
