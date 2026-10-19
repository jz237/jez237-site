import {restoreBarrierBoardsBytes} from './barrier-boards-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/kestrel-ring/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readKestrelRingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No KestrelRing baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreKestrelRingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBarrierBoardsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readKestrelRingPrevious(file);
}
export function verifyKestrelRingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d72a302591c4d698536c220e578c668cf6d69453');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBarrierBoardsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreKestrelRingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBarrierBoardsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the KestrelRing release');
 assert.equal(manifest.previousFixtureCount,4463);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4463);
}
