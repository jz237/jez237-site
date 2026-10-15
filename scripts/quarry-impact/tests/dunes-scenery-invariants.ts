import {restoreCanalSceneryBytes} from './canal-scenery-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/dunes-scenery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDunesSceneryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DunesScenery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDunesSceneryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCanalSceneryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDunesSceneryPrevious(file);
}
export function verifyDunesSceneryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f65caf006b7d5f5560ebe7e914fbd8890655e2a0');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCanalSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDunesSceneryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCanalSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DunesScenery release');
 assert.equal(manifest.previousFixtureCount,2132);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2132);
}
