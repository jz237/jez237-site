import {restoreOnlineWaterFeedbackBytes} from './online-water-feedback-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readIndividualTyreFeedbackPrevious,restoreIndividualTyreFeedbackBytes,verifyIndividualTyreFeedbackRevision} from './individual-tyre-feedback-invariants';
const source=(file:string)=>restoreOnlineWaterFeedbackBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('IndividualTyreFeedback preserves every prior fixture, vehicle asset, control and camera input',verifyIndividualTyreFeedbackRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/individual-tyre-feedback/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreIndividualTyreFeedbackBytes(file,bytes),readIndividualTyreFeedbackPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreIndividualTyreFeedbackBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreIndividualTyreFeedbackBytes('src/unknown.ts',unknown),unknown);
});
