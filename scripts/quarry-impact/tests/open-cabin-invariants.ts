import {restoreScreenCrazeBytes} from './screen-craze-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/open-cabin/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOpenCabinPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OpenCabin baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOpenCabinBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreScreenCrazeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOpenCabinPrevious(file);
}
export function verifyOpenCabinRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0604b9224d516d04a14ea619b9ba54c463a8420e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreScreenCrazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOpenCabinBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreScreenCrazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OpenCabin release');
 assert.equal(manifest.previousFixtureCount,6195);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6195);
}
