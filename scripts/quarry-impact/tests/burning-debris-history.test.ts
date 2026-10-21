import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBurningDebrisPrevious,restoreBurningDebrisBytes,verifyBurningDebrisRevision} from './burning-debris-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BurningDebris preserves every prior fixture, vehicle asset, venue art and history input',verifyBurningDebrisRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/burning-debris/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBurningDebrisBytes(file,bytes),readBurningDebrisPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBurningDebrisBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBurningDebrisBytes('src/unknown.ts',unknown),unknown);
});
