import {restoreParkSceneryBytes} from './park-scenery-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/port-scenery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPortSceneryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PortScenery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePortSceneryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreParkSceneryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPortSceneryPrevious(file);
}
export function verifyPortSceneryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9061af7864373772699366efacc6ba68c2df6241');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreParkSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePortSceneryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreParkSceneryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PortScenery release');
 assert.equal(manifest.previousFixtureCount,2115);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2115);
}
