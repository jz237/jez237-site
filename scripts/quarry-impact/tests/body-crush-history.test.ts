import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBodyCrushPrevious,restoreBodyCrushBytes,verifyBodyCrushRevision} from './body-crush-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('BodyCrush preserves every prior fixture, vehicle asset, venue art and history input',verifyBodyCrushRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/body-crush/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBodyCrushBytes(file,bytes),readBodyCrushPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBodyCrushBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBodyCrushBytes('src/unknown.ts',unknown),unknown);
});
