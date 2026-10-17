import {restoreAshfordLandscapeBytes} from './ashford-landscape-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ashford-paddock/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAshfordPaddockPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AshfordPaddock baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAshfordPaddockBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAshfordLandscapeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAshfordPaddockPrevious(file);
}
export function verifyAshfordPaddockRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ef59efc0e202554b8f21ae6c2b14068c7d224716');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAshfordLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAshfordPaddockBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAshfordLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AshfordPaddock release');
 assert.equal(manifest.previousFixtureCount,3286);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3286);
}
