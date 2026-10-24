import {restoreImpactTakesBytes} from './impact-takes-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDestructionAudioPrevious,restoreDestructionAudioBytes,verifyDestructionAudioRevision} from './destruction-audio-invariants';
const source=(file:string)=>restoreImpactTakesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DestructionAudio preserves every prior fixture, vehicle asset, venue art and history input',verifyDestructionAudioRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/destruction-audio/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDestructionAudioBytes(file,bytes),readDestructionAudioPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDestructionAudioBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDestructionAudioBytes('src/unknown.ts',unknown),unknown);
});
