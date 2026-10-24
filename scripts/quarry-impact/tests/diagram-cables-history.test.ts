import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDiagramCablesPrevious,restoreDiagramCablesBytes,verifyDiagramCablesRevision} from './diagram-cables-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DiagramCables preserves every prior fixture, vehicle asset, venue art and history input',verifyDiagramCablesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/diagram-cables/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDiagramCablesBytes(file,bytes),readDiagramCablesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDiagramCablesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDiagramCablesBytes('src/unknown.ts',unknown),unknown);
});
