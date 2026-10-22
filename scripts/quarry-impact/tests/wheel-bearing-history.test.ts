import {restoreSteerSkewBytes} from './steer-skew-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWheelBearingPrevious,restoreWheelBearingBytes,verifyWheelBearingRevision} from './wheel-bearing-invariants';
const source=(file:string)=>restoreSteerSkewBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WheelBearing preserves every prior fixture, vehicle asset, venue art and history input',verifyWheelBearingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wheel-bearing/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWheelBearingBytes(file,bytes),readWheelBearingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWheelBearingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWheelBearingBytes('src/unknown.ts',unknown),unknown);
});
