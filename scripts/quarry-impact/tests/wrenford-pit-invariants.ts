import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wrenford-pit/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWrenfordPitPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WrenfordPit baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWrenfordPitBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStandingsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWrenfordPitPrevious(file);
}
export function verifyWrenfordPitRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b183aae0d3c62edb4c6a6a6084793711c3b5fa9e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStandingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWrenfordPitBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStandingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WrenfordPit release');
 assert.equal(manifest.previousFixtureCount,2561);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2561);
}

import {restoreStandingsBytes} from './standings-invariants';
