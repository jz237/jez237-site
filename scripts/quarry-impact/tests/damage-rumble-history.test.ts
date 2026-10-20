import {restoreSlowPunctureBytes} from './slow-puncture-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readDamageRumblePrevious,restoreDamageRumbleBytes,verifyDamageRumbleRevision} from './damage-rumble-invariants';
const source=(file:string)=>restoreSlowPunctureBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('DamageRumble preserves every prior fixture, vehicle asset, venue art and history input',verifyDamageRumbleRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/damage-rumble/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreDamageRumbleBytes(file,bytes),readDamageRumblePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreDamageRumbleBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreDamageRumbleBytes('src/unknown.ts',unknown),unknown);
});
