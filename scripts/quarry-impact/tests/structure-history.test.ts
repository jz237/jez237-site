import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStructurePrevious,restoreStructureBytes,verifyStructureRevision} from './structure-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Structure preserves every prior fixture, vehicle asset, control and camera input',verifyStructureRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/structure/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStructureBytes(file,bytes),readStructurePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStructureBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStructureBytes('src/unknown.ts',unknown),unknown);
});
