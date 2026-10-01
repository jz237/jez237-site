import {restoreOnlineSetupBytes} from './online-setup-invariants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-wire/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreOnlineWireBytes(file:string,bytes:Buffer){
  bytes=restoreOnlineSetupBytes(file,bytes);
  const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
  const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function verifyOnlineWireRevision(){
  for(const [path,entry]of Object.entries<any>(revision.files)){
    const bytes=restoreOnlineSetupBytes(path,readFileSync(new URL('../'+path,import.meta.url)));assert.equal(hash(bytes),entry.after,path+': unrecorded online wire change');
    assert.equal(hash(restoreOnlineWireBytes(path,bytes)),entry.before,path+': preceding source restored');
  }
}
