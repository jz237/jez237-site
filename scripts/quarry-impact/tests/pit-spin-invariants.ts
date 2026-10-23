import {restoreRearSlideBytes} from './rear-slide-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/pit-spin/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readPitSpinPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No PitSpin baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restorePitSpinBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRearSlideBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readPitSpinPrevious(file);
}
export function verifyPitSpinRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'a0f03167a970d290f4998573aaff86c470970c54');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRearSlideBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restorePitSpinBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRearSlideBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the PitSpin release');
 assert.equal(manifest.previousFixtureCount,6489);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,6489);
}
