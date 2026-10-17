import {restoreReplayPuddlesBytes} from './replay-puddles-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCircuitArcSteeringPrevious,restoreCircuitArcSteeringBytes,verifyCircuitArcSteeringRevision} from './circuit-arc-steering-invariants';
const source=(file:string)=>restoreReplayPuddlesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CircuitArcSteering preserves every prior fixture, vehicle asset, control and camera input',verifyCircuitArcSteeringRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/circuit-arc-steering/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCircuitArcSteeringBytes(file,bytes),readCircuitArcSteeringPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCircuitArcSteeringBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCircuitArcSteeringBytes('src/unknown.ts',unknown),unknown);
});
