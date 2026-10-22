import {restoreOverheatFireBytes} from './overheat-fire-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/diagram-new/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDiagramNewPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DiagramNew baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDiagramNewBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOverheatFireBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDiagramNewPrevious(file);
}
export function verifyDiagramNewRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9d7f9ce3e233a00aa82dffee932ef9bd4923be21');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOverheatFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDiagramNewBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOverheatFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DiagramNew release');
 assert.equal(manifest.previousFixtureCount,6238);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6238);
}
