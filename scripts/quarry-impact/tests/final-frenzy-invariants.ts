import {restoreTankStuntBytes} from './tank-stunt-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/final-frenzy/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFinalFrenzyPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FinalFrenzy baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFinalFrenzyBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTankStuntBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFinalFrenzyPrevious(file);
}
export function verifyFinalFrenzyRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'63eb13810cbcccebdf55b6bf55204fb0703848ac');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTankStuntBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFinalFrenzyBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTankStuntBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FinalFrenzy release');
 assert.equal(manifest.previousFixtureCount,7095);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7095);
}
