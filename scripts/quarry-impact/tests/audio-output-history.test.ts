import {restoreSableButtressesBytes} from './sable-buttresses-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAudioOutputPrevious,restoreAudioOutputBytes,verifyAudioOutputRevision} from './audio-output-invariants';
const source=(file:string)=>restoreSableButtressesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AudioOutput preserves every prior fixture, vehicle asset, control and camera input',verifyAudioOutputRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/audio-output/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAudioOutputBytes(file,bytes),readAudioOutputPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAudioOutputBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAudioOutputBytes('src/unknown.ts',unknown),unknown);
});
