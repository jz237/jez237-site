import {restoreRaceResultStatusBytes} from './race-result-status-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/race-finish-window/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRaceFinishWindowPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RaceFinishWindow baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRaceFinishWindowBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRaceResultStatusBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRaceFinishWindowPrevious(file);
}
export function verifyRaceFinishWindowRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b301460bac2a48fa4fb4e61b6e5e6ee472fff197');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRaceResultStatusBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRaceFinishWindowBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRaceResultStatusBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RaceFinishWindow release');
 assert.equal(manifest.previousFixtureCount,4154);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4154);
}
