import {restoreRainLightsBytes} from './rain-lights-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wipers/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWipersPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Wipers baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWipersBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRainLightsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWipersPrevious(file);
}
export function verifyWipersRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'edeb767a560791df925b59cc2be75445d262e0ee');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRainLightsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWipersBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRainLightsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Wipers release');
 assert.equal(manifest.previousFixtureCount,7907);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7907);
}
