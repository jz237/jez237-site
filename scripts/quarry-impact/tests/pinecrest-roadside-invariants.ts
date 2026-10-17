import {restoreHudInitialStateBytes} from './hud-initial-state-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pinecrest-roadside/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPinecrestRoadsidePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PinecrestRoadside baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePinecrestRoadsideBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreHudInitialStateBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPinecrestRoadsidePrevious(file);
}
export function verifyPinecrestRoadsideRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b35100f2fab18560e37d94b9589cb65bd481a796');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreHudInitialStateBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePinecrestRoadsideBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreHudInitialStateBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PinecrestRoadside release');
 assert.equal(manifest.previousFixtureCount,3377);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3377);
}
