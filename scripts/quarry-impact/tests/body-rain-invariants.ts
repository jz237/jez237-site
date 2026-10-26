import {restoreFlameLightBytes} from './flame-light-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/body-rain/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBodyRainPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BodyRain baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBodyRainBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFlameLightBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBodyRainPrevious(file);
}
export function verifyBodyRainRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7220d0e85101239e5c525fc340f741bc41a3be7f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFlameLightBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBodyRainBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFlameLightBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BodyRain release');
 assert.equal(manifest.previousFixtureCount,8695);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8695);
}
