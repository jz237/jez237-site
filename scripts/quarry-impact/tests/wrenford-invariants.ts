import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wrenford/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWrenfordPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Wrenford baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWrenfordBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreControlBackupBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWrenfordPrevious(file);
}
export function verifyWrenfordRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'fc66f5b26d29e75c028779c82405c8ba7dc6df80');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreControlBackupBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWrenfordBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreControlBackupBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Wrenford release');
 assert.equal(manifest.previousFixtureCount,2529);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2529);
}

import {restoreControlBackupBytes} from './control-backup-invariants';
