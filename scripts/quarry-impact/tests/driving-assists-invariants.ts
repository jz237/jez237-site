import {restoreRegentBytes} from './regent-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/driving-assists/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDrivingAssistsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DrivingAssists baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDrivingAssistsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRegentBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDrivingAssistsPrevious(file);
}
export function verifyDrivingAssistsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7002cea0554d86c75c048cf2b88761d3d4b0d286');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRegentBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDrivingAssistsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRegentBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DrivingAssists release');
 assert.equal(manifest.previousFixtureCount,1456);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1456);
}
