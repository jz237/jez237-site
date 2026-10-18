import {restoreKingswellPalmBytes} from './kingswell-palm-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPackLandmarksPrevious,restorePackLandmarksBytes,verifyPackLandmarksRevision} from './pack-landmarks-invariants';
const source=(file:string)=>restoreKingswellPalmBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PackLandmarks preserves every prior fixture, vehicle asset, control and camera input',verifyPackLandmarksRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/pack-landmarks/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePackLandmarksBytes(file,bytes),readPackLandmarksPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePackLandmarksBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePackLandmarksBytes('src/unknown.ts',unknown),unknown);
});
