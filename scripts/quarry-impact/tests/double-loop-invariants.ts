import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/double-loop/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDoubleLoopPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DoubleLoop baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDoubleLoopBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAlderwickShowgroundBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDoubleLoopPrevious(file);
}
export function verifyDoubleLoopRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e797a570dce9ebdea4ed675d6ac0751426ae429e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAlderwickShowgroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDoubleLoopBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAlderwickShowgroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DoubleLoop release');
 assert.equal(manifest.previousFixtureCount,2463);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2463);
}

import {restoreAlderwickShowgroundBytes} from './alderwick-showground-invariants';
