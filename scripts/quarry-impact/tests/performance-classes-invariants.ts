import {restoreCanalPassBytes} from './canal-pass-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/performance-classes/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPerformanceClassesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PerformanceClasses baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePerformanceClassesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCanalPassBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPerformanceClassesPrevious(file);
}
export function verifyPerformanceClassesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'214fe9557665a86867b906000ee12ce9c4e68ff4');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCanalPassBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePerformanceClassesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCanalPassBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PerformanceClasses release');
 assert.equal(manifest.previousFixtureCount,1980);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1980);
}
