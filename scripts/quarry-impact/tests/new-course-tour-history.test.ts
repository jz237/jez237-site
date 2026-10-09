import {restoreChampionshipClassesBytes} from './championship-classes-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readNewCourseTourPrevious,restoreNewCourseTourBytes,verifyNewCourseTourRevision} from './new-course-tour-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('NewCourseTour preserves every prior fixture, vehicle asset, control and camera input',verifyNewCourseTourRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/new-course-tour/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreChampionshipClassesBytes(file,source(file));assert.deepEqual(restoreNewCourseTourBytes(file,bytes),readNewCourseTourPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreNewCourseTourBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreNewCourseTourBytes('src/unknown.ts',unknown),unknown);
});
