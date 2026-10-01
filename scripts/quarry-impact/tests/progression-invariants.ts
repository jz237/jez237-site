import {restoreEventBytes} from './event-invariants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/progression/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreProgressionBytes(file:string,bytes:Buffer){
  bytes=restoreEventBytes(file,bytes);
  const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
  const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function verifyProgressionRevision(){
  for(const [path,entry]of Object.entries<any>(revision.files)){
    const bytes=restoreEventBytes(path,readFileSync(new URL('../'+path,import.meta.url)));assert.equal(hash(bytes),entry.after,path+': unrecorded progression change');
    assert.equal(hash(restoreProgressionBytes(path,bytes)),entry.before,path+': preceding source restored');
  }
}
