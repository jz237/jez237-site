import {restoreWheelReachBytes} from './wheel-reach-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readExtendedDamagePrevious,restoreExtendedDamageBytes,verifyExtendedDamageRevision} from './extended-damage-invariants';
const source=(file:string)=>restoreWheelReachBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ExtendedDamage preserves every prior fixture, vehicle asset, venue art and history input',verifyExtendedDamageRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/extended-damage/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreExtendedDamageBytes(file,bytes),readExtendedDamagePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreExtendedDamageBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreExtendedDamageBytes('src/unknown.ts',unknown),unknown);
});
