import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/survival-rivals/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSurvivalRivalsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SurvivalRivals baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSurvivalRivalsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWrenfordBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSurvivalRivalsPrevious(file);
}
export function verifySurvivalRivalsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'1b793bd84bd2d1f63df4247f306e4d892903d81f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWrenfordBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSurvivalRivalsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWrenfordBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SurvivalRivals release');
 assert.equal(manifest.previousFixtureCount,2521);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2521);
}

import {restoreWrenfordBytes} from './wrenford-invariants';
