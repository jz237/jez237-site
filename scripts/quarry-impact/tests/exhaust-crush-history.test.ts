import {restoreRideUpBytes} from './ride-up-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExhaustCrushPrevious,restoreExhaustCrushBytes,verifyExhaustCrushRevision} from './exhaust-crush-invariants';
const source=(file:string)=>restoreRideUpBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ExhaustCrush preserves every prior fixture, vehicle asset, venue art and history input',verifyExhaustCrushRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/exhaust-crush/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExhaustCrushBytes(file,bytes),readExhaustCrushPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExhaustCrushBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExhaustCrushBytes('src/unknown.ts',unknown),unknown);
});
