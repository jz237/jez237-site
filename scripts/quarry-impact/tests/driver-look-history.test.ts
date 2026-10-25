import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDriverLookPrevious,restoreDriverLookBytes,verifyDriverLookRevision} from './driver-look-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DriverLook preserves every prior fixture, vehicle asset, venue art and history input',verifyDriverLookRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/driver-look/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDriverLookBytes(file,bytes),readDriverLookPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDriverLookBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDriverLookBytes('src/unknown.ts',unknown),unknown);
});
