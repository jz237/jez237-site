import {restoreTetherBytes} from './tether-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bumper-lock/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBumperLockPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BumperLock baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBumperLockBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTetherBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBumperLockPrevious(file);
}
export function verifyBumperLockRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0d5ac244d5a058a23490db4be2587372251fa33c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTetherBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBumperLockBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTetherBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BumperLock release');
 assert.equal(manifest.previousFixtureCount,6847);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6847);
}
