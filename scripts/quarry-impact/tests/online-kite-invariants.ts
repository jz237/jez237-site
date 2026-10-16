import {restoreDriverIdentityBytes} from './driver-identity-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-kite/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineKitePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineKite baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineKiteBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDriverIdentityBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineKitePrevious(file);
}
export function verifyOnlineKiteRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f2a5daab6d61f8f0a570091f416b578bcc2e4a40');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDriverIdentityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineKiteBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDriverIdentityBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineKite release');
 assert.equal(manifest.previousFixtureCount,3052);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3052);
}
