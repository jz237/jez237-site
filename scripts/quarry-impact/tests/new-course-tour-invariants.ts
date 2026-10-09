import {restoreChampionshipClassesBytes} from './championship-classes-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/new-course-tour/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readNewCourseTourPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No NewCourseTour baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreNewCourseTourBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChampionshipClassesBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readNewCourseTourPrevious(file);
}
export function verifyNewCourseTourRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5f5ab5742c9b7cf43c8c9c3a929523e50ae8702b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChampionshipClassesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreNewCourseTourBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChampionshipClassesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the NewCourseTour release');
 assert.equal(manifest.previousFixtureCount,2012);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2012);
}
