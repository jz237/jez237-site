import {restoreThrottleJamBytes} from './throttle-jam-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/exhaust-drag/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readExhaustDragPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ExhaustDrag baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreExhaustDragBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreThrottleJamBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readExhaustDragPrevious(file);
}
export function verifyExhaustDragRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'dc4f0b768149de188332a2f29709aedba1a1cbe6');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreThrottleJamBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreExhaustDragBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreThrottleJamBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ExhaustDrag release');
 assert.equal(manifest.previousFixtureCount,5572);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5572);
}
