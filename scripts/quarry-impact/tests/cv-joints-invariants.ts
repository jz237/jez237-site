import {restoreLodgedDebrisBytes} from './lodged-debris-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/cv-joints/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readCvJointsPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No CvJoints baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreCvJointsBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreLodgedDebrisBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readCvJointsPrevious(file);
}
export function verifyCvJointsRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'645509fb1021b802c1938e0261d90834498d9919');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreLodgedDebrisBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreCvJointsBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreLodgedDebrisBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the CvJoints release');
 assert.equal(manifest.previousFixtureCount,9073);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,9073);
}
