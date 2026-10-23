import {restoreBootLidBytes} from './boot-lid-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRearSlidePrevious,restoreRearSlideBytes,verifyRearSlideRevision} from './rear-slide-invariants';
const source=(file:string)=>restoreBootLidBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RearSlide preserves every prior fixture, vehicle asset, venue art and history input',verifyRearSlideRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rear-slide/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRearSlideBytes(file,bytes),readRearSlidePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRearSlideBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRearSlideBytes('src/unknown.ts',unknown),unknown);
});
