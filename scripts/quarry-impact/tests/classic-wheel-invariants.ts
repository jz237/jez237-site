import assert from 'node:assert/strict';
import {restoreTernGreenhouseBytes,verifyTernGreenhouseRevision} from './tern-greenhouse-invariants';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/classic-wheel/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readClassicWheelPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No classic-wheel baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreClassicWheelBytes(file:string,bytes:Buffer){
 bytes=restoreTernGreenhouseBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readClassicWheelPrevious(file);
}
export function verifyClassicWheelRevision(){
 verifyTernGreenhouseRevision();
 const manifest=revision();
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTernGreenhouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreClassicWheelBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTernGreenhouseBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during the Tern/Marten wheel and sill revision');
}
