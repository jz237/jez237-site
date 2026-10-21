import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWetFiresPrevious,restoreWetFiresBytes,verifyWetFiresRevision} from './wet-fires-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WetFires preserves every prior fixture, vehicle asset, venue art and history input',verifyWetFiresRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wet-fires/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWetFiresBytes(file,bytes),readWetFiresPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWetFiresBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWetFiresBytes('src/unknown.ts',unknown),unknown);
});
