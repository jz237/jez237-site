import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/manual-brake-priority/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readManualBrakePriorityPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ManualBrakePriority baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreManualBrakePriorityBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreContactAbsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readManualBrakePriorityPrevious(file);
}
export function verifyManualBrakePriorityRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8c29ce39dd117539f32cff2c2c7ee0a617a9d33e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreContactAbsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreManualBrakePriorityBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreContactAbsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ManualBrakePriority release');
 assert.equal(manifest.previousFixtureCount,2867);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2867);
}

import {restoreContactAbsBytes} from './contact-abs-invariants';
