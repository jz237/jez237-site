import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readOnlineScoreEliminationPrevious,restoreOnlineScoreEliminationBytes,verifyOnlineScoreEliminationRevision} from './online-score-elimination-invariants';
const source=(file:string)=>restorePursuitDrivingBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('OnlineScoreElimination preserves every prior fixture, vehicle asset, control and camera input',verifyOnlineScoreEliminationRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/online-score-elimination/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreOnlineScoreEliminationBytes(file,bytes),readOnlineScoreEliminationPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreOnlineScoreEliminationBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreOnlineScoreEliminationBytes('src/unknown.ts',unknown),unknown);
});

import {restorePursuitDrivingBytes} from './pursuit-driving-invariants';
