import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStuckHornPrevious,restoreStuckHornBytes,verifyStuckHornRevision} from './stuck-horn-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('StuckHorn preserves every prior fixture, vehicle asset, venue art and history input',verifyStuckHornRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/stuck-horn/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStuckHornBytes(file,bytes),readStuckHornPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStuckHornBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStuckHornBytes('src/unknown.ts',unknown),unknown);
});
