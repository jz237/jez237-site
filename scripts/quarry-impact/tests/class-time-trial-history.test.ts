import {restoreCourseSceneryBytes} from './course-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readClassTimeTrialPrevious,restoreClassTimeTrialBytes,verifyClassTimeTrialRevision} from './class-time-trial-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ClassTimeTrial preserves every prior fixture, vehicle asset, control and camera input',verifyClassTimeTrialRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/class-time-trial/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreCourseSceneryBytes(file,source(file));assert.deepEqual(restoreClassTimeTrialBytes(file,bytes),readClassTimeTrialPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreClassTimeTrialBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreClassTimeTrialBytes('src/unknown.ts',unknown),unknown);
});
