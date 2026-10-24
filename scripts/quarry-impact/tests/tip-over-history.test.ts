import {restoreWheelRipBytes} from './wheel-rip-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readTipOverPrevious,restoreTipOverBytes,verifyTipOverRevision} from './tip-over-invariants';
const source=(file:string)=>restoreWheelRipBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('TipOver preserves every prior fixture, vehicle asset, venue art and history input',verifyTipOverRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/tip-over/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreTipOverBytes(file,bytes),readTipOverPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreTipOverBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreTipOverBytes('src/unknown.ts',unknown),unknown);
});
