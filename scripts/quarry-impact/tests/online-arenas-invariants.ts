import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-arenas/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineArenasPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineArenas baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineArenasBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineSessionBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineArenasPrevious(file);
}
export function verifyOnlineArenasRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e46619101ae5c7325a74c8bd7426491cb5d963f4');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineSessionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineArenasBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineSessionBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineArenas release');
 assert.equal(manifest.previousFixtureCount,2960);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2960);
}

import {restoreOnlineSessionBytes} from './online-session-invariants';
