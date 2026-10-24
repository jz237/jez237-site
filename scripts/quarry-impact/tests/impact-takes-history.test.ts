import {restoreDamageLoopsBytes} from './damage-loops-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readImpactTakesPrevious,restoreImpactTakesBytes,verifyImpactTakesRevision} from './impact-takes-invariants';
const source=(file:string)=>restoreDamageLoopsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ImpactTakes preserves every prior fixture, vehicle asset, venue art and history input',verifyImpactTakesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/impact-takes/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreImpactTakesBytes(file,bytes),readImpactTakesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreImpactTakesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreImpactTakesBytes('src/unknown.ts',unknown),unknown);
});
