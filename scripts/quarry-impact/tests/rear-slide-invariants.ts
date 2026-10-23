import {restoreBootLidBytes} from './boot-lid-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rear-slide/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRearSlidePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RearSlide baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRearSlideBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBootLidBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRearSlidePrevious(file);
}
export function verifyRearSlideRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'237c68ccf75e1c277ad93bfbf767d5ca553e56d8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBootLidBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRearSlideBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBootLidBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RearSlide release');
 assert.equal(manifest.previousFixtureCount,6499);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6499);
}
