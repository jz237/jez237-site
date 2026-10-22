import {restorePadDamageBytes} from './pad-damage-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/frame-bend/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFrameBendPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FrameBend baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFrameBendBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePadDamageBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFrameBendPrevious(file);
}
export function verifyFrameBendRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'70f599938f3cd9b72e9103315f1730461505f1a7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePadDamageBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFrameBendBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePadDamageBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FrameBend release');
 assert.equal(manifest.previousFixtureCount,5909);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5909);
}
