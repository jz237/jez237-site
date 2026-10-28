import {restorePhotoTreesBytes} from './photo-trees-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readPuddleWaterPrevious,restorePuddleWaterBytes,verifyPuddleWaterRevision} from './puddle-water-invariants';
const source=(file:string)=>restorePhotoTreesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('PuddleWater preserves every prior fixture, vehicle asset, venue art and history input',verifyPuddleWaterRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/puddle-water/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restorePuddleWaterBytes(file,bytes),readPuddleWaterPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restorePuddleWaterBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restorePuddleWaterBytes('src/unknown.ts',unknown),unknown);
});
