import {restoreTopSpeedBytes} from './top-speed-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/crowd-surge/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCrowdSurgePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CrowdSurge baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCrowdSurgeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTopSpeedBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCrowdSurgePrevious(file);
}
export function verifyCrowdSurgeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2f535c29e07aaaf09c88f938ba8d1466f3f94477');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTopSpeedBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCrowdSurgeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTopSpeedBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CrowdSurge release');
 assert.equal(manifest.previousFixtureCount,6403);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6403);
}
