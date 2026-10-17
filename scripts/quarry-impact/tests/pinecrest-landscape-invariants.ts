import {restorePinecrestRoadsideBytes} from './pinecrest-roadside-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pinecrest-landscape/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPinecrestLandscapePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PinecrestLandscape baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePinecrestLandscapeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinecrestRoadsideBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPinecrestLandscapePrevious(file);
}
export function verifyPinecrestLandscapeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f917a73d923b95c95bdbf1ba5bf0249ddacdf498');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinecrestRoadsideBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePinecrestLandscapeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinecrestRoadsideBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PinecrestLandscape release');
 assert.equal(manifest.previousFixtureCount,3368);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3368);
}
