import {restoreWeightGroanBytes} from './weight-groan-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ride-up/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRideUpPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RideUp baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRideUpBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWeightGroanBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRideUpPrevious(file);
}
export function verifyRideUpRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e8b901a861ee077ac9cc5fb027e6604e00c2b4b7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWeightGroanBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRideUpBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWeightGroanBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RideUp release');
 assert.equal(manifest.previousFixtureCount,7354);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7354);
}
