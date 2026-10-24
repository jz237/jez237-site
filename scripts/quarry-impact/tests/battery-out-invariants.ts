import {restoreReportBatteryBytes} from './report-battery-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/battery-out/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBatteryOutPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No BatteryOut baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBatteryOutBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreReportBatteryBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBatteryOutPrevious(file);
}
export function verifyBatteryOutRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'7929b72062d96ef96de85594f55338f0c8fa6d8e');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreReportBatteryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBatteryOutBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreReportBatteryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the BatteryOut release');
 assert.equal(manifest.previousFixtureCount,7145);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7145);
}
