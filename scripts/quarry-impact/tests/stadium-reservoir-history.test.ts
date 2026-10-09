import {restoreTrailBytes} from './trail-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStadiumReservoirPrevious,restoreStadiumReservoirBytes,verifyStadiumReservoirRevision} from './stadium-reservoir-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('StadiumReservoir preserves every prior fixture, vehicle asset, control and camera input',verifyStadiumReservoirRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/stadium-reservoir/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreTrailBytes(file,source(file));assert.deepEqual(restoreStadiumReservoirBytes(file,bytes),readStadiumReservoirPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStadiumReservoirBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStadiumReservoirBytes('src/unknown.ts',unknown),unknown);
});
