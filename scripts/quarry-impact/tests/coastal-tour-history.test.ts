import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCoastalTourPrevious,restoreCoastalTourBytes,verifyCoastalTourRevision} from './coastal-tour-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CoastalTour preserves every prior fixture, vehicle asset, control and camera input',verifyCoastalTourRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/coastal-tour/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCoastalTourBytes(file,bytes),readCoastalTourPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCoastalTourBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCoastalTourBytes('src/unknown.ts',unknown),unknown);
});
