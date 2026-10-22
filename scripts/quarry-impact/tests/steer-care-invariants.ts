import {restoreDnfCountdownBytes} from './dnf-countdown-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/steer-care/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSteerCarePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SteerCare baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSteerCareBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDnfCountdownBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSteerCarePrevious(file);
}
export function verifySteerCareRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'864d751c4f69baa7b19ad90448f3d40c964d4c12');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDnfCountdownBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSteerCareBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDnfCountdownBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SteerCare release');
 assert.equal(manifest.previousFixtureCount,6095);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6095);
}
