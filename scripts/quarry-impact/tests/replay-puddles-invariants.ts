import {restoreSableTalusBytes} from './sable-talus-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/replay-puddles/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReplayPuddlesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReplayPuddles baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReplayPuddlesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSableTalusBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReplayPuddlesPrevious(file);
}
export function verifyReplayPuddlesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ab1c033b19cf86504d784b72073aac04fa81ea02');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSableTalusBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReplayPuddlesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSableTalusBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReplayPuddles release');
 assert.equal(manifest.previousFixtureCount,3879);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3879);
}
