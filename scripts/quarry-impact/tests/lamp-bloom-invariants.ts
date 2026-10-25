import {restoreStandbyVehiclesBytes} from './standby-vehicles-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/lamp-bloom/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLampBloomPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LampBloom baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLampBloomBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStandbyVehiclesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLampBloomPrevious(file);
}
export function verifyLampBloomRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'93f8d105fa0921d645c194dc869a80b4de0d8a89');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStandbyVehiclesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLampBloomBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStandbyVehiclesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LampBloom release');
 assert.equal(manifest.previousFixtureCount,8359);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8359);
}
