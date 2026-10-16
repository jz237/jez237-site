import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readReplayImpactAudioPrevious,restoreReplayImpactAudioBytes,verifyReplayImpactAudioRevision} from './replay-impact-audio-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ReplayImpactAudio preserves every prior fixture, vehicle asset, control and camera input',verifyReplayImpactAudioRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/replay-impact-audio/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreReplayImpactAudioBytes(file,bytes),readReplayImpactAudioPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreReplayImpactAudioBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreReplayImpactAudioBytes('src/unknown.ts',unknown),unknown);
});
