import {restoreCrowdSurgeBytes} from './crowd-surge-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAudioTargetsPrevious,restoreAudioTargetsBytes,verifyAudioTargetsRevision} from './audio-targets-invariants';
const source=(file:string)=>restoreCrowdSurgeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AudioTargets preserves every prior fixture, vehicle asset, venue art and history input',verifyAudioTargetsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/audio-targets/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAudioTargetsBytes(file,bytes),readAudioTargetsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAudioTargetsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAudioTargetsBytes('src/unknown.ts',unknown),unknown);
});
