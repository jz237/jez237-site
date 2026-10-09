import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDemolitionTourPrevious,restoreDemolitionTourBytes,verifyDemolitionTourRevision} from './demolition-tour-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DemolitionTour preserves every prior fixture, vehicle asset, control and camera input',verifyDemolitionTourRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/demolition-tour/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDemolitionTourBytes(file,bytes),readDemolitionTourPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDemolitionTourBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDemolitionTourBytes('src/unknown.ts',unknown),unknown);
});
