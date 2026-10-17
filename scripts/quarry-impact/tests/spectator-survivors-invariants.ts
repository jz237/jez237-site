import {restoreRookvaleRaceVenueBytes} from './rookvale-race-venue-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/spectator-survivors/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSpectatorSurvivorsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SpectatorSurvivors baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSpectatorSurvivorsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRookvaleRaceVenueBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSpectatorSurvivorsPrevious(file);
}
export function verifySpectatorSurvivorsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ea8a5dfb544c1f28e6a136f64f4c6264cf8f4956');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRookvaleRaceVenueBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSpectatorSurvivorsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRookvaleRaceVenueBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SpectatorSurvivors release');
 assert.equal(manifest.previousFixtureCount,3459);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3459);
}
