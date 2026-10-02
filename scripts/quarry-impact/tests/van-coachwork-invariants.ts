import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/van-coachwork/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function readVanCoachworkPrevious(file:string):Buffer{const entry=revision.files[file];assert.ok(entry,'No van-coachwork baseline for '+file);const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;}
export function restoreVanCoachworkBytes(file:string,bytes:Buffer){const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readVanCoachworkPrevious(file);}
export function verifyVanCoachworkRevision(){for(const [file,entry]of Object.entries<any>(revision.files)){const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);assert.equal(hash(restoreVanCoachworkBytes(file,bytes)),entry.before,file);}}
