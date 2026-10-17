import {restoreAlderModelBytes} from './alder-model-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/contact-wire-absence/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readContactWireAbsencePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ContactWireAbsence baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreContactWireAbsenceBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAlderModelBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readContactWireAbsencePrevious(file);
}
export function verifyContactWireAbsenceRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'94921953fb2662d3222fd631487bd5c52e4d8021');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAlderModelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreContactWireAbsenceBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAlderModelBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ContactWireAbsence release');
 assert.equal(manifest.previousFixtureCount,4183);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4183);
}
