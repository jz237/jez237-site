import {restoreMarshalFlinchBytes} from './marshal-flinch-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/marshal-flags/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readMarshalFlagsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No MarshalFlags baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreMarshalFlagsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreMarshalFlinchBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readMarshalFlagsPrevious(file);
}
export function verifyMarshalFlagsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9df29c46f4f72bed837412d2212ad89f07a8dfb8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreMarshalFlinchBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreMarshalFlagsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreMarshalFlinchBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the MarshalFlags release');
 assert.equal(manifest.previousFixtureCount,8171);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8171);
}
