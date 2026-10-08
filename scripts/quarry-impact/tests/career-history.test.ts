import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readCareerPrevious,restoreCareerBytes,verifyCareerRevision} from './career-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('Career preserves every prior fixture, vehicle asset, control and camera input',verifyCareerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/career/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreCareerBytes(file,bytes),readCareerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreCareerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreCareerBytes('src/unknown.ts',unknown),unknown);
});
