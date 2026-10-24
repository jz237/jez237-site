import {restorePileUpBytes} from './pile-up-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tether/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTetherPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Tether baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTetherBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePileUpBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTetherPrevious(file);
}
export function verifyTetherRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'101dbb92b3cf761e50d13fbdcd3f88a694fa7377');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePileUpBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTetherBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePileUpBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Tether release');
 assert.equal(manifest.previousFixtureCount,6856);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6856);
}
