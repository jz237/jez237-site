import {restoreTyreRubBytes} from './tyre-rub-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDoorSwingPrevious,restoreDoorSwingBytes,verifyDoorSwingRevision} from './door-swing-invariants';
const source=(file:string)=>restoreTyreRubBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DoorSwing preserves every prior fixture, vehicle asset, venue art and history input',verifyDoorSwingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/door-swing/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDoorSwingBytes(file,bytes),readDoorSwingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDoorSwingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDoorSwingBytes('src/unknown.ts',unknown),unknown);
});
