import {restorePartShowersBytes} from './part-showers-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/body-crush/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBodyCrushPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BodyCrush baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBodyCrushBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePartShowersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBodyCrushPrevious(file);
}
export function verifyBodyCrushRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'713b6071e90871ce24c383db0b98b6f62b8dc745');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePartShowersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBodyCrushBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePartShowersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BodyCrush release');
 assert.equal(manifest.previousFixtureCount,5064);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5064);
}
