import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHangingOnPrevious,restoreHangingOnBytes,verifyHangingOnRevision} from './hanging-on-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('HangingOn preserves every prior fixture, vehicle asset, venue art and history input',verifyHangingOnRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hanging-on/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHangingOnBytes(file,bytes),readHangingOnPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHangingOnBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHangingOnBytes('src/unknown.ts',unknown),unknown);
});
