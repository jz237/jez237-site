import {restoreWiperRateBytes} from './wiper-rate-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rain-showers/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRainShowersPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RainShowers baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRainShowersBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWiperRateBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRainShowersPrevious(file);
}
export function verifyRainShowersRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a1c8360f753474c4447f0eeb66e831df12a2d8c1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWiperRateBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRainShowersBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWiperRateBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RainShowers release');
 assert.equal(manifest.previousFixtureCount,8404);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8404);
}
