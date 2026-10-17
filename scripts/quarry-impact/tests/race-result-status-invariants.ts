import {restoreForestLodgeBytes} from './forest-lodge-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/race-result-status/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRaceResultStatusPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RaceResultStatus baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRaceResultStatusBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreForestLodgeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRaceResultStatusPrevious(file);
}
export function verifyRaceResultStatusRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ba05ff08033ffee87e1c5ed8efecec13988edf95');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreForestLodgeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRaceResultStatusBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreForestLodgeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RaceResultStatus release');
 assert.equal(manifest.previousFixtureCount,4167);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4167);
}
