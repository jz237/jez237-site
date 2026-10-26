import {restoreAgeRustBytes} from './age-rust-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/brake-dust/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrakeDustPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrakeDust baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrakeDustBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAgeRustBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrakeDustPrevious(file);
}
export function verifyBrakeDustRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'4f75431afba4dc52c5ff97f73d20183c30c7c723');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAgeRustBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrakeDustBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAgeRustBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrakeDust release');
 assert.equal(manifest.previousFixtureCount,8802);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8802);
}
