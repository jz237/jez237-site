import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('source/workyard-revision.json').toString());
/** Reconstruct the exact previous released source for historical milestone
 * assertions. The frozen old fixtures are never changed. Current workyard
 * geometry, actual constructor surfaces, physics and effects have separate
 * tests in workyard.test.ts and impact-response.test.ts. */
export function restoreWorkyardBytes(file:string,bytes:Buffer){
  const entry=revision.files[file];if(!entry||hash(bytes)===entry.before)return bytes;
  assert.equal(hash(bytes),entry.after,file+': workyard revision has unrecorded changes');
  const old=gunzipSync(read(entry.snapshot));assert.equal(hash(old),entry.before,file+': previous release recovered exactly');return old;
}
