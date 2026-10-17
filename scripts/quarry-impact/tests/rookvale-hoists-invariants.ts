import {restoreCrushedPaintBytes} from './crushed-paint-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rookvale-hoists/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRookvaleHoistsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RookvaleHoists baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRookvaleHoistsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCrushedPaintBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRookvaleHoistsPrevious(file);
}
export function verifyRookvaleHoistsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3299318524e013bff7ca378148717ccbcfe67509');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCrushedPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRookvaleHoistsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCrushedPaintBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RookvaleHoists release');
 assert.equal(manifest.previousFixtureCount,3680);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3680);
}
