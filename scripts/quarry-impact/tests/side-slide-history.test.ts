import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSideSlidePrevious,restoreSideSlideBytes,verifySideSlideRevision} from './side-slide-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SideSlide preserves every prior fixture, vehicle asset, venue art and history input',verifySideSlideRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/side-slide/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSideSlideBytes(file,bytes),readSideSlidePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSideSlideBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSideSlideBytes('src/unknown.ts',unknown),unknown);
});
