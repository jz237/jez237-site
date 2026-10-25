import {restoreGroundHazeBytes} from './ground-haze-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/heat-haze/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHeatHazePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HeatHaze baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHeatHazeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGroundHazeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHeatHazePrevious(file);
}
export function verifyHeatHazeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'046259355e5e23f6326808da2aec5d6645ba0572');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGroundHazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHeatHazeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGroundHazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HeatHaze release');
 assert.equal(manifest.previousFixtureCount,8242);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8242);
}
