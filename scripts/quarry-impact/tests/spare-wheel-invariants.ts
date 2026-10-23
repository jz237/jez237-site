import {restoreWingOffBytes} from './wing-off-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/spare-wheel/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSpareWheelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SpareWheel baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSpareWheelBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWingOffBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSpareWheelPrevious(file);
}
export function verifySpareWheelRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f8be8b9ac21310435fa4784de804099272327596');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWingOffBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSpareWheelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWingOffBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SpareWheel release');
 assert.equal(manifest.previousFixtureCount,6530);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6530);
}
