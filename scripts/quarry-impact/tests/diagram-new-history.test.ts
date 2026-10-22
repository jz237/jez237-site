import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDiagramNewPrevious,restoreDiagramNewBytes,verifyDiagramNewRevision} from './diagram-new-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DiagramNew preserves every prior fixture, vehicle asset, venue art and history input',verifyDiagramNewRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/diagram-new/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDiagramNewBytes(file,bytes),readDiagramNewPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDiagramNewBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDiagramNewBytes('src/unknown.ts',unknown),unknown);
});
