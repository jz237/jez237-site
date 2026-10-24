import {restoreWreckCauseBytes} from './wreck-cause-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/engine-drop/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readEngineDropPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No EngineDrop baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreEngineDropBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWreckCauseBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readEngineDropPrevious(file);
}
export function verifyEngineDropRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'da7f7b53447dae5308ed3096d4d41693c92caabe');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWreckCauseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreEngineDropBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWreckCauseBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the EngineDrop release');
 assert.equal(manifest.previousFixtureCount,6597);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6597);
}
