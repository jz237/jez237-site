import {restoreKestrelRingBytes} from './kestrel-ring-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ashcombe-course/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAshcombeCoursePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AshcombeCourse baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAshcombeCourseBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreKestrelRingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAshcombeCoursePrevious(file);
}
export function verifyAshcombeCourseRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'412de020884ba2e6091952187bb19daa1c1eee93');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreKestrelRingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAshcombeCourseBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreKestrelRingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AshcombeCourse release');
 assert.equal(manifest.previousFixtureCount,4450);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4450);
}
