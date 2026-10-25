import {restoreBrakeHeatBytes} from './brake-heat-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wiper-rate/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWiperRatePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WiperRate baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWiperRateBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBrakeHeatBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWiperRatePrevious(file);
}
export function verifyWiperRateRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3950695c6fa0d3bf3ebc326f73ac31610c0748f3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBrakeHeatBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWiperRateBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBrakeHeatBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WiperRate release');
 assert.equal(manifest.previousFixtureCount,8420);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8420);
}
