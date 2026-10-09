import {restoreClassTimeTrialBytes} from './class-time-trial-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChampionshipClassesPrevious,restoreChampionshipClassesBytes,verifyChampionshipClassesRevision} from './championship-classes-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ChampionshipClasses preserves every prior fixture, vehicle asset, control and camera input',verifyChampionshipClassesRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/championship-classes/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreClassTimeTrialBytes(file,source(file));assert.deepEqual(restoreChampionshipClassesBytes(file,bytes),readChampionshipClassesPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChampionshipClassesBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChampionshipClassesBytes('src/unknown.ts',unknown),unknown);
});
