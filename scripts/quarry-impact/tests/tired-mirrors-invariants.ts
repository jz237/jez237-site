import {restoreBentCornersBytes} from './bent-corners-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tired-mirrors/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTiredMirrorsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TiredMirrors baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTiredMirrorsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBentCornersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTiredMirrorsPrevious(file);
}
export function verifyTiredMirrorsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9968e32688c343c155d7fb26f35caedd49fd73b5');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBentCornersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTiredMirrorsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBentCornersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TiredMirrors release');
 assert.equal(manifest.previousFixtureCount,9281);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9281);
}
