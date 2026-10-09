import {restoreNewCourseTourBytes} from './new-course-tour-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/canal-pass/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCanalPassPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CanalPass baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCanalPassBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreNewCourseTourBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCanalPassPrevious(file);
}
export function verifyCanalPassRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'18f5a110cde4bd31381ed8d03a939b394e011557');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreNewCourseTourBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCanalPassBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreNewCourseTourBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CanalPass release');
 assert.equal(manifest.previousFixtureCount,1996);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1996);
}
