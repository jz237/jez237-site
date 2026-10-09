import {restoreEasyTuningBytes} from './easy-tuning-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/heath-canyon/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHeathCanyonPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HeathCanyon baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHeathCanyonBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreEasyTuningBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHeathCanyonPrevious(file);
}
export function verifyHeathCanyonRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'929669b7d7b61335edad0734027d7587f104c99a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreEasyTuningBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHeathCanyonBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreEasyTuningBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HeathCanyon release');
 assert.equal(manifest.previousFixtureCount,1788);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1788);
}
