import {restoreBumperGoneBytes} from './bumper-gone-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/diagram-body/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDiagramBodyPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DiagramBody baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDiagramBodyBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBumperGoneBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDiagramBodyPrevious(file);
}
export function verifyDiagramBodyRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c5f57b621ae782052fb6417bb6c23f528a1cbbdc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBumperGoneBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDiagramBodyBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBumperGoneBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DiagramBody release');
 assert.equal(manifest.previousFixtureCount,6560);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6560);
}
