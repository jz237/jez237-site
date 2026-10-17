import {restorePropMembershipBytes} from './prop-membership-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/live-props/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLivePropsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LiveProps baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLivePropsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePropMembershipBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLivePropsPrevious(file);
}
export function verifyLivePropsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7c908a6f2c94e26145d2eae07558e6614b1899c9');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePropMembershipBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLivePropsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePropMembershipBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LiveProps release');
 assert.equal(manifest.previousFixtureCount,3644);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3644);
}
