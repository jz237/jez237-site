import {restoreStrutPunchBytes} from './strut-punch-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tail-glow/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTailGlowPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TailGlow baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTailGlowBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStrutPunchBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTailGlowPrevious(file);
}
export function verifyTailGlowRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'87b6bedc6bedb28dd705b346c535292762e5f332');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStrutPunchBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTailGlowBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStrutPunchBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TailGlow release');
 assert.equal(manifest.previousFixtureCount,8651);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8651);
}
