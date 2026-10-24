import {restoreRideSlowmoBytes} from './ride-slowmo-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/weight-groan/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWeightGroanPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WeightGroan baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWeightGroanBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRideSlowmoBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWeightGroanPrevious(file);
}
export function verifyWeightGroanRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'104168e503f89d00f78f98b5d86f30abd478e556');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRideSlowmoBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWeightGroanBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRideSlowmoBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WeightGroan release');
 assert.equal(manifest.previousFixtureCount,7368);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7368);
}
