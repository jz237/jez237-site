import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWheelNutsPrevious,restoreWheelNutsBytes,verifyWheelNutsRevision} from './wheel-nuts-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WheelNuts preserves every prior fixture, vehicle asset, venue art and history input',verifyWheelNutsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wheel-nuts/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWheelNutsBytes(file,bytes),readWheelNutsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWheelNutsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWheelNutsBytes('src/unknown.ts',unknown),unknown);
});
