import {restoreAshfordSurfaceBytes,verifyAshfordSurfaceRevision} from './ashford-surface-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/ashford/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAshfordPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Ashford baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAshfordBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAshfordSurfaceBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAshfordPrevious(file);
}
export function verifyAshfordRevision(){
 verifyAshfordSurfaceRevision();
 const manifest=revision();assert.equal(manifest.baseline,'cc3d8148b94c536b23f11e9119f6071d5e2d005a');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAshfordSurfaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAshfordBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAshfordSurfaceBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Ashford release');
 assert.equal(manifest.previousFixtureCount,1169);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1169);
}
