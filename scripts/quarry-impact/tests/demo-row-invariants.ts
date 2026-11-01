import {restoreDerbyWearBytes} from './derby-wear-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/demo-row/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDemoRowPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DemoRow baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDemoRowBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDerbyWearBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDemoRowPrevious(file);
}
export function verifyDemoRowRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b881b78a446da60f68c9eb44dcf78ddee118055b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDerbyWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDemoRowBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDerbyWearBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DemoRow release');
 assert.equal(manifest.previousFixtureCount,9518);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9518);
}
