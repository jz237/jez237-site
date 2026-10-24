import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDiagramRodFirePrevious,restoreDiagramRodFireBytes,verifyDiagramRodFireRevision} from './diagram-rod-fire-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DiagramRodFire preserves every prior fixture, vehicle asset, venue art and history input',verifyDiagramRodFireRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/diagram-rod-fire/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDiagramRodFireBytes(file,bytes),readDiagramRodFirePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDiagramRodFireBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDiagramRodFireBytes('src/unknown.ts',unknown),unknown);
});
