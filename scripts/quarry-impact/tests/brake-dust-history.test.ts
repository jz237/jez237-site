import {restoreAgeRustBytes} from './age-rust-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBrakeDustPrevious,restoreBrakeDustBytes,verifyBrakeDustRevision} from './brake-dust-invariants';
const source=(file:string)=>restoreAgeRustBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BrakeDust preserves every prior fixture, vehicle asset, venue art and history input',verifyBrakeDustRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/brake-dust/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBrakeDustBytes(file,bytes),readBrakeDustPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBrakeDustBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBrakeDustBytes('src/unknown.ts',unknown),unknown);
});
