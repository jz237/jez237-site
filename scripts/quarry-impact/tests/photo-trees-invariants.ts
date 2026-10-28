import {restoreCrispDetailBytes} from './crisp-detail-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/photo-trees/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPhotoTreesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PhotoTrees baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePhotoTreesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCrispDetailBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPhotoTreesPrevious(file);
}
export function verifyPhotoTreesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'fc058309ab50be7b40fcf11e3ec0b5c25fc0e040');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCrispDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePhotoTreesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCrispDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PhotoTrees release');
 assert.equal(manifest.previousFixtureCount,9461);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9461);
}
