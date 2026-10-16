import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readSurvivalRivalsPrevious,restoreSurvivalRivalsBytes,verifySurvivalRivalsRevision} from './survival-rivals-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('SurvivalRivals preserves every prior fixture, vehicle asset, control and camera input',verifySurvivalRivalsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/survival-rivals/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreSurvivalRivalsBytes(file,bytes),readSurvivalRivalsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreSurvivalRivalsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreSurvivalRivalsBytes('src/unknown.ts',unknown),unknown);
});
