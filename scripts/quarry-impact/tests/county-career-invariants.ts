import {restoreChassisTuningBytes,verifyChassisTuningRevision} from './chassis-tuning-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/county-career/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCountyCareerPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CountyCareer baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCountyCareerBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreChassisTuningBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCountyCareerPrevious(file);
}
export function verifyCountyCareerRevision(){
 verifyChassisTuningRevision();
 const manifest=revision();assert.equal(manifest.baseline,'31d0a7e27a193eb8f3d85084d68e46388a8a41f2');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreChassisTuningBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCountyCareerBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreChassisTuningBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CountyCareer release');
 assert.equal(manifest.previousFixtureCount,1364);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,1364);
}
