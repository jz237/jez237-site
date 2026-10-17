import {restoreReplayPuddlesBytes} from './replay-puddles-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/circuit-arc-steering/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCircuitArcSteeringPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CircuitArcSteering baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCircuitArcSteeringBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReplayPuddlesBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCircuitArcSteeringPrevious(file);
}
export function verifyCircuitArcSteeringRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'9aaf26afc25f6975ad1dc732173ab125c382e854');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReplayPuddlesBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCircuitArcSteeringBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReplayPuddlesBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CircuitArcSteering release');
 assert.equal(manifest.previousFixtureCount,3870);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3870);
}
