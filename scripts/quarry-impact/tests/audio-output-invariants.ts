import {restoreSableButtressesBytes} from './sable-buttresses-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/audio-output/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAudioOutputPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AudioOutput baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAudioOutputBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSableButtressesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAudioOutputPrevious(file);
}
export function verifyAudioOutputRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'705e23009c1761f6b280f5cc94fafffca534ba7c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSableButtressesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAudioOutputBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSableButtressesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AudioOutput release');
 assert.equal(manifest.previousFixtureCount,3494);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3494);
}
