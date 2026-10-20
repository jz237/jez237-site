import {restoreReplaySlicksBytes} from './replay-slicks-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/leak-hud/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readLeakHudPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No LeakHud baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreLeakHudBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReplaySlicksBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readLeakHudPrevious(file);
}
export function verifyLeakHudRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f9d6001e0bc9da613c8c3872c0b381a212250f5c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReplaySlicksBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreLeakHudBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReplaySlicksBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the LeakHud release');
 assert.equal(manifest.previousFixtureCount,5285);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5285);
}
