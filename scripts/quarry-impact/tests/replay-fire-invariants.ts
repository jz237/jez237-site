import {restorePinecrestPaddockBytes} from './pinecrest-paddock-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/replay-fire/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReplayFirePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReplayFire baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReplayFireBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinecrestPaddockBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReplayFirePrevious(file);
}
export function verifyReplayFireRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3c5315c61cc460477d5ba999ab37baf4b076b154');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinecrestPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReplayFireBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinecrestPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReplayFire release');
 assert.equal(manifest.previousFixtureCount,3341);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3341);
}
