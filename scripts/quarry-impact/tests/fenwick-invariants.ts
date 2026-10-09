import {restoreStuntCareerBytes} from './stunt-career-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Fenwick baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStuntCareerBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickPrevious(file);
}
export function verifyFenwickRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'465d50639e3deb1ed4723ea2f63a7d50bcc0093c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStuntCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStuntCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Fenwick release');
 assert.equal(manifest.previousFixtureCount,1655);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1655);
}
