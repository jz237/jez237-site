import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/derby-reconnect/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDerbyReconnectPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DerbyReconnect baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDerbyReconnectBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineTimedRaceBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDerbyReconnectPrevious(file);
}
export function verifyDerbyReconnectRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6480938285338649005fa5ea1a9a7c9230a79209');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineTimedRaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDerbyReconnectBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineTimedRaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DerbyReconnect release');
 assert.equal(manifest.previousFixtureCount,2884);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2884);
}

import {restoreOnlineTimedRaceBytes} from './online-timed-race-invariants';
