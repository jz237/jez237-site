import {restoreWeightGroanBytes} from './weight-groan-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRideUpPrevious,restoreRideUpBytes,verifyRideUpRevision} from './ride-up-invariants';
const source=(file:string)=>restoreWeightGroanBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RideUp preserves every prior fixture, vehicle asset, venue art and history input',verifyRideUpRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ride-up/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRideUpBytes(file,bytes),readRideUpPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRideUpBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRideUpBytes('src/unknown.ts',unknown),unknown);
});
