import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChampionshipGridPrevious,restoreChampionshipGridBytes,verifyChampionshipGridRevision} from './championship-grid-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ChampionshipGrid preserves every prior fixture, vehicle asset, control and camera input',verifyChampionshipGridRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/championship-grid/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChampionshipGridBytes(file,bytes),readChampionshipGridPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChampionshipGridBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChampionshipGridBytes('src/unknown.ts',unknown),unknown);
});
