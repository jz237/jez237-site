import {restoreChaseBoundaryBytes} from './chase-boundary-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chase-ai/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChaseAIPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChaseAI baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChaseAIBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChaseBoundaryBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChaseAIPrevious(file);
}
export function verifyChaseAIRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'852ff3a0daa2060eba2acca905d6c5ab48b7fed5');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChaseBoundaryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChaseAIBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChaseBoundaryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChaseAI release');
 assert.equal(manifest.previousFixtureCount,3161);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3161);
}
