import {restoreWheelBlurBytes} from './wheel-blur-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tired-suspension/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTiredSuspensionPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TiredSuspension baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTiredSuspensionBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWheelBlurBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTiredSuspensionPrevious(file);
}
export function verifyTiredSuspensionRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2d1ee6233d2a94777ed182256fd81160df97224e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWheelBlurBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTiredSuspensionBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWheelBlurBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TiredSuspension release');
 assert.equal(manifest.previousFixtureCount,8874);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8874);
}
