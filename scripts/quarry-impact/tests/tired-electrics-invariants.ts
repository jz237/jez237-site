import {restoreTorqueSteerBytes} from './torque-steer-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tired-electrics/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTiredElectricsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TiredElectrics baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTiredElectricsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTorqueSteerBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTiredElectricsPrevious(file);
}
export function verifyTiredElectricsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'13048783413fb442e0eb52e2593f75af7537e285');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTorqueSteerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTiredElectricsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTorqueSteerBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TiredElectrics release');
 assert.equal(manifest.previousFixtureCount,8959);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8959);
}
