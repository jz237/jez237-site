import {restoreRunningLoopsBytes} from './running-loops-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/end-horn/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readEndHornPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No EndHorn baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreEndHornBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRunningLoopsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readEndHornPrevious(file);
}
export function verifyEndHornRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0448a7477f8c0959cf9270303fcd595f53a1dd45');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRunningLoopsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreEndHornBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRunningLoopsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the EndHorn release');
 assert.equal(manifest.previousFixtureCount,7774);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7774);
}
