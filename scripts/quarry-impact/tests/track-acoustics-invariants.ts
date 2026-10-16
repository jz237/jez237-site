import {restoreKiteBytes} from './kite-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/track-acoustics/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readTrackAcousticsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No TrackAcoustics baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreTrackAcousticsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreKiteBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readTrackAcousticsPrevious(file);
}
export function verifyTrackAcousticsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'2e2ea9d4599a6e037fd6b30414afd1190c82158b');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreKiteBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreTrackAcousticsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreKiteBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the TrackAcoustics release');
 assert.equal(manifest.previousFixtureCount,3012);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3012);
}
