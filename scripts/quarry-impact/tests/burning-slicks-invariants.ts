import {restoreFireAwardsBytes} from './fire-awards-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/burning-slicks/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBurningSlicksPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BurningSlicks baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBurningSlicksBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreFireAwardsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBurningSlicksPrevious(file);
}
export function verifyBurningSlicksRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9b6ab00e47c00fcb0c9700af4dce5f65391e8005');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreFireAwardsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBurningSlicksBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreFireAwardsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BurningSlicks release');
 assert.equal(manifest.previousFixtureCount,5372);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5372);
}
