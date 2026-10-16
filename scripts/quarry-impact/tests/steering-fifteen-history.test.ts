import {restoreOnlineMorrowBytes} from './online-morrow-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSteeringFifteenPrevious,restoreSteeringFifteenBytes,verifySteeringFifteenRevision} from './steering-fifteen-invariants';
const source=(file:string)=>restoreOnlineMorrowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SteeringFifteen preserves every prior fixture, vehicle asset, control and camera input',verifySteeringFifteenRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/steering-fifteen/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSteeringFifteenBytes(file,bytes),readSteeringFifteenPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSteeringFifteenBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSteeringFifteenBytes('src/unknown.ts',unknown),unknown);
});
