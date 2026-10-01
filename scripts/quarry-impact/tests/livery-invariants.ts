import {restoreControlsBytes} from './controls-invariants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/livery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreLiveryBytes(file:string,bytes:Buffer){
  bytes=restoreControlsBytes(file,bytes);
  const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
  const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function verifyLiveryRevision(){
  for(const [path,entry]of Object.entries<any>(revision.files)){
    const bytes=restoreControlsBytes(path,readFileSync(new URL('../'+path,import.meta.url)));assert.equal(hash(bytes),entry.after,path+': unrecorded livery change');
    assert.equal(hash(restoreLiveryBytes(path,bytes)),entry.before,path+': preceding source restored');
  }
}
