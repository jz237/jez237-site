import {restoreLeakyTyreBytes} from './leaky-tyre-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDeadBrakePrevious,restoreDeadBrakeBytes,verifyDeadBrakeRevision} from './dead-brake-invariants';
const source=(file:string)=>restoreLeakyTyreBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DeadBrake preserves every prior fixture, vehicle asset, venue art and history input',verifyDeadBrakeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/dead-brake/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDeadBrakeBytes(file,bytes),readDeadBrakePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDeadBrakeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDeadBrakeBytes('src/unknown.ts',unknown),unknown);
});
