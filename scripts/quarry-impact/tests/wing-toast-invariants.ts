import {restoreDoorCreditBytes} from './door-credit-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/wing-toast/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWingToastPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WingToast baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWingToastBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDoorCreditBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWingToastPrevious(file);
}
export function verifyWingToastRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b9874c46de047b1a5839da5bd4cd5c2efaaef715');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDoorCreditBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWingToastBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDoorCreditBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WingToast release');
 assert.equal(manifest.previousFixtureCount,6737);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6737);
}
