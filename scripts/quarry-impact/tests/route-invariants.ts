import {restoreLiveryBytes} from './livery-invariants';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/routes/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreRouteBytes(file:string,bytes:Buffer){
  bytes=restoreLiveryBytes(file,bytes);
  const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
  const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function verifyRouteRevision(){
  for(const [path,entry]of Object.entries<any>(revision.files)){
    const bytes=restoreLiveryBytes(path,readFileSync(new URL('../'+path,import.meta.url)));assert.equal(hash(bytes),entry.after,path+': unrecorded route change');
    assert.equal(hash(restoreRouteBytes(path,bytes)),entry.before,path+': preceding source restored');
  }
}
