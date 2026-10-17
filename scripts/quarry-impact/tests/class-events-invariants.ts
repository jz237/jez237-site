import {restoreOnlineClassEnginesBytes} from './online-class-engines-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/class-events/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readClassEventsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ClassEvents baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreClassEventsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineClassEnginesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readClassEventsPrevious(file);
}
export function verifyClassEventsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'597e8ff734869c5d6cb0c491e5a902541a12982c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineClassEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreClassEventsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineClassEnginesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ClassEvents release');
 assert.equal(manifest.previousFixtureCount,3985);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3985);
}
