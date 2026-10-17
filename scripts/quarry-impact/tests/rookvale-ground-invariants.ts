import {restoreRookvaleDistrictBytes} from './rookvale-district-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rookvale-ground/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRookvaleGroundPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RookvaleGround baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRookvaleGroundBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRookvaleDistrictBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRookvaleGroundPrevious(file);
}
export function verifyRookvaleGroundRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7dc368e9adab7007abc8a551b4ceadaeb8b55944');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRookvaleDistrictBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRookvaleGroundBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRookvaleDistrictBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RookvaleGround release');
 assert.equal(manifest.previousFixtureCount,3430);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3430);
}
