import {restoreCrispDetailBytes} from './crisp-detail-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPhotoTreesPrevious,restorePhotoTreesBytes,verifyPhotoTreesRevision} from './photo-trees-invariants';
const source=(file:string)=>restoreCrispDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PhotoTrees preserves every prior fixture, vehicle asset, venue art and history input',verifyPhotoTreesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/photo-trees/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePhotoTreesBytes(file,bytes),readPhotoTreesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePhotoTreesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePhotoTreesBytes('src/unknown.ts',unknown),unknown);
});
