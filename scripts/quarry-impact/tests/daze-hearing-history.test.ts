import {restoreFailureMomentsBytes} from './failure-moments-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDazeHearingPrevious,restoreDazeHearingBytes,verifyDazeHearingRevision} from './daze-hearing-invariants';
const source=(file:string)=>restoreFailureMomentsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DazeHearing preserves every prior fixture, vehicle asset, venue art and history input',verifyDazeHearingRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/daze-hearing/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDazeHearingBytes(file,bytes),readDazeHearingPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDazeHearingBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDazeHearingBytes('src/unknown.ts',unknown),unknown);
});
