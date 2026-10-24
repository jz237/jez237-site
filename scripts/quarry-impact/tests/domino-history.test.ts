import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDominoPrevious,restoreDominoBytes,verifyDominoRevision} from './domino-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Domino preserves every prior fixture, vehicle asset, venue art and history input',verifyDominoRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/domino/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDominoBytes(file,bytes),readDominoPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDominoBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDominoBytes('src/unknown.ts',unknown),unknown);
});
