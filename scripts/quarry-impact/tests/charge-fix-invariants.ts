import {restoreSmashHitBytes} from './smash-hit-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/charge-fix/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChargeFixPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChargeFix baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChargeFixBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSmashHitBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChargeFixPrevious(file);
}
export function verifyChargeFixRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ab46a239f197e62bc0a6295f178607199c20f211');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSmashHitBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChargeFixBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSmashHitBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChargeFix release');
 assert.equal(manifest.previousFixtureCount,6278);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6278);
}
