import {restoreStructureBytes,verifyStructureRevision} from './structure-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/draw-batch/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDrawBatchPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DrawBatch baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDrawBatchBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStructureBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDrawBatchPrevious(file);
}
export function verifyDrawBatchRevision(){
 verifyStructureRevision();
 const manifest=revision();assert.equal(manifest.baseline,'c855b9b8fa91b83694a092ad5d4315761574d74c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStructureBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDrawBatchBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStructureBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DrawBatch release');
 assert.equal(manifest.previousFixtureCount,1255);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1255);
}
