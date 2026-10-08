import {restoreEngineStallBytes,verifyEngineStallRevision} from './engine-stall-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ai-difficulty/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAIDifficultyPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AI difficulty baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAIDifficultyBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreEngineStallBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAIDifficultyPrevious(file);
}
export function verifyAIDifficultyRevision(){
 verifyEngineStallRevision();
 const manifest=revision();assert.equal(manifest.baseline,'fa140b42f9ba377af058bcad7e9e63995a223e72');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreEngineStallBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAIDifficultyBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreEngineStallBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AI difficulty release');
 assert.equal(manifest.previousFixtureCount,890);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,890);
}
