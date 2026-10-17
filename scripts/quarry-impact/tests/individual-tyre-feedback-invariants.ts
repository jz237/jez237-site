import {restoreOnlineWaterFeedbackBytes} from './online-water-feedback-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/individual-tyre-feedback/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readIndividualTyreFeedbackPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No IndividualTyreFeedback baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreIndividualTyreFeedbackBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreOnlineWaterFeedbackBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readIndividualTyreFeedbackPrevious(file);
}
export function verifyIndividualTyreFeedbackRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'492001e90c6d9edc88e6a7f7030aa22a5bfe3e23');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreOnlineWaterFeedbackBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreIndividualTyreFeedbackBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreOnlineWaterFeedbackBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the IndividualTyreFeedback release');
 assert.equal(manifest.previousFixtureCount,3808);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3808);
}
