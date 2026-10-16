import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/reservoir-woodland/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReservoirWoodlandPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReservoirWoodland baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReservoirWoodlandBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSteeringDefaultRefreshBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReservoirWoodlandPrevious(file);
}
export function verifyReservoirWoodlandRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'cec4435e821f60289efb49bf469836ddbbb1e1cd');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSteeringDefaultRefreshBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReservoirWoodlandBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSteeringDefaultRefreshBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReservoirWoodland release');
 assert.equal(manifest.previousFixtureCount,2377);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2377);
}

import {restoreSteeringDefaultRefreshBytes} from './steering-default-refresh-invariants';
