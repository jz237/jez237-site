import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/course-materials/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCourseMaterialsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CourseMaterials baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCourseMaterialsBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCourseMaterialsPrevious(file);
}
export function verifyCourseMaterialsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b24330bdad46129975418b6bfd2ded9490ea49f8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCourseMaterialsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' is outside the CourseMaterials release');
 assert.equal(manifest.previousFixtureCount,2063);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2063);
}
