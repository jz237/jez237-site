import {restoreRideUpBytes} from './ride-up-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/exhaust-crush/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readExhaustCrushPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ExhaustCrush baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreExhaustCrushBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRideUpBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readExhaustCrushPrevious(file);
}
export function verifyExhaustCrushRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7367a7deda24e6d44ab449f30528b75d2f903e1a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRideUpBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreExhaustCrushBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRideUpBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ExhaustCrush release');
 assert.equal(manifest.previousFixtureCount,7340);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7340);
}
