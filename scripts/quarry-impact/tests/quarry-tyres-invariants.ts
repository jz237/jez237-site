import {restorePropSyncBytes} from './prop-sync-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/quarry-tyres/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readQuarryTyresPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No QuarryTyres baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreQuarryTyresBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePropSyncBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readQuarryTyresPrevious(file);
}
export function verifyQuarryTyresRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'dbbf1b378178fd9fd839d6c88d3929aef75e2d5e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePropSyncBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreQuarryTyresBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePropSyncBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the QuarryTyres release');
 assert.equal(manifest.previousFixtureCount,3619);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3619);
}
