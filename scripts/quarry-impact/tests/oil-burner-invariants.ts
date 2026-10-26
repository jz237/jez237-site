import {restoreTiredSuspensionBytes} from './tired-suspension-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/oil-burner/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOilBurnerPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OilBurner baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOilBurnerBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTiredSuspensionBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOilBurnerPrevious(file);
}
export function verifyOilBurnerRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e72bfa13224761c26edc27920b2f1d17b72b8f08');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTiredSuspensionBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOilBurnerBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTiredSuspensionBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OilBurner release');
 assert.equal(manifest.previousFixtureCount,8863);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8863);
}
