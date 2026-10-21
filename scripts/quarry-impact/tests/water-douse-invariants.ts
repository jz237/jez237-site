import {restoreBurningDebrisBytes} from './burning-debris-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/water-douse/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWaterDousePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WaterDouse baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWaterDouseBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBurningDebrisBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWaterDousePrevious(file);
}
export function verifyWaterDouseRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0c031b6750f2060203a298f67f745c0c370d896a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBurningDebrisBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWaterDouseBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBurningDebrisBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WaterDouse release');
 assert.equal(manifest.previousFixtureCount,5466);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5466);
}
