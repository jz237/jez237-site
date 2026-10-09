import {restorePortFarmBytes} from './port-farm-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/coastal-tour/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCoastalTourPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CoastalTour baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCoastalTourBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePortFarmBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCoastalTourPrevious(file);
}
export function verifyCoastalTourRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7ea0d734ff4234e51d7fe2443a91893577e51aa1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePortFarmBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCoastalTourBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePortFarmBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CoastalTour release');
 assert.equal(manifest.previousFixtureCount,1885);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1885);
}
