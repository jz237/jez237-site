import {restoreRainFireBytes} from './rain-fire-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/driver-hands/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDriverHandsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DriverHands baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDriverHandsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRainFireBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDriverHandsPrevious(file);
}
export function verifyDriverHandsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e3923cc030e8223611f15cb7d0e2bc734d0bfdd6');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRainFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDriverHandsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRainFireBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DriverHands release');
 assert.equal(manifest.previousFixtureCount,8084);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8084);
}
