import {restoreIndividualTyreFeedbackBytes} from './individual-tyre-feedback-invariants';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const read=(path:string)=>readFileSync(new URL('./fixtures/recovery-retry/'+path,import.meta.url));
const hash=(bytes:Uint8Array)=>createHash('sha256').update(bytes).digest('hex');
const revision=()=>JSON.parse(read('revision.json').toString());
export function readRecoveryRetryPrevious(file:string):Buffer{
 const entry=revision().files[file];assert.ok(entry,'No RecoveryRetry baseline for '+file);
 const bytes=gunzipSync(read(entry.snapshot));assert.equal(hash(bytes),entry.before,file);return bytes;
}
export function restoreRecoveryRetryBytes(file:string,bytes:Buffer):Buffer{
 bytes=restoreIndividualTyreFeedbackBytes(file,bytes);const entry=revision().files[file];if(!entry||hash(bytes)!==entry.after)return bytes;
 return readRecoveryRetryPrevious(file);
}
export function verifyRecoveryRetryRevision(){
 const manifest=revision();assert.equal(manifest.baseline,'e94efd2a5ee7762fbea50f6b4aec48729fd5bf64');
 for(const [file,entry]of Object.entries<any>(manifest.files)){
  const bytes=restoreIndividualTyreFeedbackBytes(file,readFileSync(new URL('../'+file,import.meta.url)));assert.equal(hash(bytes),entry.after,file);
  assert.equal(hash(restoreRecoveryRetryBytes(file,bytes)),entry.before,file);
 }
 for(const [file,expected]of Object.entries<string>(manifest.protected))assert.equal(hash(restoreIndividualTyreFeedbackBytes(file,readFileSync(new URL('../'+file,import.meta.url)))),expected,file+' is outside the RecoveryRetry release');
 assert.equal(manifest.previousFixtureCount,3798);assert.equal(Object.keys(manifest.protected).filter(file=>file.startsWith('tests/fixtures/')).length,3798);
}
