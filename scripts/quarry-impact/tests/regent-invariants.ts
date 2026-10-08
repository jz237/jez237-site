import {restoreAbsBytes} from './abs-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/regent/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRegentPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Regent baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRegentBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRegentPrevious(file);
}
export function verifyRegentRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0327d96510c4ce8ebe9b1b15c5fd1205d92076b2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAbsBytes(file,readFileSync(new URL('../'+file,import.meta.url))); assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRegentBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAbsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Regent release');
 assert.equal(manifest.previousFixtureCount,1475);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1475);
}
