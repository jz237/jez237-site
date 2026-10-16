import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-recovery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineRecoveryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineRecovery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineRecoveryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineCoursesBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineRecoveryPrevious(file);
}
export function verifyOnlineRecoveryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'027f342b45b379455dd9b9c39a363d04332eb402');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineCoursesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineRecoveryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineCoursesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineRecovery release');
 assert.equal(manifest.previousFixtureCount,2930);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2930);
}

import {restoreOnlineCoursesBytes} from './online-courses-invariants';
