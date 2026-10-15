import {restoreFairgroundMidwayBytes} from './fairground-midway-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fairground-wheel/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFairgroundWheelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FairgroundWheel baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFairgroundWheelBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFairgroundMidwayBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFairgroundWheelPrevious(file);
}
export function verifyFairgroundWheelRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'66a8993cc51843ebbd86852524671a4e74abb7bb');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFairgroundMidwayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFairgroundWheelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFairgroundMidwayBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FairgroundWheel release');
 assert.equal(manifest.previousFixtureCount,2271);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2271);
}
