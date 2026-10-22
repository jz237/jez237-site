import {restoreWeakSpotBytes} from './weak-spot-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/failure-moments/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readFailureMomentsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No FailureMoments baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreFailureMomentsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWeakSpotBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readFailureMomentsPrevious(file);
}
export function verifyFailureMomentsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'980481e3f34891e25234f9e034acf2c6c445ef78');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWeakSpotBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreFailureMomentsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWeakSpotBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the FailureMoments release');
 assert.equal(manifest.previousFixtureCount,5977);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5977);
}
