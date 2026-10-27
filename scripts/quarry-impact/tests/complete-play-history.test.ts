import {restoreTwoPlayerBytes} from './two-player-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCompletePlayPrevious,restoreCompletePlayBytes,verifyCompletePlayRevision} from './complete-play-invariants';
const source=(file:string)=>restoreTwoPlayerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CompletePlay preserves every prior fixture, vehicle asset, venue art and history input',verifyCompletePlayRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/complete-play/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCompletePlayBytes(file,bytes),readCompletePlayPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCompletePlayBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCompletePlayBytes('src/unknown.ts',unknown),unknown);
});
