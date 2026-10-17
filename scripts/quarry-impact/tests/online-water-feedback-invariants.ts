import {restoreAutomaticDirectionChangeBytes} from './automatic-direction-change-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/online-water-feedback/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readOnlineWaterFeedbackPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No OnlineWaterFeedback baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreOnlineWaterFeedbackBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreAutomaticDirectionChangeBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readOnlineWaterFeedbackPrevious(file);
}
export function verifyOnlineWaterFeedbackRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'defb78578e75a338b5c883202d79c9f90413a254');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreAutomaticDirectionChangeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreOnlineWaterFeedbackBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreAutomaticDirectionChangeBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the OnlineWaterFeedback release');
 assert.equal(manifest.previousFixtureCount,3823);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3823);
}
