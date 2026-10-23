import {restoreSpeedMattersBytes} from './speed-matters-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/overheat-fire/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOverheatFirePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OverheatFire baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOverheatFireBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSpeedMattersBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOverheatFirePrevious(file);
}
export function verifyOverheatFireRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5dd060d716b1381f52bec4f99a863e5bccaae525');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSpeedMattersBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOverheatFireBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSpeedMattersBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OverheatFire release');
 assert.equal(manifest.previousFixtureCount,6247);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6247);
}
