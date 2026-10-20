import {restorePropCcdBytes} from './prop-ccd-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/arena-props/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readArenaPropsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ArenaProps baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreArenaPropsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePropCcdBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readArenaPropsPrevious(file);
}
export function verifyArenaPropsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'1bfd791718a815846b0a4d05f02b3224b8938185');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePropCcdBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreArenaPropsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePropCcdBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ArenaProps release');
 assert.equal(manifest.previousFixtureCount,5118);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5118);
}
