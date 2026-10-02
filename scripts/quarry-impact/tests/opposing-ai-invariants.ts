import assert from 'node:assert/strict';
import {restoreControllerPlayabilityBytes,verifyControllerPlayabilityRevision} from './controller-playability-invariants';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/opposing-ai/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOpposingAIPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No opposing-AI baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreOpposingAIBytes(file:string,bytes:Buffer){
 bytes=restoreControllerPlayabilityBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readOpposingAIPrevious(file);
}
export function verifyOpposingAIRevision(){
 verifyControllerPlayabilityRevision();
 const manifest=revision();assert.equal(manifest.baseline,'9768bcf264d4bb39ae8ada88895c72e79b3b55ab');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreControllerPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOpposingAIBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreControllerPlayabilityBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during the opposing-AI revision');
 assert.equal(hash(readOpposingAIPrevious('src/driving-brain.ts')),'0a6e68734d7fc1c58756e1db68072e51572168bbcf18d5a62732289ac6a2fc80','The independent control traces retain their published predecessor');
}
