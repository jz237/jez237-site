import {restoreHuntLeaderBytes} from './hunt-leader-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tether-parts/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTetherPartsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TetherParts baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTetherPartsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreHuntLeaderBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTetherPartsPrevious(file);
}
export function verifyTetherPartsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'58279e135cd42c02ec28d86a7ee50fec49ec7799');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreHuntLeaderBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTetherPartsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreHuntLeaderBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TetherParts release');
 assert.equal(manifest.previousFixtureCount,6897);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6897);
}
