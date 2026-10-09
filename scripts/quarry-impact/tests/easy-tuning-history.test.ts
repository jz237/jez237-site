import {restoreRidgeClubBytes} from './ridge-club-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readEasyTuningPrevious,restoreEasyTuningBytes,verifyEasyTuningRevision} from './easy-tuning-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('EasyTuning preserves every prior fixture, vehicle asset, control and camera input',verifyEasyTuningRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/easy-tuning/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=restoreRidgeClubBytes(file,source(file));assert.deepEqual(restoreEasyTuningBytes(file,bytes),readEasyTuningPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreEasyTuningBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreEasyTuningBytes('src/unknown.ts',unknown),unknown);
});
