import {restoreBarrierBoardsBytes} from './barrier-boards-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readKestrelRingPrevious,restoreKestrelRingBytes,verifyKestrelRingRevision} from './kestrel-ring-invariants';
const source=(file:string)=>restoreBarrierBoardsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('KestrelRing preserves every prior fixture, vehicle asset, arena and history input',verifyKestrelRingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/kestrel-ring/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreKestrelRingBytes(file,bytes),readKestrelRingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreKestrelRingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreKestrelRingBytes('src/unknown.ts',unknown),unknown);
});
