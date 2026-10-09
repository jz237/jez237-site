import {restoreFreightSpeedBytes} from './freight-speed-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/elmsworth/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readElmsworthPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Elmsworth baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreElmsworthBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFreightSpeedBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readElmsworthPrevious(file);
}
export function verifyElmsworthRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8be8006ff2ada53daa2bfc64f874c9bdff612a50');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFreightSpeedBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreElmsworthBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFreightSpeedBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Elmsworth release');
 assert.equal(manifest.previousFixtureCount,1728);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1728);
}
