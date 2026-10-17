import {restoreFenwickGaragesBytes} from './fenwick-garages-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-service/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickServicePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickService baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickServiceBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickGaragesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickServicePrevious(file);
}
export function verifyFenwickServiceRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ea8841bf5492483d82c8285902f6caf83ef0d82c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickGaragesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickServiceBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickGaragesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickService release');
 assert.equal(manifest.previousFixtureCount,3583);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3583);
}
