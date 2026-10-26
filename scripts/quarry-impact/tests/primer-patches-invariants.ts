import {restoreTiredMirrorsBytes} from './tired-mirrors-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/primer-patches/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPrimerPatchesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PrimerPatches baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePrimerPatchesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTiredMirrorsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPrimerPatchesPrevious(file);
}
export function verifyPrimerPatchesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8e6fc6f92dacc662a66fee41d1e51e24df70d53e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTiredMirrorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePrimerPatchesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTiredMirrorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PrimerPatches release');
 assert.equal(manifest.previousFixtureCount,9270);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9270);
}
