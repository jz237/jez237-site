import {restoreRearSlideBytes} from './rear-slide-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPitSpinPrevious,restorePitSpinBytes,verifyPitSpinRevision} from './pit-spin-invariants';
const source=(file:string)=>restoreRearSlideBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PitSpin preserves every prior fixture, vehicle asset, venue art and history input',verifyPitSpinRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pit-spin/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePitSpinBytes(file,bytes),readPitSpinPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePitSpinBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePitSpinBytes('src/unknown.ts',unknown),unknown);
});
