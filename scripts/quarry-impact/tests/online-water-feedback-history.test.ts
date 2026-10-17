import {restoreAutomaticDirectionChangeBytes} from './automatic-direction-change-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineWaterFeedbackPrevious,restoreOnlineWaterFeedbackBytes,verifyOnlineWaterFeedbackRevision} from './online-water-feedback-invariants';
const source=(file:string)=>restoreAutomaticDirectionChangeBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineWaterFeedback preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineWaterFeedbackRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-water-feedback/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineWaterFeedbackBytes(file,bytes),readOnlineWaterFeedbackPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineWaterFeedbackBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineWaterFeedbackBytes('src/unknown.ts',unknown),unknown);
});
