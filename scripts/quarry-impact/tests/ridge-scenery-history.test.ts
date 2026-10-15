import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRidgeSceneryPrevious,restoreRidgeSceneryBytes,verifyRidgeSceneryRevision} from './ridge-scenery-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('RidgeScenery preserves every prior fixture, vehicle asset, control and camera input',verifyRidgeSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ridge-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRidgeSceneryBytes(file,bytes),readRidgeSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRidgeSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRidgeSceneryBytes('src/unknown.ts',unknown),unknown);
});
