import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFailureMomentsPrevious,restoreFailureMomentsBytes,verifyFailureMomentsRevision} from './failure-moments-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FailureMoments preserves every prior fixture, vehicle asset, venue art and history input',verifyFailureMomentsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/failure-moments/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFailureMomentsBytes(file,bytes),readFailureMomentsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFailureMomentsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFailureMomentsBytes('src/unknown.ts',unknown),unknown);
});
