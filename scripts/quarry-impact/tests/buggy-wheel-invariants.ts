import assert from 'node:assert/strict';
import {restoreClassicWheelBytes,verifyClassicWheelRevision} from './classic-wheel-invariants';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/buggy-wheel/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBuggyWheelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No buggy-wheel baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreBuggyWheelBytes(file:string,bytes:Buffer){
 bytes=restoreClassicWheelBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readBuggyWheelPrevious(file);
}
export function verifyBuggyWheelRevision(){
 verifyClassicWheelRevision();
 const manifest=revision();
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreClassicWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBuggyWheelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreClassicWheelBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during the wheel-only artwork release');
}
