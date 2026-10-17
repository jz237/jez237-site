import {restoreReplayFireBytes} from './replay-fire-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReplayBurstPrevious,restoreReplayBurstBytes,verifyReplayBurstRevision} from './replay-burst-invariants';
const source=(file:string)=>restoreReplayFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReplayBurst preserves every prior fixture, vehicle asset, control and camera input',verifyReplayBurstRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/replay-burst/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReplayBurstBytes(file,bytes),readReplayBurstPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReplayBurstBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReplayBurstBytes('src/unknown.ts',unknown),unknown);
});
