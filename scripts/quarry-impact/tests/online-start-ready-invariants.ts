import {restoreOnlineStartPreparationBytes} from './online-start-preparation-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-start-ready/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineStartReadyPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineStartReady baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineStartReadyBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineStartPreparationBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineStartReadyPrevious(file);
}
export function verifyOnlineStartReadyRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a43564307acae4a42cb7ab30417e5ad474b9ddd3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineStartPreparationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineStartReadyBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineStartPreparationBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineStartReady release');
 assert.equal(manifest.previousFixtureCount,4099);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4099);
}
