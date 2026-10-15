import {restoreGlobalScoringBytes} from './global-scoring-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/farm-scenery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFarmSceneryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FarmScenery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFarmSceneryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGlobalScoringBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFarmSceneryPrevious(file);
}
export function verifyFarmSceneryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'67a4e1e4d1113ecece53b694360fa24bb95d68b0');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGlobalScoringBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFarmSceneryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGlobalScoringBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FarmScenery release');
 assert.equal(manifest.previousFixtureCount,2091);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2091);
}
