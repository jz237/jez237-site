import {restoreInvertedLeakBytes} from './inverted-leak-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/stuck-horn/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readStuckHornPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No StuckHorn baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreStuckHornBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreInvertedLeakBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readStuckHornPrevious(file);
}
export function verifyStuckHornRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'dbec15e0437cffa2823ecf5464420f706a83edfc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreInvertedLeakBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreStuckHornBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreInvertedLeakBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the StuckHorn release');
 assert.equal(manifest.previousFixtureCount,5616);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5616);
}
