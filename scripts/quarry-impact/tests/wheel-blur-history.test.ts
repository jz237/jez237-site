import {restoreBumpStopsBytes} from './bump-stops-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readWheelBlurPrevious,restoreWheelBlurBytes,verifyWheelBlurRevision} from './wheel-blur-invariants';
const source=(file:string)=>restoreBumpStopsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('WheelBlur preserves every prior fixture, vehicle asset, venue art and history input',verifyWheelBlurRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/wheel-blur/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreWheelBlurBytes(file,bytes),readWheelBlurPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreWheelBlurBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreWheelBlurBytes('src/unknown.ts',unknown),unknown);
});
