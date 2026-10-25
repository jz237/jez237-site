import {restoreBodyCreakBytes} from './body-creak-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/brake-squeal/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrakeSquealPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrakeSqueal baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrakeSquealBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreBodyCreakBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrakeSquealPrevious(file);
}
export function verifyBrakeSquealRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'0257b4edf4543894a7a6b72084c34100537c6175');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreBodyCreakBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrakeSquealBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreBodyCreakBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrakeSqueal release');
 assert.equal(manifest.previousFixtureCount,7823);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7823);
}
