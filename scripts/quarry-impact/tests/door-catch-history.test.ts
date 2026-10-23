import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDoorCatchPrevious,restoreDoorCatchBytes,verifyDoorCatchRevision} from './door-catch-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DoorCatch preserves every prior fixture, vehicle asset, venue art and history input',verifyDoorCatchRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/door-catch/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDoorCatchBytes(file,bytes),readDoorCatchPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDoorCatchBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDoorCatchBytes('src/unknown.ts',unknown),unknown);
});
