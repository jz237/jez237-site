import {restoreWarnCablesBytes} from './warn-cables-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/diagram-cables/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDiagramCablesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DiagramCables baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDiagramCablesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWarnCablesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDiagramCablesPrevious(file);
}
export function verifyDiagramCablesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0b6381f3a2bf3f0e8f35257e3ccd70911b858ec1');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWarnCablesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDiagramCablesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWarnCablesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DiagramCables release');
 assert.equal(manifest.previousFixtureCount,7067);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7067);
}
