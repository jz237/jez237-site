import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readNumberPlatesPrevious,restoreNumberPlatesBytes,verifyNumberPlatesRevision} from './number-plates-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('NumberPlates preserves every prior fixture, vehicle asset, venue art and history input',verifyNumberPlatesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/number-plates/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreNumberPlatesBytes(file,bytes),readNumberPlatesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreNumberPlatesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreNumberPlatesBytes('src/unknown.ts',unknown),unknown);
});
