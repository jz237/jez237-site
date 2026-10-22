import {restoreDiagramFaultsBytes} from './diagram-faults-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/dead-car/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDeadCarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DeadCar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDeadCarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDiagramFaultsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDeadCarPrevious(file);
}
export function verifyDeadCarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'94b490d19614510adff5838d381f51c5d1a33772');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDiagramFaultsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDeadCarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDiagramFaultsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DeadCar release');
 assert.equal(manifest.previousFixtureCount,5933);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5933);
}
