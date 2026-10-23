import {restoreMassShareBytes} from './mass-share-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/hanging-on/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHangingOnPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HangingOn baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHangingOnBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreMassShareBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHangingOnPrevious(file);
}
export function verifyHangingOnRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'db73752a87ba1358cdf662151f583178759b9483');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreMassShareBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHangingOnBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreMassShareBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HangingOn release');
 assert.equal(manifest.previousFixtureCount,6471);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6471);
}
