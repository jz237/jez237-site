import {restoreWashMeBytes} from './wash-me-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sunstrips/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSunstripsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Sunstrips baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSunstripsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWashMeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSunstripsPrevious(file);
}
export function verifySunstripsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'d3626884b942ebfc1bf85d06834224a1b7c36f2e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWashMeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSunstripsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWashMeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Sunstrips release');
 assert.equal(manifest.previousFixtureCount,9040);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9040);
}
