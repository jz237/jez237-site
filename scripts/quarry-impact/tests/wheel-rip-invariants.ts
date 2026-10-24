import {restoreCrashTotalsBytes} from './crash-totals-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wheel-rip/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWheelRipPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WheelRip baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWheelRipBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCrashTotalsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWheelRipPrevious(file);
}
export function verifyWheelRipRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'f5a00f50df742175ae0d721aeac5565ddf4f3d56');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCrashTotalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWheelRipBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCrashTotalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WheelRip release');
 assert.equal(manifest.previousFixtureCount,7480);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7480);
}
