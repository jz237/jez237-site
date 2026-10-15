import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSeabrookHeadlandPrevious,restoreSeabrookHeadlandBytes,verifySeabrookHeadlandRevision} from './seabrook-headland-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SeabrookHeadland preserves every prior fixture, vehicle asset, control and camera input',verifySeabrookHeadlandRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/seabrook-headland/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSeabrookHeadlandBytes(file,bytes),readSeabrookHeadlandPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSeabrookHeadlandBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSeabrookHeadlandBytes('src/unknown.ts',unknown),unknown);
});
