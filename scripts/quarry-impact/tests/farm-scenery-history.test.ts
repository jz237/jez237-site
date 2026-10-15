import {restoreGlobalScoringBytes} from './global-scoring-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFarmSceneryPrevious,restoreFarmSceneryBytes,verifyFarmSceneryRevision} from './farm-scenery-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FarmScenery preserves every prior fixture, vehicle asset, control and camera input',verifyFarmSceneryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/farm-scenery/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreGlobalScoringBytes(file,source(file));assert.deepEqual(restoreFarmSceneryBytes(file,bytes),readFarmSceneryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFarmSceneryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFarmSceneryBytes('src/unknown.ts',unknown),unknown);
});
