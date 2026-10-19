import {restoreSpeedbowlCareerBytes} from './speedbowl-career-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/moorfield-speedbowl/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readMoorfieldSpeedbowlPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No MoorfieldSpeedbowl baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreMoorfieldSpeedbowlBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreSpeedbowlCareerBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readMoorfieldSpeedbowlPrevious(file);
}
export function verifyMoorfieldSpeedbowlRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'ab169c56f92d942c42234263acddf3e4e2ff1405');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreSpeedbowlCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreMoorfieldSpeedbowlBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreSpeedbowlCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the MoorfieldSpeedbowl release');
 assert.equal(manifest.previousFixtureCount,4826);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,4826);
}
