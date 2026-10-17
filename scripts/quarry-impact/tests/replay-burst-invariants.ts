import {restoreReplayFireBytes} from './replay-fire-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/replay-burst/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReplayBurstPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReplayBurst baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReplayBurstBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReplayFireBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReplayBurstPrevious(file);
}
export function verifyReplayBurstRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e026dc92cb90ccd04b76ba5a1da2c0613639d039');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReplayFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReplayBurstBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReplayFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReplayBurst release');
 assert.equal(manifest.previousFixtureCount,3330);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3330);
}
