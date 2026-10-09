import {restoreFoundryBytes} from './foundry-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/stunt-career/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStuntCareerPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StuntCareer baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStuntCareerBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFoundryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStuntCareerPrevious(file);
}
export function verifyStuntCareerRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'40d83d90a869a2b7e1943fba80eafd076ecc750a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFoundryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStuntCareerBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFoundryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StuntCareer release');
 assert.equal(manifest.previousFixtureCount,1671);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1671);
}
