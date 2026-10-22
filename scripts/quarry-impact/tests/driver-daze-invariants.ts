import {restoreDazeHearingBytes} from './daze-hearing-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/driver-daze/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDriverDazePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DriverDaze baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDriverDazeBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDazeHearingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDriverDazePrevious(file);
}
export function verifyDriverDazeRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'bd6970581bdbdb780d9750c1a05b168cc76e2c10');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDazeHearingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDriverDazeBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDazeHearingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DriverDaze release');
 assert.equal(manifest.previousFixtureCount,5956);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5956);
}
