import {restoreCornetConeBytes} from './cornet-cone-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/daily-week/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readDailyWeekPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No DailyWeek baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreDailyWeekBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreCornetConeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readDailyWeekPrevious(file);
}
export function verifyDailyWeekRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a0a13e54b74a8b05131ffbc2d147641badd6a55f');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreCornetConeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreDailyWeekBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreCornetConeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the DailyWeek release');
 assert.equal(manifest.previousFixtureCount,4848);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4848);
}
