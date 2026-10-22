import {restoreDriverDazeBytes} from './driver-daze-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/diagram-faults/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDiagramFaultsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DiagramFaults baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDiagramFaultsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDriverDazeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDiagramFaultsPrevious(file);
}
export function verifyDiagramFaultsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'07b40229da8a9e014145ebebb583b134dbe5d1ac');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDriverDazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDiagramFaultsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDriverDazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DiagramFaults release');
 assert.equal(manifest.previousFixtureCount,5945);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5945);
}
