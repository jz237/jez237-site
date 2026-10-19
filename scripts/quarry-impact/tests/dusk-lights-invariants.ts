import {restoreNemesisAwardBytes} from './nemesis-award-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/dusk-lights/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDuskLightsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DuskLights baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDuskLightsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreNemesisAwardBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDuskLightsPrevious(file);
}
export function verifyDuskLightsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d6db3d745f69b6b8034b58688ed8bf711a39463b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreNemesisAwardBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDuskLightsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreNemesisAwardBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DuskLights release');
 assert.equal(manifest.previousFixtureCount,4716);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4716);
}
