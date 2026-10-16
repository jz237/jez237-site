import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/speedway-crowd/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSpeedwayCrowdPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SpeedwayCrowd baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSpeedwayCrowdBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreStadiumCrowdBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSpeedwayCrowdPrevious(file);
}
export function verifySpeedwayCrowdRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'3b3c29467611508b0267f2be6f1ef3a2c96c2584');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreStadiumCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSpeedwayCrowdBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreStadiumCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SpeedwayCrowd release');
 assert.equal(manifest.previousFixtureCount,2785);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2785);
}

import {restoreStadiumCrowdBytes} from './stadium-crowd-invariants';
