import {restoreFeedMomentsBytes} from './feed-moments-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWreckCausePrevious,restoreWreckCauseBytes,verifyWreckCauseRevision} from './wreck-cause-invariants';
const source=(file:string)=>restoreFeedMomentsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WreckCause preserves every prior fixture, vehicle asset, venue art and history input',verifyWreckCauseRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wreck-cause/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWreckCauseBytes(file,bytes),readWreckCausePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWreckCauseBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWreckCauseBytes('src/unknown.ts',unknown),unknown);
});
