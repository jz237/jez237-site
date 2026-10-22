import {restoreDiagramNewBytes} from './diagram-new-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/loop-hold/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLoopHoldPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LoopHold baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLoopHoldBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDiagramNewBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLoopHoldPrevious(file);
}
export function verifyLoopHoldRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e7248197130ebce5f2caf1d4e21b9106efb0dc4a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDiagramNewBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLoopHoldBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDiagramNewBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LoopHold release');
 assert.equal(manifest.previousFixtureCount,6231);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6231);
}
