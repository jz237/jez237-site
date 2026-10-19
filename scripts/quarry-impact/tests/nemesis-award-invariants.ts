import {restoreCornetCarBytes} from './cornet-car-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/nemesis-award/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readNemesisAwardPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No NemesisAward baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreNemesisAwardBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCornetCarBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readNemesisAwardPrevious(file);
}
export function verifyNemesisAwardRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b757a73252afe56cc3094e5bd18c638a123cbd90');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCornetCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreNemesisAwardBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCornetCarBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the NemesisAward release');
 assert.equal(manifest.previousFixtureCount,4727);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4727);
}
