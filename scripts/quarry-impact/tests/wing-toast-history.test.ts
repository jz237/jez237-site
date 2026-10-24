import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWingToastPrevious,restoreWingToastBytes,verifyWingToastRevision} from './wing-toast-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('WingToast preserves every prior fixture, vehicle asset, venue art and history input',verifyWingToastRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wing-toast/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWingToastBytes(file,bytes),readWingToastPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWingToastBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWingToastBytes('src/unknown.ts',unknown),unknown);
});
