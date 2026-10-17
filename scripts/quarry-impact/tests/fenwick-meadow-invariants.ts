import {restoreFenwickBoundaryBytes} from './fenwick-boundary-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-meadow/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickMeadowPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickMeadow baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickMeadowBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickBoundaryBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickMeadowPrevious(file);
}
export function verifyFenwickMeadowRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ed49741181397c249f757754ee7c316c96c44559');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickBoundaryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickMeadowBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickBoundaryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickMeadow release');
 assert.equal(manifest.previousFixtureCount,3602);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3602);
}
