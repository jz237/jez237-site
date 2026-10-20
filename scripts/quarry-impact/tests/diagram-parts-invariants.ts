import {restoreBangerRaceBytes} from './banger-race-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/diagram-parts/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDiagramPartsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DiagramParts baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDiagramPartsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBangerRaceBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDiagramPartsPrevious(file);
}
export function verifyDiagramPartsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'eff2cd7c1e9a8d30ab034225663dc41056171b13');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBangerRaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDiagramPartsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBangerRaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DiagramParts release');
 assert.equal(manifest.previousFixtureCount,5188);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5188);
}
