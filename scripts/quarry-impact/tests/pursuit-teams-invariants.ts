import {restoreTrackAcousticsBytes} from './track-acoustics-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pursuit-teams/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPursuitTeamsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PursuitTeams baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePursuitTeamsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreTrackAcousticsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPursuitTeamsPrevious(file);
}
export function verifyPursuitTeamsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7a421b37c82b9b5eb5117ca8b8c1d3d1edf552db');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreTrackAcousticsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePursuitTeamsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreTrackAcousticsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PursuitTeams release');
 assert.equal(manifest.previousFixtureCount,2999);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2999);
}
