import {restorePowerSteeringBytes} from './power-steering-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrakeFluidPrevious,restoreBrakeFluidBytes,verifyBrakeFluidRevision} from './brake-fluid-invariants';
const source=(file:string)=>restorePowerSteeringBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BrakeFluid preserves every prior fixture, vehicle asset, venue art and history input',verifyBrakeFluidRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/brake-fluid/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrakeFluidBytes(file,bytes),readBrakeFluidPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrakeFluidBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrakeFluidBytes('src/unknown.ts',unknown),unknown);
});
