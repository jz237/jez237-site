import {restoreRidgeClubBytes} from './ridge-club-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/easy-tuning/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readEasyTuningPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No EasyTuning baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreEasyTuningBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRidgeClubBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readEasyTuningPrevious(file);
}
export function verifyEasyTuningRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'56bf443d137ba1d631966913fa7ebca623ba979c');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRidgeClubBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreEasyTuningBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRidgeClubBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the EasyTuning release');
 assert.equal(manifest.previousFixtureCount,1800);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1800);
}
