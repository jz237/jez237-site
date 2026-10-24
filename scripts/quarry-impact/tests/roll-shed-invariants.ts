import {restoreRollMasterBytes} from './roll-master-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/roll-shed/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRollShedPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RollShed baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRollShedBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRollMasterBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRollShedPrevious(file);
}
export function verifyRollShedRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'eb537c20d28171a5b7fe2397db3d6c5377616235');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRollMasterBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRollShedBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRollMasterBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RollShed release');
 assert.equal(manifest.previousFixtureCount,6675);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6675);
}
