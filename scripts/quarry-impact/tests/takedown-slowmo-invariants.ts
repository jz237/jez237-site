import {restoreMoorfieldSpeedbowlBytes} from './moorfield-speedbowl-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/takedown-slowmo/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTakedownSlowmoPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TakedownSlowmo baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTakedownSlowmoBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreMoorfieldSpeedbowlBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTakedownSlowmoPrevious(file);
}
export function verifyTakedownSlowmoRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'85aedda3a16a4fccf82b61738f7569ce1dc3f789');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreMoorfieldSpeedbowlBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTakedownSlowmoBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreMoorfieldSpeedbowlBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TakedownSlowmo release');
 assert.equal(manifest.previousFixtureCount,4819);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4819);
}
