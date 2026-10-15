import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHazelwoodLookoutPrevious,restoreHazelwoodLookoutBytes,verifyHazelwoodLookoutRevision} from './hazelwood-lookout-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('HazelwoodLookout preserves every prior fixture, vehicle asset, control and camera input',verifyHazelwoodLookoutRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/hazelwood-lookout/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHazelwoodLookoutBytes(file,bytes),readHazelwoodLookoutPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHazelwoodLookoutBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHazelwoodLookoutBytes('src/unknown.ts',unknown),unknown);
});
