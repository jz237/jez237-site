import {restoreRollCageBytes} from './roll-cage-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/roof-knock/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRoofKnockPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RoofKnock baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRoofKnockBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRollCageBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRoofKnockPrevious(file);
}
export function verifyRoofKnockRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'b3424a9e659791072c2bc59e3be5799cf06ffc78');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRollCageBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRoofKnockBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRollCageBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RoofKnock release');
 assert.equal(manifest.previousFixtureCount,7582);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,7582);
}
