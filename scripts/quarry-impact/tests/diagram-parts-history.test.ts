import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDiagramPartsPrevious,restoreDiagramPartsBytes,verifyDiagramPartsRevision} from './diagram-parts-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DiagramParts preserves every prior fixture, vehicle asset, venue art and history input',verifyDiagramPartsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/diagram-parts/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDiagramPartsBytes(file,bytes),readDiagramPartsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDiagramPartsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDiagramPartsBytes('src/unknown.ts',unknown),unknown);
});
