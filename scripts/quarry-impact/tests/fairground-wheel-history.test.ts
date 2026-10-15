import {restoreFairgroundMidwayBytes} from './fairground-midway-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFairgroundWheelPrevious,restoreFairgroundWheelBytes,verifyFairgroundWheelRevision} from './fairground-wheel-invariants';
const source=(file:string)=>restoreFairgroundMidwayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('FairgroundWheel preserves every prior fixture, vehicle asset, control and camera input',verifyFairgroundWheelRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fairground-wheel/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFairgroundWheelBytes(file,bytes),readFairgroundWheelPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFairgroundWheelBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFairgroundWheelBytes('src/unknown.ts',unknown),unknown);
});
