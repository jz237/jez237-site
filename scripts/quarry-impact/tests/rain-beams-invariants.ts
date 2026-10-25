import {restoreExhaustVapourBytes} from './exhaust-vapour-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rain-beams/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRainBeamsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RainBeams baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRainBeamsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreExhaustVapourBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRainBeamsPrevious(file);
}
export function verifyRainBeamsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a36c705ef6ac70f17704e3d3934f35b665b53ee8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreExhaustVapourBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRainBeamsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreExhaustVapourBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RainBeams release');
 assert.equal(manifest.previousFixtureCount,8031);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8031);
}
