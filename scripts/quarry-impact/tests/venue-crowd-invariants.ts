import {restoreVenueBrowserBytes} from './venue-browser-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/venue-crowd/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readVenueCrowdPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No VenueCrowd baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreVenueCrowdBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreVenueBrowserBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readVenueCrowdPrevious(file);
}
export function verifyVenueCrowdRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'37bd3a6bc1d425feae683110dd968b82c88c22d7');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreVenueBrowserBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreVenueCrowdBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreVenueBrowserBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the VenueCrowd release');
 assert.equal(manifest.previousFixtureCount,2669);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2669);
}
