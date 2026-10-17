import {restoreRookvaleDistrictBytes} from './rookvale-district-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvaleGroundPrevious,restoreRookvaleGroundBytes,verifyRookvaleGroundRevision} from './rookvale-ground-invariants';
const source=(file:string)=>restoreRookvaleDistrictBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RookvaleGround preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleGroundRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale-ground/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRookvaleGroundBytes(file,bytes),readRookvaleGroundPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleGroundBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleGroundBytes('src/unknown.ts',unknown),unknown);
});
