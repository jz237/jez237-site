import {restoreMirrorHangBytes} from './mirror-hang-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/engine-mounts/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readEngineMountsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No EngineMounts baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreEngineMountsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreMirrorHangBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readEngineMountsPrevious(file);
}
export function verifyEngineMountsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ad41c17dd55174c4d1104b4b089e57a812b3c7a4');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreMirrorHangBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreEngineMountsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreMirrorHangBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the EngineMounts release');
 assert.equal(manifest.previousFixtureCount,5828);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5828);
}
