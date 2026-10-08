import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHarrowPrevious,restoreHarrowBytes,verifyHarrowRevision} from './harrow-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Harrow preserves every prior fixture, vehicle asset, control and camera input',verifyHarrowRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/harrow/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHarrowBytes(file,bytes),readHarrowPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHarrowBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHarrowBytes('src/unknown.ts',unknown),unknown);
});
