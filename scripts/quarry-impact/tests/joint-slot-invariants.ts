import {restorePinSlamAwardsBytes} from './pin-slam-awards-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/joint-slot/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readJointSlotPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No JointSlot baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreJointSlotBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePinSlamAwardsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readJointSlotPrevious(file);
}
export function verifyJointSlotRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'5c9070a49115a834a381d6372882d7f1825cafa8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePinSlamAwardsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreJointSlotBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePinSlamAwardsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the JointSlot release');
 assert.equal(manifest.previousFixtureCount,6924);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6924);
}
