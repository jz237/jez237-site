import {restoreStonePingsBytes} from './stone-pings-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wake-dust/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWakeDustPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WakeDust baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWakeDustBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStonePingsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWakeDustPrevious(file);
}
export function verifyWakeDustRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8d29a28cf435bd4e83644aafe6123e709f2e491a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStonePingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWakeDustBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStonePingsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WakeDust release');
 assert.equal(manifest.previousFixtureCount,8524);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8524);
}
