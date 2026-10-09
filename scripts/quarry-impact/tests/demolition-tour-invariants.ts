import {restoreRookvaleBytes} from './rookvale-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/demolition-tour/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDemolitionTourPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DemolitionTour baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDemolitionTourBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRookvaleBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDemolitionTourPrevious(file);
}
export function verifyDemolitionTourRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'175b7c2e28451e58b34ecd0d6264c63ad158d107');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRookvaleBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDemolitionTourBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRookvaleBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DemolitionTour release');
 assert.equal(manifest.previousFixtureCount,1699);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1699);
}
