import {restoreAirbagsBytes} from './airbags-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/body-dust/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBodyDustPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BodyDust baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBodyDustBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAirbagsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBodyDustPrevious(file);
}
export function verifyBodyDustRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'548dd44ee10bb1895d3f8bcf2be3f4cdbfea5032');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAirbagsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBodyDustBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAirbagsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BodyDust release');
 assert.equal(manifest.previousFixtureCount,8588);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8588);
}
