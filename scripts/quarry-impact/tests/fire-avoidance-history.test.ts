import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readFireAvoidancePrevious,restoreFireAvoidanceBytes,verifyFireAvoidanceRevision} from './fire-avoidance-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('FireAvoidance preserves every prior fixture, vehicle asset, venue art and history input',verifyFireAvoidanceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/fire-avoidance/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreFireAvoidanceBytes(file,bytes),readFireAvoidancePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreFireAvoidanceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreFireAvoidanceBytes('src/unknown.ts',unknown),unknown);
});
