import {restoreWetCarsBytes} from './wet-cars-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rain-lights/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRainLightsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RainLights baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRainLightsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWetCarsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRainLightsPrevious(file);
}
export function verifyRainLightsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ae2a7ad4a09714501eeddcad9db3932dca717dbd');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWetCarsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRainLightsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWetCarsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RainLights release');
 assert.equal(manifest.previousFixtureCount,7918);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7918);
}
