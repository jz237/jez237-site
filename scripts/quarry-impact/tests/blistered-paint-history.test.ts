import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBlisteredPaintPrevious,restoreBlisteredPaintBytes,verifyBlisteredPaintRevision} from './blistered-paint-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BlisteredPaint preserves every prior fixture, vehicle asset, venue art and history input',verifyBlisteredPaintRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/blistered-paint/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBlisteredPaintBytes(file,bytes),readBlisteredPaintPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBlisteredPaintBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBlisteredPaintBytes('src/unknown.ts',unknown),unknown);
});
