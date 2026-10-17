import {restorePinecrestSignBytes} from './pinecrest-sign-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pinecrest-paddock/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPinecrestPaddockPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PinecrestPaddock baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePinecrestPaddockBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinecrestSignBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPinecrestPaddockPrevious(file);
}
export function verifyPinecrestPaddockRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e3bfe0d9253fbd40e14966a9100656c54ca36f1e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinecrestSignBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePinecrestPaddockBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinecrestSignBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PinecrestPaddock release');
 assert.equal(manifest.previousFixtureCount,3352);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3352);
}
