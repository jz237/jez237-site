import {restoreParkDunesBytes} from './park-dunes-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/trail/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTrailPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Trail baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTrailBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreParkDunesBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTrailPrevious(file);
}
export function verifyTrailRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'db15e7f6734ee4a24913ad82f5f77e4ef296d076');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreParkDunesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTrailBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreParkDunesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Trail release');
 assert.equal(manifest.previousFixtureCount,1929);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1929);
}
