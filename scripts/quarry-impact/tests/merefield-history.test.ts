import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readMerefieldPrevious,restoreMerefieldBytes,verifyMerefieldRevision} from './merefield-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Merefield preserves every prior fixture, vehicle asset, control and camera input',verifyMerefieldRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/merefield/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreMerefieldBytes(file,bytes),readMerefieldPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreMerefieldBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreMerefieldBytes('src/unknown.ts',unknown),unknown);
});
