import {restoreFenwickGroundBytes} from './fenwick-ground-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/fenwick-wheel/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFenwickWheelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FenwickWheel baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFenwickWheelBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFenwickGroundBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFenwickWheelPrevious(file);
}
export function verifyFenwickWheelRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f256b82e3394fa618886754bc77581ad4b850b02');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFenwickGroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFenwickWheelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFenwickGroundBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FenwickWheel release');
 assert.equal(manifest.previousFixtureCount,3531);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3531);
}
