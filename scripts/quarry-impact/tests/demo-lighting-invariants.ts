import {restoreAshcombeCourseBytes} from './ashcombe-course-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/demo-lighting/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDemoLightingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DemoLighting baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDemoLightingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAshcombeCourseBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDemoLightingPrevious(file);
}
export function verifyDemoLightingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e9e2a3f64b1f1ddb4e41d4bb3960165a97d2aef3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAshcombeCourseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDemoLightingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAshcombeCourseBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DemoLighting release');
 assert.equal(manifest.previousFixtureCount,4440);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4440);
}
