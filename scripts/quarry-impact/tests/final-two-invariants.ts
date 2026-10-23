import {restoreRevengeBytes} from './revenge-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/final-two/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFinalTwoPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FinalTwo baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFinalTwoBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRevengeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFinalTwoPrevious(file);
}
export function verifyFinalTwoRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3126c56aeaec20e7fca97dc172430386a1ddca3a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRevengeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFinalTwoBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRevengeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FinalTwo release');
 assert.equal(manifest.previousFixtureCount,6418);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6418);
}
