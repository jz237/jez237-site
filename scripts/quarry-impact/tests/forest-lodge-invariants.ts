import {restoreContactWireAbsenceBytes} from './contact-wire-absence-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/forest-lodge/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readForestLodgePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ForestLodge baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreForestLodgeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreContactWireAbsenceBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readForestLodgePrevious(file);
}
export function verifyForestLodgeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'58645d0f6f4a112d325c9f380341574e40475315');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreContactWireAbsenceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreForestLodgeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreContactWireAbsenceBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ForestLodge release');
 assert.equal(manifest.previousFixtureCount,4174);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4174);
}
