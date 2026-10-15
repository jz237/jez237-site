import {restoreClubSceneryBytes} from './club-scenery-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/reservoir-scenery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReservoirSceneryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReservoirScenery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReservoirSceneryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreClubSceneryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReservoirSceneryPrevious(file);
}
export function verifyReservoirSceneryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2b142bd8c85483e49ed78eae16ff65f7dc4e29d2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreClubSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReservoirSceneryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreClubSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReservoirScenery release');
 assert.equal(manifest.previousFixtureCount,2165);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2165);
}
