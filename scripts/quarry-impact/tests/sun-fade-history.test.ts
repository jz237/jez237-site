import {restoreRottenShellsBytes} from './rotten-shells-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSunFadePrevious,restoreSunFadeBytes,verifySunFadeRevision} from './sun-fade-invariants';
const source=(file:string)=>restoreRottenShellsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SunFade preserves every prior fixture, vehicle asset, venue art and history input',verifySunFadeRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/sun-fade/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSunFadeBytes(file,bytes),readSunFadePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSunFadeBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSunFadeBytes('src/unknown.ts',unknown),unknown);
});
