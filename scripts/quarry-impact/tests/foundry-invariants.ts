import {restoreDemolitionTourBytes} from './demolition-tour-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/foundry/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFoundryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Foundry baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFoundryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDemolitionTourBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFoundryPrevious(file);
}
export function verifyFoundryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e5cb9442f7845555278b5df7ecd91e7b56fda2de');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDemolitionTourBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFoundryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDemolitionTourBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Foundry release');
 assert.equal(manifest.previousFixtureCount,1685);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1685);
}
