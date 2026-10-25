import {restoreWindBytes} from './wind-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/head-gasket/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readHeadGasketPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No HeadGasket baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreHeadGasketBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWindBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readHeadGasketPrevious(file);
}
export function verifyHeadGasketRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'286b2009002c4a592d276156cadc84e61381afb3');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWindBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreHeadGasketBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWindBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the HeadGasket release');
 assert.equal(manifest.previousFixtureCount,8055);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8055);
}
