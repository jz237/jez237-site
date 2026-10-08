import {restoreCountyCareerBytes,verifyCountyCareerRevision} from './county-career-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/waypoint-venues/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readWaypointVenuesPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No WaypointVenues baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreWaypointVenuesBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCountyCareerBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readWaypointVenuesPrevious(file);
}
export function verifyWaypointVenuesRevision(){
 verifyCountyCareerRevision();
 const manifest=revision();assert.equal(manifest.baseline,'0b82cae6ed77076dfda8ad4cf1589c2114dbb4fc');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCountyCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreWaypointVenuesBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCountyCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the WaypointVenues release');
 assert.equal(manifest.previousFixtureCount,1348);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1348);
}
