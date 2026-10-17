import {restoreOffroadMarkerBytes} from './offroad-marker-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rookvale-district/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRookvaleDistrictPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RookvaleDistrict baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRookvaleDistrictBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOffroadMarkerBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRookvaleDistrictPrevious(file);
}
export function verifyRookvaleDistrictRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2c8b13f207746f0505fa59f430022b82289cb568');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOffroadMarkerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRookvaleDistrictBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOffroadMarkerBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RookvaleDistrict release');
 assert.equal(manifest.previousFixtureCount,3440);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3440);
}
