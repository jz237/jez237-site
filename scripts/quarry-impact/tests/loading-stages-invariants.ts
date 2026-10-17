import {restoreOnlineEngineLabelBytes} from './online-engine-label-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/loading-stages/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLoadingStagesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LoadingStages baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLoadingStagesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineEngineLabelBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLoadingStagesPrevious(file);
}
export function verifyLoadingStagesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'25168272358fe830f7d9e78c55bc5bd706c002c6');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineEngineLabelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLoadingStagesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineEngineLabelBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LoadingStages release');
 assert.equal(manifest.previousFixtureCount,4049);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4049);
}
