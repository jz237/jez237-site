import {restoreClassicEnginesBytes} from './classic-engines-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/still-standing/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStillStandingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StillStanding baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStillStandingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreClassicEnginesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStillStandingPrevious(file);
}
export function verifyStillStandingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d69667d9542fb1e8fdbde3dcce6d8638f407ec94');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreClassicEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStillStandingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreClassicEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StillStanding release');
 assert.equal(manifest.previousFixtureCount,6703);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6703);
}
