import {restoreDailyLightingBytes} from './daily-lighting-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/cornet-car/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCornetCarPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CornetCar baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCornetCarBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDailyLightingBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCornetCarPrevious(file);
}
export function verifyCornetCarRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0bc5269d7f40aec9777aa9bd7bcd38369fa8ea6b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDailyLightingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCornetCarBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDailyLightingBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CornetCar release');
 assert.equal(manifest.previousFixtureCount,4736);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4736);
}
