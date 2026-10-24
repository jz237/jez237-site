import {restoreRollPopBytes} from './roll-pop-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pin-slam-awards/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPinSlamAwardsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PinSlamAwards baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePinSlamAwardsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRollPopBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPinSlamAwardsPrevious(file);
}
export function verifyPinSlamAwardsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'605cb8a4535e8a9b52087cc22ce4af299b208bae');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRollPopBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePinSlamAwardsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRollPopBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PinSlamAwards release');
 assert.equal(manifest.previousFixtureCount,6933);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6933);
}
