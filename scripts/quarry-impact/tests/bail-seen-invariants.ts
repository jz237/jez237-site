import {restoreCabinSmokeBytes} from './cabin-smoke-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bail-seen/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBailSeenPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BailSeen baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBailSeenBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCabinSmokeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBailSeenPrevious(file);
}
export function verifyBailSeenRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'aa91e8a39e9ecac77bfdf7a57444881d3d38990e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCabinSmokeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBailSeenBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCabinSmokeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BailSeen release');
 assert.equal(manifest.previousFixtureCount,7751);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7751);
}
