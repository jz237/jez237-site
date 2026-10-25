import {restoreCabinAcousticsBytes} from './cabin-acoustics-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/thunder/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readThunderPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Thunder baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreThunderBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCabinAcousticsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readThunderPrevious(file);
}
export function verifyThunderRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c0ec9258919eb5fcdf50c507b5a46acab25e26e9');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCabinAcousticsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreThunderBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCabinAcousticsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Thunder release');
 assert.equal(manifest.previousFixtureCount,8142);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8142);
}
