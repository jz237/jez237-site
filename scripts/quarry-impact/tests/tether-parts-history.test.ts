import {restoreHuntLeaderBytes} from './hunt-leader-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTetherPartsPrevious,restoreTetherPartsBytes,verifyTetherPartsRevision} from './tether-parts-invariants';
const source=(file:string)=>restoreHuntLeaderBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TetherParts preserves every prior fixture, vehicle asset, venue art and history input',verifyTetherPartsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tether-parts/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTetherPartsBytes(file,bytes),readTetherPartsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTetherPartsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTetherPartsBytes('src/unknown.ts',unknown),unknown);
});
