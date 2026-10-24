import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWreckByYouPrevious,restoreWreckByYouBytes,verifyWreckByYouRevision} from './wreck-by-you-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WreckByYou preserves every prior fixture, vehicle asset, venue art and history input',verifyWreckByYouRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wreck-by-you/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWreckByYouBytes(file,bytes),readWreckByYouPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWreckByYouBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWreckByYouBytes('src/unknown.ts',unknown),unknown);
});
