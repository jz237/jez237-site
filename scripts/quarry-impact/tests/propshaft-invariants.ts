import {restoreWheelBearingBytes} from './wheel-bearing-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/propshaft/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPropshaftPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Propshaft baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePropshaftBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWheelBearingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPropshaftPrevious(file);
}
export function verifyPropshaftRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'1e79491fb4bc5698c9e0a0863a2b2af203904ebd');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWheelBearingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePropshaftBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWheelBearingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Propshaft release');
 assert.equal(manifest.previousFixtureCount,6154);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6154);
}
