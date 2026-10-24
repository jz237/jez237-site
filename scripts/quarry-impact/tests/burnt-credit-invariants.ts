import {restorePinBytes} from './pin-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/burnt-credit/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBurntCreditPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BurntCredit baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBurntCreditBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBurntCreditPrevious(file);
}
export function verifyBurntCreditRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'25554c38b8daa3879bc802a8819bb008e8fc75b3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBurntCreditBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BurntCredit release');
 assert.equal(manifest.previousFixtureCount,6811);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6811);
}
