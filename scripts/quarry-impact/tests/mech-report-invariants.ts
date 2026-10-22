import {restoreEngineMountsBytes} from './engine-mounts-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/mech-report/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readMechReportPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No MechReport baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreMechReportBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreEngineMountsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readMechReportPrevious(file);
}
export function verifyMechReportRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'18044501eaba6423903c08daa223c0ac9e9ec979');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreEngineMountsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreMechReportBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreEngineMountsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the MechReport release');
 assert.equal(manifest.previousFixtureCount,5817);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5817);
}
