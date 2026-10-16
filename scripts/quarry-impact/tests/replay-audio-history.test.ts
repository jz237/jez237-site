import {restoreReplayImpactAudioBytes} from './replay-impact-audio-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReplayAudioPrevious,restoreReplayAudioBytes,verifyReplayAudioRevision} from './replay-audio-invariants';
const source=(file:string)=>restoreReplayImpactAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ReplayAudio preserves every prior fixture, vehicle asset, control and camera input',verifyReplayAudioRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/replay-audio/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReplayAudioBytes(file,bytes),readReplayAudioPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReplayAudioBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReplayAudioBytes('src/unknown.ts',unknown),unknown);
});
