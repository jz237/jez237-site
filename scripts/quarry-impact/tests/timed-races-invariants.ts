import {restoreTimedRaceHarnessBytes,verifyTimedRaceHarnessRevision} from './timed-race-harness-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/timed-races/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTimedRacesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TimedRaces baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTimedRacesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTimedRaceHarnessBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTimedRacesPrevious(file);
}
export function verifyTimedRacesRevision(){
 verifyTimedRaceHarnessRevision();
 const manifest=revision();assert.equal(manifest.baseline,'1e977cf8015449a74cf4236a3d4450b4c8eca8ec');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTimedRaceHarnessBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTimedRacesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTimedRaceHarnessBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TimedRaces release');
 assert.equal(manifest.previousFixtureCount,987);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,987);
}
