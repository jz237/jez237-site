import {restoreAlderIntegrationBytes} from './alder-integration-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/alder-model/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAlderModelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AlderModel baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAlderModelBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAlderIntegrationBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAlderModelPrevious(file);
}
export function verifyAlderModelRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'33247eba8d47416f0fffb6b64de70f92d59bc662');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAlderIntegrationBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAlderModelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAlderIntegrationBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AlderModel release');
 assert.equal(manifest.previousFixtureCount,4191);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4191);
}
