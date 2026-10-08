import {restoreControllerRumbleBytes,verifyControllerRumbleRevision} from './controller-rumble-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bodywork-resolution/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBodyworkResolutionPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BodyworkResolution baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBodyworkResolutionBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreControllerRumbleBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBodyworkResolutionPrevious(file);
}
export function verifyBodyworkResolutionRevision(){
 verifyControllerRumbleRevision();
 const manifest=revision();assert.equal(manifest.baseline,'c0bb32ac7c526e9a4cb4baaec7ed1f1f9d027cc1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreControllerRumbleBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBodyworkResolutionBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreControllerRumbleBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BodyworkResolution release');
 assert.equal(manifest.previousFixtureCount,1144);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1144);
}
