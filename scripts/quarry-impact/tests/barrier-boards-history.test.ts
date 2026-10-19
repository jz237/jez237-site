import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBarrierBoardsPrevious,restoreBarrierBoardsBytes,verifyBarrierBoardsRevision} from './barrier-boards-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BarrierBoards preserves every prior fixture, vehicle asset, venue art and history input',verifyBarrierBoardsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/barrier-boards/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBarrierBoardsBytes(file,bytes),readBarrierBoardsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBarrierBoardsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBarrierBoardsBytes('src/unknown.ts',unknown),unknown);
});
