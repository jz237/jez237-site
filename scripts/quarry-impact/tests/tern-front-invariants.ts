import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('./fixtures/tern-front/'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreTernFrontBytes(file:string,bytes:Buffer){const e=revision.files[file];if(!e||hash(bytes)!==e.after)return bytes;const old=gunzipSync(read(e.snapshot));assert.equal(hash(old),e.before,file);return old;}
export function verifyTernFrontRevision(){for(const [p,e]of Object.entries<any>(revision.files)){const b=readFileSync(new URL('../'+p,import.meta.url));assert.equal(hash(b),e.after,p);assert.equal(hash(restoreTernFrontBytes(p,b)),e.before,p);}}
