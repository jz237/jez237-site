import {restoreBrakePullBytes} from './brake-pull-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/worn-engines/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWornEnginesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WornEngines baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWornEnginesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBrakePullBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWornEnginesPrevious(file);
}
export function verifyWornEnginesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f9e2ad638ab7ae7d93ea1f65d3b2144d4d5f8ec3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBrakePullBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWornEnginesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBrakePullBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WornEngines release');
 assert.equal(manifest.previousFixtureCount,9004);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9004);
}
