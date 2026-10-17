import {restoreOnlineStartReadyBytes} from './online-start-ready-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/start-readiness/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStartReadinessPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StartReadiness baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStartReadinessBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineStartReadyBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStartReadinessPrevious(file);
}
export function verifyStartReadinessRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6a1b5918f64cdabe158f9a129841e17344f05be5');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineStartReadyBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStartReadinessBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineStartReadyBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StartReadiness release');
 assert.equal(manifest.previousFixtureCount,4091);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4091);
}
