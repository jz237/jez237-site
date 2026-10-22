import {restoreElectricalFaultBytes} from './electrical-fault-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tyre-rub/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTyreRubPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TyreRub baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTyreRubBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreElectricalFaultBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTyreRubPrevious(file);
}
export function verifyTyreRubRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'73e7c628a0417401f51a1a611bb58ee20da96369');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreElectricalFaultBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTyreRubBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreElectricalFaultBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TyreRub release');
 assert.equal(manifest.previousFixtureCount,5684);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5684);
}
