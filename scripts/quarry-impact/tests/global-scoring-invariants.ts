import {restorePortSceneryBytes} from './port-scenery-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/global-scoring/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGlobalScoringPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GlobalScoring baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGlobalScoringBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePortSceneryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGlobalScoringPrevious(file);
}
export function verifyGlobalScoringRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f6b63da3ddce477d03931a8667cb7e3c064efb41');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePortSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGlobalScoringBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePortSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GlobalScoring release');
 assert.equal(manifest.previousFixtureCount,2100);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2100);
}
