import {restorePursuitTeamsBytes} from './pursuit-teams-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/chase-clearance/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readChaseClearancePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No ChaseClearance baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreChaseClearanceBytes(file:string,bytes:Buffer):Buffer{
 bytes=restorePursuitTeamsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readChaseClearancePrevious(file);
}
export function verifyChaseClearanceRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'68df967b1123557e4160a2deebca2ce5583aac7f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restorePursuitTeamsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreChaseClearanceBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restorePursuitTeamsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the ChaseClearance release');
 assert.equal(manifest.previousFixtureCount,2990);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2990);
}
