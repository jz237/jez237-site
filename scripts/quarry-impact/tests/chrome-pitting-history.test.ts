import {restoreDanglersBytes} from './danglers-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChromePittingPrevious,restoreChromePittingBytes,verifyChromePittingRevision} from './chrome-pitting-invariants';
const source=(file:string)=>restoreDanglersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ChromePitting preserves every prior fixture, vehicle asset, venue art and history input',verifyChromePittingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/chrome-pitting/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChromePittingBytes(file,bytes),readChromePittingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChromePittingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChromePittingBytes('src/unknown.ts',unknown),unknown);
});
