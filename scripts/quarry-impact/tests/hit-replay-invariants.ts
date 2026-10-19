import {restoreTakedownSlowmoBytes} from './takedown-slowmo-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/hit-replay/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHitReplayPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HitReplay baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHitReplayBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTakedownSlowmoBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHitReplayPrevious(file);
}
export function verifyHitReplayRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8abbaaec90eef5842536df74949a4aec6752041f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTakedownSlowmoBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHitReplayBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTakedownSlowmoBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HitReplay release');
 assert.equal(manifest.previousFixtureCount,4810);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4810);
}
