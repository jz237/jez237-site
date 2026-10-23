import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDiagramBodyPrevious,restoreDiagramBodyBytes,verifyDiagramBodyRevision} from './diagram-body-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DiagramBody preserves every prior fixture, vehicle asset, venue art and history input',verifyDiagramBodyRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/diagram-body/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDiagramBodyBytes(file,bytes),readDiagramBodyPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDiagramBodyBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDiagramBodyBytes('src/unknown.ts',unknown),unknown);
});
