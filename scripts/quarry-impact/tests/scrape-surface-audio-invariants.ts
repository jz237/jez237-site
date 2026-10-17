import {restoreAudioOutputBytes} from './audio-output-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/scrape-surface-audio/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readScrapeSurfaceAudioPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ScrapeSurfaceAudio baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreScrapeSurfaceAudioBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAudioOutputBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readScrapeSurfaceAudioPrevious(file);
}
export function verifyScrapeSurfaceAudioRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'580b99761f725299e294dce803a90d4d9e98ad95');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAudioOutputBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreScrapeSurfaceAudioBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAudioOutputBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ScrapeSurfaceAudio release');
 assert.equal(manifest.previousFixtureCount,3485);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3485);
}
