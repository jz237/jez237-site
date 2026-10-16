import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-session/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineSessionPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineSession baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineSessionBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChaseClearanceBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineSessionPrevious(file);
}
export function verifyOnlineSessionRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'4fdcd4212a227af4a48914c0114ded9d01ef05d7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChaseClearanceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineSessionBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChaseClearanceBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineSession release');
 assert.equal(manifest.previousFixtureCount,2980);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2980);
}

import {restoreChaseClearanceBytes} from './chase-clearance-invariants';
