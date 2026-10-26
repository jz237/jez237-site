import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLoopVoicesPrevious,restoreLoopVoicesBytes,verifyLoopVoicesRevision} from './loop-voices-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('LoopVoices preserves every prior fixture, vehicle asset, venue art and history input',verifyLoopVoicesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/loop-voices/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLoopVoicesBytes(file,bytes),readLoopVoicesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLoopVoicesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLoopVoicesBytes('src/unknown.ts',unknown),unknown);
});
