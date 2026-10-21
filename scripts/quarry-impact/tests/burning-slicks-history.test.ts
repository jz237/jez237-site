import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBurningSlicksPrevious,restoreBurningSlicksBytes,verifyBurningSlicksRevision} from './burning-slicks-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BurningSlicks preserves every prior fixture, vehicle asset, venue art and history input',verifyBurningSlicksRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/burning-slicks/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBurningSlicksBytes(file,bytes),readBurningSlicksPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBurningSlicksBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBurningSlicksBytes('src/unknown.ts',unknown),unknown);
});
