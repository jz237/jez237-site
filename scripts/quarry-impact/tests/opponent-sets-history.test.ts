import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOpponentSetsPrevious,restoreOpponentSetsBytes,verifyOpponentSetsRevision} from './opponent-sets-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('OpponentSets preserves every prior fixture, vehicle asset, control and camera input',verifyOpponentSetsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/opponent-sets/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOpponentSetsBytes(file,bytes),readOpponentSetsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOpponentSetsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOpponentSetsBytes('src/unknown.ts',unknown),unknown);
});
