import {restoreFenwickMeadowBytes} from './fenwick-meadow-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-garages/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickGaragesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickGarages baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickGaragesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickMeadowBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickGaragesPrevious(file);
}
export function verifyFenwickGaragesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'052736f42e1ccf2d33631645ad00d3a201e873fc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickMeadowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickGaragesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickMeadowBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickGarages release');
 assert.equal(manifest.previousFixtureCount,3592);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3592);
}
