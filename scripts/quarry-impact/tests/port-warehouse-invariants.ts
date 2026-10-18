import {restorePackLandmarksBytes} from './pack-landmarks-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/port-warehouse/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPortWarehousePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PortWarehouse baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePortWarehouseBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePackLandmarksBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPortWarehousePrevious(file);
}
export function verifyPortWarehouseRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0382755f50c5997bb2a96934a202e626fcaeafa2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePackLandmarksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePortWarehouseBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePackLandmarksBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PortWarehouse release');
 assert.equal(manifest.previousFixtureCount,4263);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4263);
}
