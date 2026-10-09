import {restorePerformanceClassesBytes} from './performance-classes-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/park-dunes/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readParkDunesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ParkDunes baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreParkDunesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePerformanceClassesBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readParkDunesPrevious(file);
}
export function verifyParkDunesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6fd9aee67767515a2ea8ec105101393d5c3ecda8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePerformanceClassesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreParkDunesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePerformanceClassesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ParkDunes release');
 assert.equal(manifest.previousFixtureCount,1964);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1964);
}
