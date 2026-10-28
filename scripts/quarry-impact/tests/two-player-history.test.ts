import {restoreSoftDustBytes} from './soft-dust-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTwoPlayerPrevious,restoreTwoPlayerBytes,verifyTwoPlayerRevision} from './two-player-invariants';
const source=(file:string)=>restoreSoftDustBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TwoPlayer preserves every prior fixture, vehicle asset, venue art and history input',verifyTwoPlayerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/two-player/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTwoPlayerBytes(file,bytes),readTwoPlayerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTwoPlayerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTwoPlayerBytes('src/unknown.ts',unknown),unknown);
});
