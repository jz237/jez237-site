import {restoreSplashSoundBytes} from './splash-sound-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readLensSplashPrevious,restoreLensSplashBytes,verifyLensSplashRevision} from './lens-splash-invariants';
const source=(file:string)=>restoreSplashSoundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('LensSplash preserves every prior fixture, vehicle asset, venue art and history input',verifyLensSplashRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/lens-splash/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreLensSplashBytes(file,bytes),readLensSplashPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreLensSplashBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreLensSplashBytes('src/unknown.ts',unknown),unknown);
});
