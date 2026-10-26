import {restoreWiperArcsBytes} from './wiper-arcs-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/exhaust-soot/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readExhaustSootPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ExhaustSoot baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreExhaustSootBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWiperArcsBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readExhaustSootPrevious(file);
}
export function verifyExhaustSootRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'cf9b2e555b14300a2feaf49329fb87e51539089f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWiperArcsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreExhaustSootBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWiperArcsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ExhaustSoot release');
 assert.equal(manifest.previousFixtureCount,9135);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9135);
}
