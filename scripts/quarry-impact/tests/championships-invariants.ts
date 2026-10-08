import {restoreChampionshipGridBytes,verifyChampionshipGridRevision} from './championship-grid-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/championships/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChampionshipsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Championships baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChampionshipsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChampionshipGridBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChampionshipsPrevious(file);
}
export function verifyChampionshipsRevision(){
 verifyChampionshipGridRevision();
 const manifest=revision();assert.equal(manifest.baseline,'515fe519fbaa4c6515b7fe27d632e0cc551dbd9c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChampionshipGridBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChampionshipsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChampionshipGridBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Championships release');
 assert.equal(manifest.previousFixtureCount,966);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,966);
}
