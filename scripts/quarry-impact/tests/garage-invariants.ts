import {restoreProgressionBytes} from './progression-invariants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/garage/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
/** Historical release audits reconstruct frozen bytes, while gameplay tests import
 * the current implementation. Unknown modifications are never accepted as this revision. */
export function restoreGarageBytes(file:string,bytes:Buffer){
  bytes=restoreProgressionBytes(file,bytes);
  const entry=revision.files[file];
  if(!entry||hash(bytes)!==entry.after)return bytes;
  const old=gunzipSync(read(entry.snapshot));assert.equal(hash(old),entry.before,file);return old;
}
export function verifyGarageRevision(){
  for(const [path,entry] of Object.entries<any>(revision.files)){
    const current=restoreProgressionBytes(path,readFileSync(new URL('../'+path,import.meta.url)));
    assert.equal(hash(current),entry.after,path+': unrecorded garage change');
    assert.equal(hash(restoreGarageBytes(path,current)),entry.before,path+': original bytes recovered');
  }
}
