import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readChaseClearancePrevious,restoreChaseClearanceBytes,verifyChaseClearanceRevision} from './chase-clearance-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('ChaseClearance preserves every prior fixture, vehicle asset, control and camera input',verifyChaseClearanceRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/chase-clearance/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreChaseClearanceBytes(file,bytes),readChaseClearancePrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreChaseClearanceBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreChaseClearanceBytes('src/unknown.ts',unknown),unknown);
});
