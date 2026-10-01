import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {restoreReferenceBytes} from './reference-invariants';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('source/structural-realism-revision.json').toString());
export function restoreStructuralBytes(file:string,bytes:Buffer){
 bytes=restoreReferenceBytes(file,bytes);
 const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 const old=gunzipSync(read(entry.snapshot));assert.equal(hash(old),entry.before);return old;
}
