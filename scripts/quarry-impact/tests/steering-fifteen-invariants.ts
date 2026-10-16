import {restoreOnlineMorrowBytes} from './online-morrow-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/steering-fifteen/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSteeringFifteenPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SteeringFifteen baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSteeringFifteenBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineMorrowBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSteeringFifteenPrevious(file);
}
export function verifySteeringFifteenRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'896baad4dac60996104794f01663c61abf643080');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineMorrowBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSteeringFifteenBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineMorrowBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SteeringFifteen release');
 assert.equal(manifest.previousFixtureCount,3177);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3177);
}
