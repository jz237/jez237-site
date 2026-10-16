import {restoreChaseAIBytes} from './chase-ai-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChaseUIPrevious,restoreChaseUIBytes,verifyChaseUIRevision} from './chase-ui-invariants';
const source=(file:string)=>restoreChaseAIBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ChaseUI preserves every prior fixture, vehicle asset, control and camera input',verifyChaseUIRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/chase-ui/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChaseUIBytes(file,bytes),readChaseUIPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChaseUIBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChaseUIBytes('src/unknown.ts',unknown),unknown);
});
