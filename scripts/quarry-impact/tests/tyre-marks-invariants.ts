import {restoreAxleTrampBytes} from './axle-tramp-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tyre-marks/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTyreMarksPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TyreMarks baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTyreMarksBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAxleTrampBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTyreMarksPrevious(file);
}
export function verifyTyreMarksRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'45cdaf3dc12a9718c61b0a6eb93a4e33a006ebe0');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAxleTrampBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTyreMarksBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAxleTrampBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TyreMarks release');
 assert.equal(manifest.previousFixtureCount,8936);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8936);
}
