import {restoreFreightSpeedBytes} from './freight-speed-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readElmsworthPrevious,restoreElmsworthBytes,verifyElmsworthRevision} from './elmsworth-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Elmsworth preserves every prior fixture, vehicle asset, control and camera input',verifyElmsworthRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/elmsworth/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreFreightSpeedBytes(file,source(file));assert.deepEqual(restoreElmsworthBytes(file,bytes),readElmsworthPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreElmsworthBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreElmsworthBytes('src/unknown.ts',unknown),unknown);
});
