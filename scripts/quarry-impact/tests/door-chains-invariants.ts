import {restoreDeadBrakeBytes} from './dead-brake-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/door-chains/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDoorChainsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DoorChains baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDoorChainsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDeadBrakeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDoorChainsPrevious(file);
}
export function verifyDoorChainsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c7d257d165c32a0b3ae8fc5ba06bbc42b880a482');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDeadBrakeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDoorChainsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDeadBrakeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DoorChains release');
 assert.equal(manifest.previousFixtureCount,9157);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9157);
}
