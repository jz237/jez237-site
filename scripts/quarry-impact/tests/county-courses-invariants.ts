import {restoreBriarhillBytes} from './briarhill-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/county-courses/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCountyCoursesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CountyCourses baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCountyCoursesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBriarhillBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCountyCoursesPrevious(file);
}
export function verifyCountyCoursesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a3f203d0331ed935dd175a08c2778174e500d26a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBriarhillBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCountyCoursesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBriarhillBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CountyCourses release');
 assert.equal(manifest.previousFixtureCount,1527);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1527);
}
