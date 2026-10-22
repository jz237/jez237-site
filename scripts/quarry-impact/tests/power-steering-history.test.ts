import {restoreExhaustDragBytes} from './exhaust-drag-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPowerSteeringPrevious,restorePowerSteeringBytes,verifyPowerSteeringRevision} from './power-steering-invariants';
const source=(file:string)=>restoreExhaustDragBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PowerSteering preserves every prior fixture, vehicle asset, venue art and history input',verifyPowerSteeringRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/power-steering/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePowerSteeringBytes(file,bytes),readPowerSteeringPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePowerSteeringBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePowerSteeringBytes('src/unknown.ts',unknown),unknown);
});
