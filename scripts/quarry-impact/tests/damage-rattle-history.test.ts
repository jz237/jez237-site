import {restoreLeakHudBytes} from './leak-hud-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDamageRattlePrevious,restoreDamageRattleBytes,verifyDamageRattleRevision} from './damage-rattle-invariants';
const source=(file:string)=>restoreLeakHudBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DamageRattle preserves every prior fixture, vehicle asset, venue art and history input',verifyDamageRattleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/damage-rattle/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDamageRattleBytes(file,bytes),readDamageRattlePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDamageRattleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDamageRattleBytes('src/unknown.ts',unknown),unknown);
});
