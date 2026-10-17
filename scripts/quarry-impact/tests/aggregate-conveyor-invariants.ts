import {restoreReservoirShoreMaterialBytes} from './reservoir-shore-material-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/aggregate-conveyor/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAggregateConveyorPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AggregateConveyor baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAggregateConveyorBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReservoirShoreMaterialBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAggregateConveyorPrevious(file);
}
export function verifyAggregateConveyorRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2809a22b5ca4d2be0ff5e8d2381f9ef7e8e282c8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReservoirShoreMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAggregateConveyorBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReservoirShoreMaterialBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AggregateConveyor release');
 assert.equal(manifest.previousFixtureCount,3933);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3933);
}
