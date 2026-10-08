import {restoreDrivingAssistsBytes,verifyDrivingAssistsRevision} from './driving-assists-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pinecrest/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPinecrestPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Pinecrest baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePinecrestBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDrivingAssistsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPinecrestPrevious(file);
}
export function verifyPinecrestRevision(){
 verifyDrivingAssistsRevision();
 const manifest=revision();assert.equal(manifest.baseline,'093b4073db7c18fc3e750daffbbb3f5f25cefbe7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDrivingAssistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePinecrestBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDrivingAssistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Pinecrest release');
 assert.equal(manifest.previousFixtureCount,1435);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1435);
}
