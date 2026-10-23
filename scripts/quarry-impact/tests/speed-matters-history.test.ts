import {restoreChargeFixBytes} from './charge-fix-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSpeedMattersPrevious,restoreSpeedMattersBytes,verifySpeedMattersRevision} from './speed-matters-invariants';
const source=(file:string)=>restoreChargeFixBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('SpeedMatters preserves every prior fixture, vehicle asset, venue art and history input',verifySpeedMattersRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/speed-matters/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSpeedMattersBytes(file,bytes),readSpeedMattersPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSpeedMattersBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSpeedMattersBytes('src/unknown.ts',unknown),unknown);
});
