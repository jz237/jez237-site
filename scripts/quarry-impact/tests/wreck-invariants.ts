import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('../'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('source/wreck-revision.json').toString());
/** Apply this inverse once. Older bytes pass through for chained milestone
 * restoration; wreck-geometry.test.ts separately verifies every current hash. */
export function restoreWreckBytes(file:string,bytes:Buffer){
 const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 const old=gunzipSync(read(entry.snapshot));assert.equal(hash(old),entry.before);return old;
}
