import {restoreShockwaveBytes} from './shockwave-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/all-arena-props/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAllArenaPropsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AllArenaProps baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAllArenaPropsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreShockwaveBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAllArenaPropsPrevious(file);
}
export function verifyAllArenaPropsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'63696a7754d146ae6493ffe74e3e8f34411befee');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreShockwaveBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAllArenaPropsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreShockwaveBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AllArenaProps release');
 assert.equal(manifest.previousFixtureCount,5153);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,5153);
}
