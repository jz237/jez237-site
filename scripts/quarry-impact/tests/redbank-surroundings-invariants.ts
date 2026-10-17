import {restoreBrackenPaddockBytes} from './bracken-paddock-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/redbank-surroundings/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRedbankSurroundingsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RedbankSurroundings baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRedbankSurroundingsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBrackenPaddockBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRedbankSurroundingsPrevious(file);
}
export function verifyRedbankSurroundingsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'af0e6617a874c36ffceeb5e28e3fcc7cab189c38');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBrackenPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRedbankSurroundingsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBrackenPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RedbankSurroundings release');
 assert.equal(manifest.previousFixtureCount,3259);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3259);
}
