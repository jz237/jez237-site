import {restoreLivePropsBytes} from './live-props-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/prop-sync/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPropSyncPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PropSync baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePropSyncBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLivePropsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPropSyncPrevious(file);
}
export function verifyPropSyncRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f1f11858b91dc618c6249ac5960df388be8e3591');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLivePropsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePropSyncBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLivePropsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PropSync release');
 assert.equal(manifest.previousFixtureCount,3632);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3632);
}
