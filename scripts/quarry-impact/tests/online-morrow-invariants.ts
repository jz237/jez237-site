import {restoreOnlineRuleDraftBytes} from './online-rule-draft-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-morrow/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineMorrowPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineMorrow baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineMorrowBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineRuleDraftBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineMorrowPrevious(file);
}
export function verifyOnlineMorrowRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2ca62735020766fa7ed0abb212055df7c0daf89b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineRuleDraftBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineMorrowBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineRuleDraftBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineMorrow release');
 assert.equal(manifest.previousFixtureCount,3185);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3185);
}
