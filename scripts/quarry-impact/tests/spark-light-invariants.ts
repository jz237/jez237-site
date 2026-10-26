import {restoreSmokeHazeBytes} from './smoke-haze-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/spark-light/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSparkLightPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SparkLight baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSparkLightBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSmokeHazeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSparkLightPrevious(file);
}
export function verifySparkLightRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0a69b4b4971b2a01297392a778123722c7e65e37');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSmokeHazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSparkLightBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSmokeHazeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SparkLight release');
 assert.equal(manifest.previousFixtureCount,8673);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8673);
}
