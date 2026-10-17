import {restoreRaceFinishWindowBytes} from './race-finish-window-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/reservoir-pumphouse/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReservoirPumphousePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReservoirPumphouse baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReservoirPumphouseBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRaceFinishWindowBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReservoirPumphousePrevious(file);
}
export function verifyReservoirPumphouseRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'541dc4be9e06639bd54b2b9d0f73d885ca93e25c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRaceFinishWindowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReservoirPumphouseBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRaceFinishWindowBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReservoirPumphouse release');
 assert.equal(manifest.previousFixtureCount,4145);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4145);
}
