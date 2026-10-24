import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDamageLoopsPrevious,restoreDamageLoopsBytes,verifyDamageLoopsRevision} from './damage-loops-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DamageLoops preserves every prior fixture, vehicle asset, venue art and history input',verifyDamageLoopsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/damage-loops/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDamageLoopsBytes(file,bytes),readDamageLoopsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDamageLoopsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDamageLoopsBytes('src/unknown.ts',unknown),unknown);
});
