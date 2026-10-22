import {restoreReverseRamBytes} from './reverse-ram-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/weak-spot/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWeakSpotPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WeakSpot baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWeakSpotBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReverseRamBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWeakSpotPrevious(file);
}
export function verifyWeakSpotRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2d9e020684be43c52f13e70cf3d8d44bfb985d08');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReverseRamBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWeakSpotBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReverseRamBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WeakSpot release');
 assert.equal(manifest.previousFixtureCount,5989);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5989);
}
