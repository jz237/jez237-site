import {restoreSpeedMattersBytes} from './speed-matters-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOverheatFirePrevious,restoreOverheatFireBytes,verifyOverheatFireRevision} from './overheat-fire-invariants';
const source=(file:string)=>restoreSpeedMattersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OverheatFire preserves every prior fixture, vehicle asset, venue art and history input',verifyOverheatFireRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/overheat-fire/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOverheatFireBytes(file,bytes),readOverheatFirePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOverheatFireBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOverheatFireBytes('src/unknown.ts',unknown),unknown);
});
