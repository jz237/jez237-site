import {restorePinecrestBytes,verifyPinecrestRevision} from './pinecrest-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/championship-size/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChampionshipSizePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChampionshipSize baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChampionshipSizeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinecrestBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChampionshipSizePrevious(file);
}
export function verifyChampionshipSizeRevision(){
 verifyPinecrestRevision();
 const manifest=revision();assert.equal(manifest.baseline,'d8ae1a45d5809c0e85d9f2ff818c2c2536aefb18');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinecrestBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChampionshipSizeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinecrestBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChampionshipSize release');
 assert.equal(manifest.previousFixtureCount,1423);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1423);
}
