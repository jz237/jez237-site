import {restoreRookvaleHoistsBytes} from './rookvale-hoists-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/conifer-spray/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readConiferSprayPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ConiferSpray baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreConiferSprayBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRookvaleHoistsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readConiferSprayPrevious(file);
}
export function verifyConiferSprayRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c1100197fc09c2430a239585576d6df2f369943b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRookvaleHoistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreConiferSprayBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRookvaleHoistsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ConiferSpray release');
 assert.equal(manifest.previousFixtureCount,3670);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3670);
}
