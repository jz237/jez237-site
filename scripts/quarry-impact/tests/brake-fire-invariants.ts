import {restoreExhaustOffBytes} from './exhaust-off-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/brake-fire/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrakeFirePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrakeFire baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrakeFireBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreExhaustOffBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrakeFirePrevious(file);
}
export function verifyBrakeFireRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a3f9cb10a509f1ca328360c45330f398da3b15d9');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreExhaustOffBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrakeFireBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreExhaustOffBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrakeFire release');
 assert.equal(manifest.previousFixtureCount,5875);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5875);
}
