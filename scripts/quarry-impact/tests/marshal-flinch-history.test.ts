import {restoreBrakeSteamBytes} from './brake-steam-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMarshalFlinchPrevious,restoreMarshalFlinchBytes,verifyMarshalFlinchRevision} from './marshal-flinch-invariants';
const source=(file:string)=>restoreBrakeSteamBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MarshalFlinch preserves every prior fixture, vehicle asset, venue art and history input',verifyMarshalFlinchRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/marshal-flinch/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMarshalFlinchBytes(file,bytes),readMarshalFlinchPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMarshalFlinchBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMarshalFlinchBytes('src/unknown.ts',unknown),unknown);
});
