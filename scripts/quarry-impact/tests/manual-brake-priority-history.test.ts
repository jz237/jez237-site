import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readManualBrakePriorityPrevious,restoreManualBrakePriorityBytes,verifyManualBrakePriorityRevision} from './manual-brake-priority-invariants';
const source=(file:string)=>restoreContactAbsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('ManualBrakePriority preserves every prior fixture, vehicle asset, control and camera input',verifyManualBrakePriorityRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/manual-brake-priority/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreManualBrakePriorityBytes(file,bytes),readManualBrakePriorityPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreManualBrakePriorityBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreManualBrakePriorityBytes('src/unknown.ts',unknown),unknown);
});

import {restoreContactAbsBytes} from './contact-abs-invariants';
