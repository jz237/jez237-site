import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/smoke-haze/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSmokeHazePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SmokeHaze baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSmokeHazeBytes(file:string,bytes:Buffer):Buffer{
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSmokeHazePrevious(file);
}
export function verifySmokeHazeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'211929780fd4f71de1ec1bbc56438f577d7a5038');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=readFileSync(new URL('../'+file,import.meta.url));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSmokeHazeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(readFileSync(new URL('../'+file,import.meta.url))),expected,file+' is outside the SmokeHaze release');
 assert.equal(manifest.previousFixtureCount,8685);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8685);
}
