import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCollisionSearchPrevious,restoreCollisionSearchBytes,verifyCollisionSearchRevision} from './collision-search-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('collision search preserves every prior fixture, vehicle asset, control and camera input',verifyCollisionSearchRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/collision-search/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCollisionSearchBytes(file,bytes),readCollisionSearchPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCollisionSearchBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCollisionSearchBytes('src/unknown.ts',unknown),unknown);
});
