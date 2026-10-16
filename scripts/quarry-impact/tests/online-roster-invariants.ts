import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-roster/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineRosterPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineRoster baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineRosterBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineRecoveryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineRosterPrevious(file);
}
export function verifyOnlineRosterRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e335c632ef94e55f88ec42432ae0fc4c3532ff44');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineRecoveryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineRosterBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineRecoveryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineRoster release');
 assert.equal(manifest.previousFixtureCount,2913);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2913);
}

import {restoreOnlineRecoveryBytes} from './online-recovery-invariants';
