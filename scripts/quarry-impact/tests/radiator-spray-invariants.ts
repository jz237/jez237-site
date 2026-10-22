import {restoreEngineNurseBytes} from './engine-nurse-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/radiator-spray/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRadiatorSprayPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RadiatorSpray baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRadiatorSprayBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreEngineNurseBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRadiatorSprayPrevious(file);
}
export function verifyRadiatorSprayRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'6cb58668cd08f922f24709ba5e15e9427da03b4b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreEngineNurseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRadiatorSprayBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreEngineNurseBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RadiatorSpray release');
 assert.equal(manifest.previousFixtureCount,6076);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6076);
}
