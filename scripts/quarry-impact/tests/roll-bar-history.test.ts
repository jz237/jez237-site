import {restorePropshaftBytes} from './propshaft-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRollBarPrevious,restoreRollBarBytes,verifyRollBarRevision} from './roll-bar-invariants';
const source=(file:string)=>restorePropshaftBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RollBar preserves every prior fixture, vehicle asset, venue art and history input',verifyRollBarRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roll-bar/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRollBarBytes(file,bytes),readRollBarPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRollBarBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRollBarBytes('src/unknown.ts',unknown),unknown);
});
