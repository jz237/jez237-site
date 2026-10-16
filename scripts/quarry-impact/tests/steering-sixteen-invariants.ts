import {restoreReplayAudioBytes} from './replay-audio-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/steering-sixteen/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSteeringSixteenPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SteeringSixteen baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSteeringSixteenBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReplayAudioBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSteeringSixteenPrevious(file);
}
export function verifySteeringSixteenRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0e5dae94131ec3f848255a4099913fb594cbdf8d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReplayAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSteeringSixteenBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReplayAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SteeringSixteen release');
 assert.equal(manifest.previousFixtureCount,3228);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3228);
}
