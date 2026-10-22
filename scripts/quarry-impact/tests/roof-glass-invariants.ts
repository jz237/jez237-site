import {restoreTyreShredBytes} from './tyre-shred-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/roof-glass/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRoofGlassPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RoofGlass baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRoofGlassBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTyreShredBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRoofGlassPrevious(file);
}
export function verifyRoofGlassRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'627c49fa45f3b153858abc17ef861043676188ce');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTyreShredBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRoofGlassBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTyreShredBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RoofGlass release');
 assert.equal(manifest.previousFixtureCount,5600);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5600);
}
