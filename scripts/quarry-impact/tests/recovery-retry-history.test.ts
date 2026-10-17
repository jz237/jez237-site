import {restoreIndividualTyreFeedbackBytes} from './individual-tyre-feedback-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRecoveryRetryPrevious,restoreRecoveryRetryBytes,verifyRecoveryRetryRevision} from './recovery-retry-invariants';
const source=(file:string)=>restoreIndividualTyreFeedbackBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RecoveryRetry preserves every prior fixture, vehicle asset, control and camera input',verifyRecoveryRetryRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/recovery-retry/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRecoveryRetryBytes(file,bytes),readRecoveryRetryPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRecoveryRetryBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRecoveryRetryBytes('src/unknown.ts',unknown),unknown);
});
