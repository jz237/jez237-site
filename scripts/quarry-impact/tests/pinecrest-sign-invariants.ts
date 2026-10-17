import {restorePinecrestLandscapeBytes} from './pinecrest-landscape-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pinecrest-sign/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPinecrestSignPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PinecrestSign baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePinecrestSignBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinecrestLandscapeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPinecrestSignPrevious(file);
}
export function verifyPinecrestSignRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'55bfdb67dd1392603f6c34a99825c44fb4b020ce');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinecrestLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePinecrestSignBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinecrestLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PinecrestSign release');
 assert.equal(manifest.previousFixtureCount,3361);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3361);
}
