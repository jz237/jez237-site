import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('./fixtures/startup-latency/'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreStartupLatencyBytes(file:string,bytes:Buffer):Buffer {
 const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function verifyStartupLatencyRevision() {
 assert.equal(revision.baseline,'ebd928195894a87362a3cbd45c02c1bfd73fef85');
 for(const [file,entry] of Object.entries<any>(revision.files)) {
  const bytes=readFileSync(new URL('../'+file,import.meta.url));
  assert.equal(hash(bytes),entry.after,file);assert.equal(hash(restoreStartupLatencyBytes(file,bytes)),entry.before,file);
 }
}
