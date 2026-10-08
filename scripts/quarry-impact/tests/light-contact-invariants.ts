import {restoreSharedDepthBytes,verifySharedDepthRevision} from './shared-depth-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/light-contact/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLightContactPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LightContact baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLightContactBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSharedDepthBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLightContactPrevious(file);
}
export function verifyLightContactRevision(){
 verifySharedDepthRevision();
 const manifest=revision();assert.equal(manifest.baseline,'6a14a3d52ad0b57c9c76dc6199ec53953d7807df');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSharedDepthBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLightContactBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSharedDepthBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LightContact release');
 assert.equal(manifest.previousFixtureCount,1123);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1123);
}
