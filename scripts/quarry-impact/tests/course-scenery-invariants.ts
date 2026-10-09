import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/course-scenery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCourseSceneryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CourseScenery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCourseSceneryBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCourseSceneryPrevious(file);
}
export function verifyCourseSceneryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'aeda889c0a8d96498ff0b1243821632421a1db49');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCourseSceneryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' is outside the CourseScenery release');
 assert.equal(manifest.previousFixtureCount,2053);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2053);
}
