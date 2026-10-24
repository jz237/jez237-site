import {restorePointsTagBytes} from './points-tag-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/destruction-points/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDestructionPointsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DestructionPoints baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDestructionPointsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePointsTagBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDestructionPointsPrevious(file);
}
export function verifyDestructionPointsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8d26af08599de523f7e8dce2464b4a188d009bb5');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePointsTagBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDestructionPointsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePointsTagBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DestructionPoints release');
 assert.equal(manifest.previousFixtureCount,6720);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6720);
}
