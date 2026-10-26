import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTorqueSteerPrevious,restoreTorqueSteerBytes,verifyTorqueSteerRevision} from './torque-steer-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('TorqueSteer preserves every prior fixture, vehicle asset, venue art and history input',verifyTorqueSteerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/torque-steer/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTorqueSteerBytes(file,bytes),readTorqueSteerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTorqueSteerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTorqueSteerBytes('src/unknown.ts',unknown),unknown);
});
