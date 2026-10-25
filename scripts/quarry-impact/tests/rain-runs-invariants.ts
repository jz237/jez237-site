import {restoreGravelRoostBytes} from './gravel-roost-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rain-runs/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRainRunsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RainRuns baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRainRunsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGravelRoostBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRainRunsPrevious(file);
}
export function verifyRainRunsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a519b137ae9dde292d0e0cb3b302e1379641a51e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGravelRoostBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRainRunsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGravelRoostBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RainRuns release');
 assert.equal(manifest.previousFixtureCount,8489);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8489);
}
