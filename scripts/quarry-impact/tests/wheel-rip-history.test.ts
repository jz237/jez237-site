import {restoreCrashTotalsBytes} from './crash-totals-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWheelRipPrevious,restoreWheelRipBytes,verifyWheelRipRevision} from './wheel-rip-invariants';
const source=(file:string)=>restoreCrashTotalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WheelRip preserves every prior fixture, vehicle asset, venue art and history input',verifyWheelRipRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wheel-rip/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWheelRipBytes(file,bytes),readWheelRipPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWheelRipBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWheelRipBytes('src/unknown.ts',unknown),unknown);
});
