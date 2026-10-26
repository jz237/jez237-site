import {restoreTailGlowBytes} from './tail-glow-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/dust-beams/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDustBeamsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DustBeams baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDustBeamsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTailGlowBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDustBeamsPrevious(file);
}
export function verifyDustBeamsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'92c00b6433eeea41edc8369e5fa558475cfe115f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTailGlowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDustBeamsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTailGlowBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DustBeams release');
 assert.equal(manifest.previousFixtureCount,8637);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8637);
}
