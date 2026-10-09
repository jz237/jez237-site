import {restoreCoastSceneryBytes} from './coast-scenery-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCourseMaterialsPrevious,restoreCourseMaterialsBytes,verifyCourseMaterialsRevision} from './course-materials-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('CourseMaterials preserves every prior fixture, vehicle asset, control and camera input',verifyCourseMaterialsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/course-materials/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreCoastSceneryBytes(file,source(file));assert.deepEqual(restoreCourseMaterialsBytes(file,bytes),readCourseMaterialsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCourseMaterialsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCourseMaterialsBytes('src/unknown.ts',unknown),unknown);
});
