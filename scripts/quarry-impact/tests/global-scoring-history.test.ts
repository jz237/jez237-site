import {restorePortSceneryBytes} from './port-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readGlobalScoringPrevious,restoreGlobalScoringBytes,verifyGlobalScoringRevision} from './global-scoring-invariants';
const source=(file:string)=>restorePortSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('GlobalScoring preserves every prior fixture, vehicle asset, control and camera input',verifyGlobalScoringRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/global-scoring/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreGlobalScoringBytes(file,bytes),readGlobalScoringPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreGlobalScoringBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreGlobalScoringBytes('src/unknown.ts',unknown),unknown);
});
