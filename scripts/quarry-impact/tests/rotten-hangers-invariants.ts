import {restoreSunstripsBytes} from './sunstrips-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rotten-hangers/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRottenHangersPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RottenHangers baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRottenHangersBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSunstripsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRottenHangersPrevious(file);
}
export function verifyRottenHangersRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8743a24fe9d39e194337f9630ada98a01326c5e4');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSunstripsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRottenHangersBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSunstripsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RottenHangers release');
 assert.equal(manifest.previousFixtureCount,9027);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9027);
}
