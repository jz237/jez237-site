import {restoreProgramWarmupBytes} from './program-warmup-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sable-settling-works/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSableSettlingWorksPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SableSettlingWorks baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSableSettlingWorksBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreProgramWarmupBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSableSettlingWorksPrevious(file);
}
export function verifySableSettlingWorksRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'92690cfb0cb653a87661f9f01550ed2f232c7e12');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreProgramWarmupBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSableSettlingWorksBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreProgramWarmupBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SableSettlingWorks release');
 assert.equal(manifest.previousFixtureCount,3906);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3906);
}
