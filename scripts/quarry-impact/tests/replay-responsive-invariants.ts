import {restoreCollisionSearchBytes,verifyCollisionSearchRevision} from './collision-search-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/replay-responsive/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReplayResponsivePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No responsive replay baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReplayResponsiveBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCollisionSearchBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReplayResponsivePrevious(file);
}
export function verifyReplayResponsiveRevision(){
 verifyCollisionSearchRevision();
 const manifest=revision();assert.equal(manifest.baseline,'a45521dfc6e721ec448cf702e291abdcb2bffcf7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCollisionSearchBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReplayResponsiveBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCollisionSearchBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the responsive replay release');
 assert.equal(manifest.previousFixtureCount,872);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,872);
}
