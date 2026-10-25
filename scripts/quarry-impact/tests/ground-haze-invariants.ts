import {restoreLensRainBytes} from './lens-rain-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ground-haze/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGroundHazePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GroundHaze baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGroundHazeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLensRainBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGroundHazePrevious(file);
}
export function verifyGroundHazeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ba606396368bd96351f10ed84ef9f957b20c6c8c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLensRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGroundHazeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLensRainBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GroundHaze release');
 assert.equal(manifest.previousFixtureCount,8253);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8253);
}
