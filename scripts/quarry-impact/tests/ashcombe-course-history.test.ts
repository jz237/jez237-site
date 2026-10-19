import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readAshcombeCoursePrevious,restoreAshcombeCourseBytes,verifyAshcombeCourseRevision} from './ashcombe-course-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('AshcombeCourse preserves every prior fixture, vehicle asset, course and history input',verifyAshcombeCourseRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/ashcombe-course/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreAshcombeCourseBytes(file,bytes),readAshcombeCoursePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreAshcombeCourseBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreAshcombeCourseBytes('src/unknown.ts',unknown),unknown);
});
