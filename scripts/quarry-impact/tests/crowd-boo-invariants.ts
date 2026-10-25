import {restorePlayerHornBytes} from './player-horn-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/crowd-boo/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCrowdBooPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CrowdBoo baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCrowdBooBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePlayerHornBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCrowdBooPrevious(file);
}
export function verifyCrowdBooRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d739d3aa6a4e42e4ce03ceb06f33eca2a73d313f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePlayerHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCrowdBooBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePlayerHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CrowdBoo release');
 assert.equal(manifest.previousFixtureCount,7863);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7863);
}
