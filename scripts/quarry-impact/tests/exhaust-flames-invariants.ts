import {restoreDustBeamsBytes} from './dust-beams-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/exhaust-flames/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readExhaustFlamesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ExhaustFlames baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreExhaustFlamesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDustBeamsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readExhaustFlamesPrevious(file);
}
export function verifyExhaustFlamesRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'fd75d59c16f6823584a2a034c41089ad23808511');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDustBeamsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreExhaustFlamesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDustBeamsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ExhaustFlames release');
 assert.equal(manifest.previousFixtureCount,8625);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,8625);
}
