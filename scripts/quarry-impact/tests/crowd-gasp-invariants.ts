import {restoreCrowdBooBytes} from './crowd-boo-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/crowd-gasp/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCrowdGaspPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CrowdGasp baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCrowdGaspBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCrowdBooBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCrowdGaspPrevious(file);
}
export function verifyCrowdGaspRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f1ce1e339051d1cc1a9d017a221348f78310ca82');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCrowdBooBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCrowdGaspBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCrowdBooBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CrowdGasp release');
 assert.equal(manifest.previousFixtureCount,7847);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7847);
}
