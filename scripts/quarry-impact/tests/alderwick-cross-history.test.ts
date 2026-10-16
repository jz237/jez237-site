import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAlderwickCrossPrevious,restoreAlderwickCrossBytes,verifyAlderwickCrossRevision} from './alderwick-cross-invariants';
const source=(file:string)=>restoreSurvivalRivalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('AlderwickCross preserves every prior fixture, vehicle asset, control and camera input',verifyAlderwickCrossRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/alderwick-cross/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAlderwickCrossBytes(file,bytes),readAlderwickCrossPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAlderwickCrossBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAlderwickCrossBytes('src/unknown.ts',unknown),unknown);
});

import {restoreSurvivalRivalsBytes} from './survival-rivals-invariants';
