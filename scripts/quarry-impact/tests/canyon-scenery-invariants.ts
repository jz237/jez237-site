import {restoreSableDetailBytes} from './sable-detail-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/canyon-scenery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCanyonSceneryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CanyonScenery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCanyonSceneryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSableDetailBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCanyonSceneryPrevious(file);
}
export function verifyCanyonSceneryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'baeb34ece2b0858a0599350225ed106898f79e32');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSableDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCanyonSceneryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSableDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CanyonScenery release');
 assert.equal(manifest.previousFixtureCount,2210);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2210);
}
