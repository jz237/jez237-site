import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGearboxDamagePrevious,restoreGearboxDamageBytes,verifyGearboxDamageRevision} from './gearbox-damage-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('GearboxDamage preserves every prior fixture, vehicle asset, venue art and history input',verifyGearboxDamageRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/gearbox-damage/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGearboxDamageBytes(file,bytes),readGearboxDamagePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGearboxDamageBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGearboxDamageBytes('src/unknown.ts',unknown),unknown);
});
