import {restoreDerbyDrivingBytes,verifyDerbyDrivingRevision} from './derby-driving-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('./fixtures/utility-integration/'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreUtilityIntegrationBytes(file:string,bytes:Buffer){bytes=restoreDerbyDrivingBytes(file,bytes);const e=revision.files[file];if(!e||hash(bytes)!==e.after)return bytes;const old=gunzipSync(read(e.snapshot));assert.equal(hash(old),e.before,file);return old;}
export function verifyUtilityIntegrationRevision(){verifyDerbyDrivingRevision();for(const [p,e]of Object.entries<any>(revision.files)){const b=restoreDerbyDrivingBytes(p,readFileSync(new URL('../'+p,import.meta.url)));assert.equal(hash(b),e.after,p);assert.equal(hash(restoreUtilityIntegrationBytes(p,b)),e.before,p);}}
