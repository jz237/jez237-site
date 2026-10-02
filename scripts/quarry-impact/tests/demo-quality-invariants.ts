import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/demo-quality/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=JSON.parse(read('revision.json').toString());
export function readDemoQualityPrevious(file:string):Buffer{const entry=revision.files[file];assert.ok(entry,'No demo-quality baseline for '+file);const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;}
export function restoreDemoQualityBytes(file:string,bytes:Buffer){const entry=revision.files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readDemoQualityPrevious(file);}
export function verifyDemoQualityRevision(){for(const [file,entry]of Object.entries<any>(revision.files)){const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);assert.equal(hash(restoreDemoQualityBytes(file,bytes)),entry.before,file);}}
