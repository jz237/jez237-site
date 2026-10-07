import {restoreLargeFieldBytes,verifyLargeFieldRevision} from './large-field-performance-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/collision-scars/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCollisionScarsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No collision-scar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCollisionScarsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLargeFieldBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCollisionScarsPrevious(file);
}
export function verifyCollisionScarsRevision(){
 verifyLargeFieldRevision();
 const manifest=revision();assert.equal(manifest.baseline,'53bc4116328844e158a6f8b9c36cfa697050b270');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLargeFieldBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCollisionScarsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLargeFieldBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the collision-scar release');
 assert.equal(manifest.previousFixtureCount,807);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,807);
}
