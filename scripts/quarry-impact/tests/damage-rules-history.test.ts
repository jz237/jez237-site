import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDamageRulesPrevious,restoreDamageRulesBytes,verifyDamageRulesRevision} from './damage-rules-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('DamageRules preserves every prior fixture, vehicle asset, control and camera input',verifyDamageRulesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/damage-rules/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDamageRulesBytes(file,bytes),readDamageRulesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDamageRulesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDamageRulesBytes('src/unknown.ts',unknown),unknown);
});
