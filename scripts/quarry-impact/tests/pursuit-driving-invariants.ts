import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pursuit-driving/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPursuitDrivingPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PursuitDriving baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePursuitDrivingBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRivalScoringBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPursuitDrivingPrevious(file);
}
export function verifyPursuitDrivingRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'150c9fbc8a67e8212cf647aa55491628aa821e5f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRivalScoringBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePursuitDrivingBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRivalScoringBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PursuitDriving release');
 assert.equal(manifest.previousFixtureCount,2429);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2429);
}

import {restoreRivalScoringBytes} from './rival-scoring-invariants';
