import {restoreReverseLightsBytes} from './reverse-lights-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSplashSoundPrevious,restoreSplashSoundBytes,verifySplashSoundRevision} from './splash-sound-invariants';
const source=(file:string)=>restoreReverseLightsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SplashSound preserves every prior fixture, vehicle asset, venue art and history input',verifySplashSoundRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/splash-sound/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSplashSoundBytes(file,bytes),readSplashSoundPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSplashSoundBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSplashSoundBytes('src/unknown.ts',unknown),unknown);
});
