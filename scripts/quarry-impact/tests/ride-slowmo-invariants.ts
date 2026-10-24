import {restoreWreckBurstBytes} from './wreck-burst-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ride-slowmo/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRideSlowmoPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RideSlowmo baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRideSlowmoBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWreckBurstBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRideSlowmoPrevious(file);
}
export function verifyRideSlowmoRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c8f2562567162158f55ef17d1994d45e3fe9115f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWreckBurstBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRideSlowmoBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWreckBurstBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RideSlowmo release');
 assert.equal(manifest.previousFixtureCount,7383);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7383);
}
