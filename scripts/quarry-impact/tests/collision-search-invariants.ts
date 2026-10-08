import {restoreAIDifficultyBytes,verifyAIDifficultyRevision} from './ai-difficulty-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/collision-search/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCollisionSearchPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No collision search baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCollisionSearchBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAIDifficultyBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCollisionSearchPrevious(file);
}
export function verifyCollisionSearchRevision(){
 verifyAIDifficultyRevision();
 const manifest=revision();assert.equal(manifest.baseline,'33a1125061743aa16501d17bbda9652ae29415c9');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAIDifficultyBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCollisionSearchBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAIDifficultyBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the collision search release');
 assert.equal(manifest.previousFixtureCount,882);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,882);
}
