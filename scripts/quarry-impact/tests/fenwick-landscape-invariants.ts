import {restoreFenwickTreeBeltBytes} from './fenwick-tree-belt-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-landscape/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickLandscapePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickLandscape baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickLandscapeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickTreeBeltBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickLandscapePrevious(file);
}
export function verifyFenwickLandscapeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'cd401d69052b8a38eb0aaeb9a74060ca62b4e255');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickTreeBeltBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickLandscapeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickTreeBeltBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickLandscape release');
 assert.equal(manifest.previousFixtureCount,3403);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3403);
}
