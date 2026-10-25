import {restoreSlogansBytes} from './slogans-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/running-loops/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRunningLoopsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RunningLoops baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRunningLoopsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSlogansBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRunningLoopsPrevious(file);
}
export function verifyRunningLoopsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'4e9e3881b6bc404a8c3c9f62ce282a1fbbcb5e9c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSlogansBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRunningLoopsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSlogansBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RunningLoops release');
 assert.equal(manifest.previousFixtureCount,7786);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7786);
}
