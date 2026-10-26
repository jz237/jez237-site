import {restoreSunFadeBytes} from './sun-fade-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAgeRustPrevious,restoreAgeRustBytes,verifyAgeRustRevision} from './age-rust-invariants';
const source=(file:string)=>restoreSunFadeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AgeRust preserves every prior fixture, vehicle asset, venue art and history input',verifyAgeRustRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/age-rust/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAgeRustBytes(file,bytes),readAgeRustPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAgeRustBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAgeRustBytes('src/unknown.ts',unknown),unknown);
});
