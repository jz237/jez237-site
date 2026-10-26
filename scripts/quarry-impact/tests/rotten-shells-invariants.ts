import {restoreDonorPanelsBytes} from './donor-panels-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rotten-shells/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRottenShellsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RottenShells baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRottenShellsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDonorPanelsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRottenShellsPrevious(file);
}
export function verifyRottenShellsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'bb248bb8feb9123397dc649975d26b1fac7288a2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDonorPanelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRottenShellsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDonorPanelsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RottenShells release');
 assert.equal(manifest.previousFixtureCount,8840);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8840);
}
