import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readArmorWearPrevious,restoreArmorWearBytes,verifyArmorWearRevision} from './armor-wear-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ArmorWear preserves every prior fixture, vehicle asset, control and camera input',verifyArmorWearRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/armor-wear/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreSteeringEightBytes(file,source(file));assert.deepEqual(restoreArmorWearBytes(file,bytes),readArmorWearPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreArmorWearBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreArmorWearBytes('src/unknown.ts',unknown),unknown);
});

import {restoreSteeringEightBytes} from './steering-eight-invariants';
