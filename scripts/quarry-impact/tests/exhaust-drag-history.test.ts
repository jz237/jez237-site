import {restoreThrottleJamBytes} from './throttle-jam-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExhaustDragPrevious,restoreExhaustDragBytes,verifyExhaustDragRevision} from './exhaust-drag-invariants';
const source=(file:string)=>restoreThrottleJamBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ExhaustDrag preserves every prior fixture, vehicle asset, venue art and history input',verifyExhaustDragRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/exhaust-drag/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExhaustDragBytes(file,bytes),readExhaustDragPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExhaustDragBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExhaustDragBytes('src/unknown.ts',unknown),unknown);
});
