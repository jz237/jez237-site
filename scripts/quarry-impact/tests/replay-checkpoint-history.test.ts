import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReplayCheckpointPrevious,restoreReplayCheckpointBytes,verifyReplayCheckpointRevision} from './replay-checkpoint-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ReplayCheckpoint preserves every prior fixture, vehicle asset, control and camera input',verifyReplayCheckpointRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/replay-checkpoint/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReplayCheckpointBytes(file,bytes),readReplayCheckpointPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReplayCheckpointBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReplayCheckpointBytes('src/unknown.ts',unknown),unknown);
});
