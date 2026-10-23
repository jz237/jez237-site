import {restoreExposedWheelBytes} from './exposed-wheel-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wing-off/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWingOffPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WingOff baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWingOffBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreExposedWheelBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWingOffPrevious(file);
}
export function verifyWingOffRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'af62b209db9a43a42e21f1488279722104cc8c27');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreExposedWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWingOffBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreExposedWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WingOff release');
 assert.equal(manifest.previousFixtureCount,6540);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6540);
}
