import {restoreOnlineDamageBytes} from './online-damage-invariants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/physics-sync/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restorePhysicsSyncBytes(file:string,bytes:Buffer){
  bytes=restoreOnlineDamageBytes(file,bytes);
  const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
  const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function verifyPhysicsSyncRevision(){
  for(const [path,entry]of Object.entries<any>(revision.files)){
    const bytes=restoreOnlineDamageBytes(path,readFileSync(new URL('../'+path,import.meta.url)));assert.equal(hash(bytes),entry.after,path+': unrecorded physics synchronization change');
    assert.equal(hash(restorePhysicsSyncBytes(path,bytes)),entry.before,path+': preceding source restored');
  }
}
