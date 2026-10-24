import {restoreImpactTakesBytes} from './impact-takes-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/destruction-audio/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDestructionAudioPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DestructionAudio baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDestructionAudioBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreImpactTakesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDestructionAudioPrevious(file);
}
export function verifyDestructionAudioRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'624da2bcea19e8d64953dfd0647bec3ebde952aa');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreImpactTakesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDestructionAudioBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreImpactTakesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DestructionAudio release');
 assert.equal(manifest.previousFixtureCount,7228);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7228);
}
