import {restoreFenwickWheelBytes} from './fenwick-wheel-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ground-rotation/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readGroundRotationPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No GroundRotation baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreGroundRotationBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickWheelBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readGroundRotationPrevious(file);
}
export function verifyGroundRotationRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'fc0833d5c3e73c92055f18733df9490f9098ecb6');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreGroundRotationBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the GroundRotation release');
 assert.equal(manifest.previousFixtureCount,3522);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3522);
}
