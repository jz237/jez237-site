import {restoreOnlineOpponentControlsBytes} from './online-opponent-controls-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-opponents/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineOpponentsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineOpponents baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineOpponentsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineOpponentControlsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineOpponentsPrevious(file);
}
export function verifyOnlineOpponentsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7ccf406f51d3780e7e73f58a476bec1fd09a664c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineOpponentControlsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineOpponentsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineOpponentControlsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineOpponents release');
 assert.equal(manifest.previousFixtureCount,4066);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4066);
}
