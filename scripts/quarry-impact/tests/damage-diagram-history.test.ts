import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDamageDiagramPrevious,restoreDamageDiagramBytes,verifyDamageDiagramRevision} from './damage-diagram-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DamageDiagram preserves every prior fixture, vehicle asset, venue art and history input',verifyDamageDiagramRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/damage-diagram/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDamageDiagramBytes(file,bytes),readDamageDiagramPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDamageDiagramBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDamageDiagramBytes('src/unknown.ts',unknown),unknown);
});
