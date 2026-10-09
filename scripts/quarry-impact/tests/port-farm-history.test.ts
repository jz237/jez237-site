import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPortFarmPrevious,restorePortFarmBytes,verifyPortFarmRevision} from './port-farm-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('PortFarm preserves every prior fixture, vehicle asset, control and camera input',verifyPortFarmRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/port-farm/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePortFarmBytes(file,bytes),readPortFarmPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePortFarmBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePortFarmBytes('src/unknown.ts',unknown),unknown);
});
