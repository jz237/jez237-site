import assert from 'node:assert/strict';
import {restoreIronfieldBytes,verifyIronfieldRevision} from './ironfield-invariants';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/tern-greenhouse/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTernGreenhousePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No tern-greenhouse baseline for '+file);
 const before=gunzipSync(read(entry.snapshot));assert.equal(hash(before),entry.before,file);return before;
}
export function restoreTernGreenhouseBytes(file:string,bytes:Buffer){
 bytes=restoreIronfieldBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;return readTernGreenhousePrevious(file);
}
export function verifyTernGreenhouseRevision(){
 verifyIronfieldRevision();
 const manifest=revision();
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreIronfieldBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTernGreenhouseBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreIronfieldBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' stays unchanged during the Tern greenhouse revision');
}
