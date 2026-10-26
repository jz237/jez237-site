import {restoreWheelBlurBytes} from './wheel-blur-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTiredSuspensionPrevious,restoreTiredSuspensionBytes,verifyTiredSuspensionRevision} from './tired-suspension-invariants';
const source=(file:string)=>restoreWheelBlurBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TiredSuspension preserves every prior fixture, vehicle asset, venue art and history input',verifyTiredSuspensionRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tired-suspension/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTiredSuspensionBytes(file,bytes),readTiredSuspensionPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTiredSuspensionBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTiredSuspensionBytes('src/unknown.ts',unknown),unknown);
});
