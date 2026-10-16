import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readBowlCrowdsPrevious,restoreBowlCrowdsBytes,verifyBowlCrowdsRevision} from './bowl-crowds-invariants';
const source=(file:string)=>restoreManualBrakePriorityBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('BowlCrowds preserves every prior fixture, vehicle asset, control and camera input',verifyBowlCrowdsRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/bowl-crowds/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreBowlCrowdsBytes(file,bytes),readBowlCrowdsPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreBowlCrowdsBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreBowlCrowdsBytes('src/unknown.ts',unknown),unknown);
});

import {restoreManualBrakePriorityBytes} from './manual-brake-priority-invariants';
