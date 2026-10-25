import {restoreMarshalFlinchBytes} from './marshal-flinch-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMarshalFlagsPrevious,restoreMarshalFlagsBytes,verifyMarshalFlagsRevision} from './marshal-flags-invariants';
const source=(file:string)=>restoreMarshalFlinchBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MarshalFlags preserves every prior fixture, vehicle asset, venue art and history input',verifyMarshalFlagsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/marshal-flags/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMarshalFlagsBytes(file,bytes),readMarshalFlagsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMarshalFlagsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMarshalFlagsBytes('src/unknown.ts',unknown),unknown);
});
