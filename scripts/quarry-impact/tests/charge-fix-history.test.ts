import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChargeFixPrevious,restoreChargeFixBytes,verifyChargeFixRevision} from './charge-fix-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ChargeFix preserves every prior fixture, vehicle asset, venue art and history input',verifyChargeFixRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/charge-fix/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChargeFixBytes(file,bytes),readChargeFixPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChargeFixBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChargeFixBytes('src/unknown.ts',unknown),unknown);
});
