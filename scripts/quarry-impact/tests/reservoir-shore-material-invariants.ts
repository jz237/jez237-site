import {restoreGradedSpinBytes} from './graded-spin-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/reservoir-shore-material/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readReservoirShoreMaterialPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ReservoirShoreMaterial baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreReservoirShoreMaterialBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreGradedSpinBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readReservoirShoreMaterialPrevious(file);
}
export function verifyReservoirShoreMaterialRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'1f5795ec624ca1620809184e2b2c33f14995ec6c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreGradedSpinBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreReservoirShoreMaterialBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreGradedSpinBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ReservoirShoreMaterial release');
 assert.equal(manifest.previousFixtureCount,3942);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3942);
}
