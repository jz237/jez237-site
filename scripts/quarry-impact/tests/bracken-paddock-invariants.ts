import {restoreBrackenWoodlandBytes} from './bracken-woodland-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bracken-paddock/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrackenPaddockPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrackenPaddock baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrackenPaddockBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBrackenWoodlandBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrackenPaddockPrevious(file);
}
export function verifyBrackenPaddockRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'343daa13b9251bd97bbb421d910442541214618e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBrackenWoodlandBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrackenPaddockBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBrackenWoodlandBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrackenPaddock release');
 assert.equal(manifest.previousFixtureCount,3268);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3268);
}
