import {restoreFenwickLandscapeBytes} from './fenwick-landscape-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-fairground/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickFairgroundPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickFairground baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickFairgroundBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickLandscapeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickFairgroundPrevious(file);
}
export function verifyFenwickFairgroundRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'43b7f8994c5e4cc6c98232d2a3e970e589ff8f84');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickFairgroundBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickLandscapeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickFairground release');
 assert.equal(manifest.previousFixtureCount,3394);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3394);
}
