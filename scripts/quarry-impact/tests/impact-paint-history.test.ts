import {restoreRookvaleFreightBytes} from './rookvale-freight-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readImpactPaintPrevious,restoreImpactPaintBytes,verifyImpactPaintRevision} from './impact-paint-invariants';
const source=(file:string)=>restoreRookvaleFreightBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ImpactPaint preserves every prior fixture, vehicle asset, control and camera input',verifyImpactPaintRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/impact-paint/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreImpactPaintBytes(file,bytes),readImpactPaintPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreImpactPaintBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreImpactPaintBytes('src/unknown.ts',unknown),unknown);
});
