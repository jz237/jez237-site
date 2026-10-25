import {restoreBailSeenBytes} from './bail-seen-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/shred-trail/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readShredTrailPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ShredTrail baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreShredTrailBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBailSeenBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readShredTrailPrevious(file);
}
export function verifyShredTrailRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'08481874979206ad7e602778f7bf7f5ba779988d');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBailSeenBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreShredTrailBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBailSeenBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ShredTrail release');
 assert.equal(manifest.previousFixtureCount,7740);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7740);
}
