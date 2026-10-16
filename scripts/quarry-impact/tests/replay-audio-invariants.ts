import {restoreReplayImpactAudioBytes} from './replay-impact-audio-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/replay-audio/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReplayAudioPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReplayAudio baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReplayAudioBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReplayImpactAudioBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReplayAudioPrevious(file);
}
export function verifyReplayAudioRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'253ffa8cc68b0e1bd97771972f149ef829a055d0');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReplayImpactAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReplayAudioBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReplayImpactAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReplayAudio release');
 assert.equal(manifest.previousFixtureCount,3236);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3236);
}
