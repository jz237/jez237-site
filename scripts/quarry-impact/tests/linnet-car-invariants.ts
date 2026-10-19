import {restoreDemoLightingBytes} from './demo-lighting-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/linnet-car/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLinnetCarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LinnetCar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLinnetCarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDemoLightingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLinnetCarPrevious(file);
}
export function verifyLinnetCarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b501099b2fdefbb71f8493497d326a0631525916');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDemoLightingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLinnetCarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDemoLightingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LinnetCar release');
 assert.equal(manifest.previousFixtureCount,4412);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4412);
}
