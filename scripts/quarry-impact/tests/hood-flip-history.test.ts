import {restoreBrakeFluidBytes} from './brake-fluid-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHoodFlipPrevious,restoreHoodFlipBytes,verifyHoodFlipRevision} from './hood-flip-invariants';
const source=(file:string)=>restoreBrakeFluidBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('HoodFlip preserves every prior fixture, vehicle asset, venue art and history input',verifyHoodFlipRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hood-flip/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHoodFlipBytes(file,bytes),readHoodFlipPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHoodFlipBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHoodFlipBytes('src/unknown.ts',unknown),unknown);
});
