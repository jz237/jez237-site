import {restoreSpeedbowlCareerBytes} from './speedbowl-career-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMoorfieldSpeedbowlPrevious,restoreMoorfieldSpeedbowlBytes,verifyMoorfieldSpeedbowlRevision} from './moorfield-speedbowl-invariants';
const source=(file:string)=>restoreSpeedbowlCareerBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('MoorfieldSpeedbowl preserves every prior fixture, vehicle asset, venue art and history input',verifyMoorfieldSpeedbowlRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/moorfield-speedbowl/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMoorfieldSpeedbowlBytes(file,bytes),readMoorfieldSpeedbowlPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMoorfieldSpeedbowlBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMoorfieldSpeedbowlBytes('src/unknown.ts',unknown),unknown);
});
