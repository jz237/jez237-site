import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('./fixtures/loading-speed/'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
/** Only the exact recorded successor can be peeled off during a historical audit. */
export function restoreLoadingSpeedBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function verifyLoadingSpeedRevision(){
 assert.equal(revision.baseline,'58cdbd55b3409db95abb18517262b7c98c6e6dbc');
 for(const [file,entry] of Object.entries<any>(revision.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));
  assert.equal(hash(bytes),entry.after,file);assert.equal(hash(restoreLoadingSpeedBytes(file,bytes)),entry.before,file);
 }
}
