import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOilSeizePrevious,restoreOilSeizeBytes,verifyOilSeizeRevision} from './oil-seize-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('OilSeize preserves every prior fixture, vehicle asset, venue art and history input',verifyOilSeizeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/oil-seize/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOilSeizeBytes(file,bytes),readOilSeizePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOilSeizeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOilSeizeBytes('src/unknown.ts',unknown),unknown);
});
