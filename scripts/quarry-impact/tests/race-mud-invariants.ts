import {restoreVenueCrowdBytes} from './venue-crowd-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/race-mud/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRaceMudPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RaceMud baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRaceMudBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreVenueCrowdBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRaceMudPrevious(file);
}
export function verifyRaceMudRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'37c2f73491b68950c3296503eec99b00a20e32c8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreVenueCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRaceMudBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreVenueCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RaceMud release');
 assert.equal(manifest.previousFixtureCount,2658);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2658);
}
