import {restorePortWarehouseBytes} from './port-warehouse-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/coastal-pavilion/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCoastalPavilionPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CoastalPavilion baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCoastalPavilionBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePortWarehouseBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCoastalPavilionPrevious(file);
}
export function verifyCoastalPavilionRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'81e65fa410a416bfa933796cd3f109c0d8a30ff7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePortWarehouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCoastalPavilionBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePortWarehouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CoastalPavilion release');
 assert.equal(manifest.previousFixtureCount,4254);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4254);
}
