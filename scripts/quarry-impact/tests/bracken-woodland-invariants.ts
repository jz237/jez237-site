import {restoreAshfordPaddockBytes} from './ashford-paddock-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bracken-woodland/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrackenWoodlandPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BrackenWoodland baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrackenWoodlandBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAshfordPaddockBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrackenWoodlandPrevious(file);
}
export function verifyBrackenWoodlandRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'fb196880331ca2e07926a7da8e5ee0b1adc4e62f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAshfordPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrackenWoodlandBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAshfordPaddockBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BrackenWoodland release');
 assert.equal(manifest.previousFixtureCount,3277);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3277);
}
