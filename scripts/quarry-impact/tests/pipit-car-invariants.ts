import {restoreThornbyHillBytes} from './thornby-hill-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pipit-car/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPipitCarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PipitCar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePipitCarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreThornbyHillBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPipitCarPrevious(file);
}
export function verifyPipitCarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9335302e5ff51b9477abf1c6a1a0b50d3e7b41fb');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreThornbyHillBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePipitCarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreThornbyHillBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PipitCar release');
 assert.equal(manifest.previousFixtureCount,4533);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4533);
}
