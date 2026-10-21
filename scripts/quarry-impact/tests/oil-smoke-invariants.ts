import {restoreBurningSlicksBytes} from './burning-slicks-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/oil-smoke/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOilSmokePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OilSmoke baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOilSmokeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBurningSlicksBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOilSmokePrevious(file);
}
export function verifyOilSmokeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8aed8735348d19682dae84e60c970695b03b3263');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBurningSlicksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOilSmokeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBurningSlicksBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OilSmoke release');
 assert.equal(manifest.previousFixtureCount,5362);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5362);
}
