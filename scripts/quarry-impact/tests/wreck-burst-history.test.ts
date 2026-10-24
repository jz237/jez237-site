import {restoreWindRainBytes} from './wind-rain-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWreckBurstPrevious,restoreWreckBurstBytes,verifyWreckBurstRevision} from './wreck-burst-invariants';
const source=(file:string)=>restoreWindRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WreckBurst preserves every prior fixture, vehicle asset, venue art and history input',verifyWreckBurstRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wreck-burst/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWreckBurstBytes(file,bytes),readWreckBurstPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWreckBurstBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWreckBurstBytes('src/unknown.ts',unknown),unknown);
});
