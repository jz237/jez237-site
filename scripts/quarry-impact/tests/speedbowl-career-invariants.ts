import {restoreDailyWeekBytes} from './daily-week-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/speedbowl-career/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSpeedbowlCareerPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SpeedbowlCareer baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSpeedbowlCareerBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreDailyWeekBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSpeedbowlCareerPrevious(file);
}
export function verifySpeedbowlCareerRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'4c6f06d1f4f409f0f53556812b90f5469e0c09d2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreDailyWeekBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSpeedbowlCareerBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreDailyWeekBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SpeedbowlCareer release');
 assert.equal(manifest.previousFixtureCount,4839);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4839);
}
