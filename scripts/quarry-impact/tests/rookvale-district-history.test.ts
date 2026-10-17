import {restoreOffroadMarkerBytes} from './offroad-marker-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRookvaleDistrictPrevious,restoreRookvaleDistrictBytes,verifyRookvaleDistrictRevision} from './rookvale-district-invariants';
const source=(file:string)=>restoreOffroadMarkerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RookvaleDistrict preserves every prior fixture, vehicle asset, control and camera input',verifyRookvaleDistrictRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/rookvale-district/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRookvaleDistrictBytes(file,bytes),readRookvaleDistrictPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRookvaleDistrictBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRookvaleDistrictBytes('src/unknown.ts',unknown),unknown);
});
