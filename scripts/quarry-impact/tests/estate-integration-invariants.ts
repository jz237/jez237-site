import {restoreDemoPresentationBytes,verifyDemoPresentationRevision} from './demo-presentation-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('./fixtures/estate-integration/'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function restoreEstateIntegrationBytes(file:string,bytes:Buffer){bytes=restoreDemoPresentationBytes(file,bytes);const e=revision.files[file];if(!e||hash(bytes)!==e.after)return bytes;const old=gunzipSync(read(e.snapshot));assert.equal(hash(old),e.before,file);return old;}
export function verifyEstateIntegrationRevision(){verifyDemoPresentationRevision();for(const [p,e]of Object.entries<any>(revision.files)){const b=restoreDemoPresentationBytes(p,readFileSync(new URL('../'+p,import.meta.url)));assert.equal(hash(b),e.after,p);assert.equal(hash(restoreEstateIntegrationBytes(p,b)),e.before,p);}}
