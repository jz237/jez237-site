import {restoreStartReadinessBytes} from './start-readiness-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-opponent-controls/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineOpponentControlsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineOpponentControls baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineOpponentControlsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStartReadinessBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineOpponentControlsPrevious(file);
}
export function verifyOnlineOpponentControlsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'13000e27553e5d6168ba85bbcca548cf061155ab');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStartReadinessBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineOpponentControlsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStartReadinessBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineOpponentControls release');
 assert.equal(manifest.previousFixtureCount,4075);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4075);
}
