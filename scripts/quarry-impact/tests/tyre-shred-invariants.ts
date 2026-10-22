import {restoreStuckHornBytes} from './stuck-horn-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tyre-shred/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTyreShredPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TyreShred baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTyreShredBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStuckHornBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTyreShredPrevious(file);
}
export function verifyTyreShredRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'89885304df26e61351da27f10210ad3e14cd114a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStuckHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTyreShredBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStuckHornBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TyreShred release');
 assert.equal(manifest.previousFixtureCount,5608);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5608);
}
