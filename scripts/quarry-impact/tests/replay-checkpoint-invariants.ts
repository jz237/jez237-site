import {restoreChampionshipSizeBytes,verifyChampionshipSizeRevision} from './championship-size-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/replay-checkpoint/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReplayCheckpointPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReplayCheckpoint baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReplayCheckpointBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChampionshipSizeBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReplayCheckpointPrevious(file);
}
export function verifyReplayCheckpointRevision(){
 verifyChampionshipSizeRevision();
 const manifest=revision();assert.equal(manifest.baseline,'e0e6d8067d4560545dbf350d0fce2bed98517014');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChampionshipSizeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReplayCheckpointBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChampionshipSizeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReplayCheckpoint release');
 assert.equal(manifest.previousFixtureCount,1412);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1412);
}
