import {restoreDemoQualityBytes,verifyDemoQualityRevision} from './demo-quality-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
const read=(p:string)=>readFileSync(new URL('./fixtures/armor/'+p,import.meta.url));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function readArmorPrevious(file:string):Buffer{const e=revision.files[file];assert.ok(e,'No captured armor baseline for '+file);const old=gunzipSync(read(e.snapshot));assert.equal(hash(old),e.before,file);return old;}
export function restoreArmorBytes(file:string,bytes:Buffer){bytes=restoreDemoQualityBytes(file,bytes);const e=revision.files[file];if(!e||hash(bytes)!==e.after)return bytes;return readArmorPrevious(file);}
export function verifyArmorRevision(){verifyDemoQualityRevision();for(const [p,e]of Object.entries<any>(revision.files)){const b=restoreDemoQualityBytes(p,readFileSync(new URL('../'+p,import.meta.url)));assert.equal(hash(b),e.after,p);assert.equal(hash(restoreArmorBytes(p,b)),e.before,p);}}
