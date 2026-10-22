import {restoreDeadCarBytes} from './dead-car-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPadDamagePrevious,restorePadDamageBytes,verifyPadDamageRevision} from './pad-damage-invariants';
const source=(file:string)=>restoreDeadCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PadDamage preserves every prior fixture, vehicle asset, venue art and history input',verifyPadDamageRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pad-damage/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePadDamageBytes(file,bytes),readPadDamagePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePadDamageBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePadDamageBytes('src/unknown.ts',unknown),unknown);
});
