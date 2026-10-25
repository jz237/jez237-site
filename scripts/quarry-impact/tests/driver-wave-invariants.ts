import {restoreShredTrailBytes} from './shred-trail-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/driver-wave/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDriverWavePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DriverWave baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDriverWaveBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreShredTrailBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDriverWavePrevious(file);
}
export function verifyDriverWaveRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d1c242190f9ba280f38c29042fb833e9cdd63ef9');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreShredTrailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDriverWaveBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreShredTrailBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DriverWave release');
 assert.equal(manifest.previousFixtureCount,7731);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7731);
}
