import {restoreSableGroundcoverBytes} from './sable-groundcover-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sable-detail/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSableDetailPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SableDetail baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSableDetailBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSableGroundcoverBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSableDetailPrevious(file);
}
export function verifySableDetailRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7f738667309b8f07f9519d22fbc3b14e3d0f36d2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSableGroundcoverBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSableDetailBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSableGroundcoverBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SableDetail release');
 assert.equal(manifest.previousFixtureCount,2219);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2219);
}
