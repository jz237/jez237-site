import {restoreGlassRimBytes} from './glass-rim-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/standby-vehicles/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStandbyVehiclesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StandbyVehicles baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStandbyVehiclesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGlassRimBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStandbyVehiclesPrevious(file);
}
export function verifyStandbyVehiclesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c24c355ff6710c62308913697f4803452c75ef06');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGlassRimBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStandbyVehiclesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGlassRimBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StandbyVehicles release');
 assert.equal(manifest.previousFixtureCount,8372);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8372);
}
