import {restoreReplayResponsiveBytes,verifyReplayResponsiveRevision} from './replay-responsive-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/damage-batching/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDamageBatchingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No damage batching baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDamageBatchingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReplayResponsiveBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDamageBatchingPrevious(file);
}
export function verifyDamageBatchingRevision(){
 verifyReplayResponsiveRevision();
 const manifest=revision();assert.equal(manifest.baseline,'c3bb11ca5f0e01ee326fcf159c042286e4489e41');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReplayResponsiveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDamageBatchingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReplayResponsiveBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the damage batching release');
 assert.equal(manifest.previousFixtureCount,855);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,855);
}
