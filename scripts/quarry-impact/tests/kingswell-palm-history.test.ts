import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readKingswellPalmPrevious,restoreKingswellPalmBytes,verifyKingswellPalmRevision} from './kingswell-palm-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('KingswellPalm preserves every prior fixture, vehicle asset, control and camera input',verifyKingswellPalmRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/kingswell-palm/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreKingswellPalmBytes(file,bytes),readKingswellPalmPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreKingswellPalmBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreKingswellPalmBytes('src/unknown.ts',unknown),unknown);
});
