import {restoreSpectatorSurvivorsBytes} from './spectator-survivors-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/offroad-marker/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOffroadMarkerPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OffroadMarker baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOffroadMarkerBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSpectatorSurvivorsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOffroadMarkerPrevious(file);
}
export function verifyOffroadMarkerRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0a5a86ac82912f6d7a926ca3aaa13cb587e6cda4');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSpectatorSurvivorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOffroadMarkerBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSpectatorSurvivorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OffroadMarker release');
 assert.equal(manifest.previousFixtureCount,3449);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3449);
}
