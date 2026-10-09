import {restoreCorneringBytes} from './cornering-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/audio-perspective/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAudioPerspectivePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AudioPerspective baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAudioPerspectiveBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCorneringBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAudioPerspectivePrevious(file);
}
export function verifyAudioPerspectiveRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'26232e0126c2fb8088dd0d110621b07ca673834b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCorneringBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAudioPerspectiveBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCorneringBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AudioPerspective release');
 assert.equal(manifest.previousFixtureCount,1837);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1837);
}
