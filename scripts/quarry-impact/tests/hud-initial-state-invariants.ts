import {restoreFenwickFairgroundBytes} from './fenwick-fairground-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/hud-initial-state/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHudInitialStatePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HudInitialState baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHudInitialStateBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickFairgroundBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHudInitialStatePrevious(file);
}
export function verifyHudInitialStateRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e27fd0d5259014402a7d70bd8f8da1926106820f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickFairgroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHudInitialStateBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickFairgroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HudInitialState release');
 assert.equal(manifest.previousFixtureCount,3386);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3386);
}
