import {restoreHitReplayBytes} from './hit-replay-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/crowd-roar/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCrowdRoarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CrowdRoar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCrowdRoarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreHitReplayBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCrowdRoarPrevious(file);
}
export function verifyCrowdRoarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2abc4f376d08bb7c1a71df7b6ad2a0a21b558782');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreHitReplayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCrowdRoarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreHitReplayBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CrowdRoar release');
 assert.equal(manifest.previousFixtureCount,4800);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4800);
}
