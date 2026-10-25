import {restoreRainSprayBytes} from './rain-spray-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWetCarsPrevious,restoreWetCarsBytes,verifyWetCarsRevision} from './wet-cars-invariants';
const source=(file:string)=>restoreRainSprayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WetCars preserves every prior fixture, vehicle asset, venue art and history input',verifyWetCarsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wet-cars/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWetCarsBytes(file,bytes),readWetCarsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWetCarsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWetCarsBytes('src/unknown.ts',unknown),unknown);
});
