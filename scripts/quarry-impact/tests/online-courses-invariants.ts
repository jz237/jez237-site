import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-courses/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineCoursesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineCourses baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineCoursesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineArenasBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineCoursesPrevious(file);
}
export function verifyOnlineCoursesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9b74b200367299bcab6e7a2c94801e7bfa6b3758');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineArenasBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineCoursesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineArenasBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineCourses release');
 assert.equal(manifest.previousFixtureCount,2938);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2938);
}

import {restoreOnlineArenasBytes} from './online-arenas-invariants';
