import {restoreScrapeSurfaceAudioBytes} from './scrape-surface-audio-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/rookvale-wear/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRookvaleWearPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RookvaleWear baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRookvaleWearBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreScrapeSurfaceAudioBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRookvaleWearPrevious(file);
}
export function verifyRookvaleWearRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'39b28f173eaed24bbdcf62bad472a33183832648');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreScrapeSurfaceAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRookvaleWearBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreScrapeSurfaceAudioBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RookvaleWear release');
 assert.equal(manifest.previousFixtureCount,3476);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3476);
}
