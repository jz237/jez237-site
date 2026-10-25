import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPlayerHornPrevious,restorePlayerHornBytes,verifyPlayerHornRevision} from './player-horn-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PlayerHorn preserves every prior fixture, vehicle asset, venue art and history input',verifyPlayerHornRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/player-horn/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePlayerHornBytes(file,bytes),readPlayerHornPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePlayerHornBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePlayerHornBytes('src/unknown.ts',unknown),unknown);
});
