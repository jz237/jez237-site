import {restoreFairgroundWheelBytes} from './fairground-wheel-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/willowbank-detail/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWillowbankDetailPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WillowbankDetail baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWillowbankDetailBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFairgroundWheelBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWillowbankDetailPrevious(file);
}
export function verifyWillowbankDetailRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9f88eedaf3fb0a68de4c920ad126611d168242ae');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFairgroundWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWillowbankDetailBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFairgroundWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WillowbankDetail release');
 assert.equal(manifest.previousFixtureCount,2261);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2261);
}
