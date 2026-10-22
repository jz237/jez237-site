import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTyreShredPrevious,restoreTyreShredBytes,verifyTyreShredRevision} from './tyre-shred-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TyreShred preserves every prior fixture, vehicle asset, venue art and history input',verifyTyreShredRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tyre-shred/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTyreShredBytes(file,bytes),readTyreShredPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTyreShredBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTyreShredBytes('src/unknown.ts',unknown),unknown);
});
