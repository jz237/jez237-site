import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/alderwick-cross/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readAlderwickCrossPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No AlderwickCross baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreAlderwickCrossBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSurvivalRivalsBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readAlderwickCrossPrevious(file);
}
export function verifyAlderwickCrossRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'8052a0949d09bbb05b907859f7824d14eb5b2bd6');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSurvivalRivalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreAlderwickCrossBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSurvivalRivalsBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the AlderwickCross release');
 assert.equal(manifest.previousFixtureCount,2507);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2507);
}

import {restoreSurvivalRivalsBytes} from './survival-rivals-invariants';
