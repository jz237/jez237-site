import {restoreSpareWheelBytes} from './spare-wheel-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/door-catch/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDoorCatchPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DoorCatch baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDoorCatchBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSpareWheelBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDoorCatchPrevious(file);
}
export function verifyDoorCatchRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8724e24dd2138d8d19fc56e9869dc76dae5bb903');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSpareWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDoorCatchBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSpareWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DoorCatch release');
 assert.equal(manifest.previousFixtureCount,6520);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6520);
}
