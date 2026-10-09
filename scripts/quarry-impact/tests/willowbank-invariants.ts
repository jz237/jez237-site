import {restoreHeathCanyonBytes} from './heath-canyon-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/willowbank/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWillowbankPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Willowbank baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWillowbankBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreHeathCanyonBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWillowbankPrevious(file);
}
export function verifyWillowbankRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5367a93b4aa570bfa17a155455a74b87a22c9b0c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreHeathCanyonBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWillowbankBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreHeathCanyonBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Willowbank release');
 assert.equal(manifest.previousFixtureCount,1773);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1773);
}
