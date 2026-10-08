import {restoreRaceRecoveryHarnessBytes,verifyRaceRecoveryHarnessRevision} from './race-recovery-harness-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/race-recovery/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRaceRecoveryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RaceRecovery baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRaceRecoveryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRaceRecoveryHarnessBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRaceRecoveryPrevious(file);
}
export function verifyRaceRecoveryRevision(){
 verifyRaceRecoveryHarnessRevision();
 const manifest=revision();assert.equal(manifest.baseline,'ba0cd6ec1457dd4580174126b6003824fc2611c8');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRaceRecoveryHarnessBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRaceRecoveryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRaceRecoveryHarnessBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RaceRecovery release');
 assert.equal(manifest.previousFixtureCount,950);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,950);
}
