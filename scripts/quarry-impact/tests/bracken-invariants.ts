import {restoreRaceRecoveryBytes,verifyRaceRecoveryRevision} from './race-recovery-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/bracken/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readBrackenPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No Bracken baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreBrackenBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreRaceRecoveryBytes(file,bytes);
 const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readBrackenPrevious(file);
}
export function verifyBrackenRevision(){
 verifyRaceRecoveryRevision();
 const manifest=revision();assert.equal(manifest.baseline,'0e1d9df1607eeb635ceb749f33672479a1c28433');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreRaceRecoveryBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreBrackenBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreRaceRecoveryBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the Bracken release');
 assert.equal(manifest.previousFixtureCount,933);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,933);
}
