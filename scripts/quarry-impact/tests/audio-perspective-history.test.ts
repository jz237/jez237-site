import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAudioPerspectivePrevious,restoreAudioPerspectiveBytes,verifyAudioPerspectiveRevision} from './audio-perspective-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AudioPerspective preserves every prior fixture, vehicle asset, control and camera input',verifyAudioPerspectiveRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/audio-perspective/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAudioPerspectiveBytes(file,bytes),readAudioPerspectivePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAudioPerspectiveBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAudioPerspectiveBytes('src/unknown.ts',unknown),unknown);
});
