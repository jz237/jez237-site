import {restoreCircuitArcSteeringBytes} from './circuit-arc-steering-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWrenfordClearancePrevious,restoreWrenfordClearanceBytes,verifyWrenfordClearanceRevision} from './wrenford-clearance-invariants';
const source=(file:string)=>restoreCircuitArcSteeringBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WrenfordClearance preserves every prior fixture, vehicle asset, control and camera input',verifyWrenfordClearanceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wrenford-clearance/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWrenfordClearanceBytes(file,bytes),readWrenfordClearancePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWrenfordClearanceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWrenfordClearanceBytes('src/unknown.ts',unknown),unknown);
});
