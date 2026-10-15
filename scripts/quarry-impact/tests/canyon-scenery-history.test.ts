import {restoreSableDetailBytes} from './sable-detail-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCanyonSceneryPrevious,restoreCanyonSceneryBytes,verifyCanyonSceneryRevision} from './canyon-scenery-invariants';
const source=(file:string)=>restoreSableDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('CanyonScenery preserves every prior fixture, vehicle asset, control and camera input',verifyCanyonSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/canyon-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCanyonSceneryBytes(file,bytes),readCanyonSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCanyonSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCanyonSceneryBytes('src/unknown.ts',unknown),unknown);
});
