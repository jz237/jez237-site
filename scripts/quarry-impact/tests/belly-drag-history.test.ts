import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBellyDragPrevious,restoreBellyDragBytes,verifyBellyDragRevision} from './belly-drag-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BellyDrag preserves every prior fixture, vehicle asset, venue art and history input',verifyBellyDragRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/belly-drag/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBellyDragBytes(file,bytes),readBellyDragPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBellyDragBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBellyDragBytes('src/unknown.ts',unknown),unknown);
});
