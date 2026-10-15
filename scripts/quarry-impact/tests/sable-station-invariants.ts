import {restoreWillowbankDetailBytes} from './willowbank-detail-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/sable-station/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readSableStationPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No SableStation baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreSableStationBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreWillowbankDetailBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readSableStationPrevious(file);
}
export function verifySableStationRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'cd47672ede3c5e9759a39dec2961a3ce942b22bd');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreWillowbankDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreSableStationBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreWillowbankDetailBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the SableStation release');
 assert.equal(manifest.previousFixtureCount,2251);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,2251);
}
