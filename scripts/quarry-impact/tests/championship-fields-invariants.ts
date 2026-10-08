import {restoreRaceSafetyBytes,verifyRaceSafetyRevision} from './race-safety-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/championship-fields/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChampionshipFieldsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChampionshipFields baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChampionshipFieldsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRaceSafetyBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChampionshipFieldsPrevious(file);
}
export function verifyChampionshipFieldsRevision(){
 verifyRaceSafetyRevision();
 const manifest=revision();assert.equal(manifest.baseline,'63229ac823f9f8d2d07e10d8b07574397596cd0f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRaceSafetyBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChampionshipFieldsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRaceSafetyBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChampionshipFields release');
 assert.equal(manifest.previousFixtureCount,1074);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1074);
}
