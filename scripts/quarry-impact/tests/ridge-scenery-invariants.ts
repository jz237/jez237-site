import {restoreFairSceneryBytes} from './fair-scenery-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ridge-scenery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRidgeSceneryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RidgeScenery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRidgeSceneryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFairSceneryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRidgeSceneryPrevious(file);
}
export function verifyRidgeSceneryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ba306e0fecde45020f92d585f442891ff9e4a277');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFairSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRidgeSceneryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFairSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RidgeScenery release');
 assert.equal(manifest.previousFixtureCount,2183);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2183);
}
