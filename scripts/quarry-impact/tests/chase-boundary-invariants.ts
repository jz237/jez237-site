import {restoreSteeringFifteenBytes} from './steering-fifteen-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chase-boundary/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChaseBoundaryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChaseBoundary baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChaseBoundaryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSteeringFifteenBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChaseBoundaryPrevious(file);
}
export function verifyChaseBoundaryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a47d84522004d777b2368df165e05b54686e089f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSteeringFifteenBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChaseBoundaryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSteeringFifteenBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChaseBoundary release');
 assert.equal(manifest.previousFixtureCount,3169);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3169);
}
