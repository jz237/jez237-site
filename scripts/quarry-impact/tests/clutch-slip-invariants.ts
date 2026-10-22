import {restoreSteerPlayBytes} from './steer-play-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/clutch-slip/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readClutchSlipPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ClutchSlip baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreClutchSlipBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSteerPlayBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readClutchSlipPrevious(file);
}
export function verifyClutchSlipRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ffd83ab04dfb2ef7bbc1326738e5cd54b559af0c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSteerPlayBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreClutchSlipBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSteerPlayBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ClutchSlip release');
 assert.equal(manifest.previousFixtureCount,5645);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5645);
}
