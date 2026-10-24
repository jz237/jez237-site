import {restoreMirrorClipBytes} from './mirror-clip-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bumper-ripped/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBumperRippedPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BumperRipped baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBumperRippedBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreMirrorClipBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBumperRippedPrevious(file);
}
export function verifyBumperRippedRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'07f0955e26d4626d9b3191d51d4785bfd30aa4dc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreMirrorClipBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBumperRippedBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreMirrorClipBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BumperRipped release');
 assert.equal(manifest.previousFixtureCount,7113);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7113);
}
