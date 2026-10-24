import {restoreBarnDoorsBytes} from './barn-doors-invariants';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readRollMasterPrevious,restoreRollMasterBytes,verifyRollMasterRevision} from './roll-master-invariants';
const source=(file:string)=>restoreBarnDoorsBytes(file,readFileSync(new URL('../'+file,import.meta.url)));
test('RollMaster preserves every prior fixture, vehicle asset, venue art and history input',verifyRollMasterRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/roll-master/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreRollMasterBytes(file,bytes),readRollMasterPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreRollMasterBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreRollMasterBytes('src/unknown.ts',unknown),unknown);
});
