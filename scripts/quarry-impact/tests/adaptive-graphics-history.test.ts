import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAdaptiveGraphicsPrevious,restoreAdaptiveGraphicsBytes,verifyAdaptiveGraphicsRevision} from './adaptive-graphics-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AdaptiveGraphics preserves every prior fixture, vehicle asset, control and camera input',verifyAdaptiveGraphicsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/adaptive-graphics/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAdaptiveGraphicsBytes(file,bytes),readAdaptiveGraphicsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAdaptiveGraphicsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAdaptiveGraphicsBytes('src/unknown.ts',unknown),unknown);
});
