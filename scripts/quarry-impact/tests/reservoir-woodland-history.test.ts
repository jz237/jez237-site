import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReservoirWoodlandPrevious,restoreReservoirWoodlandBytes,verifyReservoirWoodlandRevision} from './reservoir-woodland-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ReservoirWoodland preserves every prior fixture, vehicle asset, control and camera input',verifyReservoirWoodlandRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/reservoir-woodland/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReservoirWoodlandBytes(file,bytes),readReservoirWoodlandPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReservoirWoodlandBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReservoirWoodlandBytes('src/unknown.ts',unknown),unknown);
});
