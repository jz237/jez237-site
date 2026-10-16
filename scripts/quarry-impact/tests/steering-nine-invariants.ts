import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/steering-nine/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSteeringNinePrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SteeringNine baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSteeringNineBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSpeedwayCrowdBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSteeringNinePrevious(file);
}
export function verifySteeringNineRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'c1325c862c12f60e1adc7fd4aa3cc302aec437c2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSpeedwayCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSteeringNineBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSpeedwayCrowdBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SteeringNine release');
 assert.equal(manifest.previousFixtureCount,2777);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2777);
}

import {restoreSpeedwayCrowdBytes} from './speedway-crowd-invariants';
