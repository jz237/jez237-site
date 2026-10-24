import {restoreRolledBytes} from './rolled-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/final-four/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFinalFourPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FinalFour baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFinalFourBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRolledBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFinalFourPrevious(file);
}
export function verifyFinalFourRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e405f0a9de10f4e9c5457babff8c6f1287252ae6');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRolledBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFinalFourBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRolledBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FinalFour release');
 assert.equal(manifest.previousFixtureCount,6643);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6643);
}
