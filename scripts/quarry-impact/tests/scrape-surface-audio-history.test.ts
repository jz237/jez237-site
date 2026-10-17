import {restoreAudioOutputBytes} from './audio-output-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readScrapeSurfaceAudioPrevious,restoreScrapeSurfaceAudioBytes,verifyScrapeSurfaceAudioRevision} from './scrape-surface-audio-invariants';
const source=(file:string)=>restoreAudioOutputBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ScrapeSurfaceAudio preserves every prior fixture, vehicle asset, control and camera input',verifyScrapeSurfaceAudioRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/scrape-surface-audio/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreScrapeSurfaceAudioBytes(file,bytes),readScrapeSurfaceAudioPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreScrapeSurfaceAudioBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreScrapeSurfaceAudioBytes('src/unknown.ts',unknown),unknown);
});
