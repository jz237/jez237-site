import {restoreBodyworkResolutionBytes,verifyBodyworkResolutionRevision} from './bodywork-resolution-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/shared-depth/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSharedDepthPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SharedDepth baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSharedDepthBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBodyworkResolutionBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSharedDepthPrevious(file);
}
export function verifySharedDepthRevision(){
 verifyBodyworkResolutionRevision();
 const manifest=revision();assert.equal(manifest.baseline,'35dd2efca679afb7b05ba8f296c35837e30971fb');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBodyworkResolutionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSharedDepthBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBodyworkResolutionBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SharedDepth release');
 assert.equal(manifest.previousFixtureCount,1135);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1135);
}
