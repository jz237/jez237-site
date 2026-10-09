import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readStuntCareerPrevious,restoreStuntCareerBytes,verifyStuntCareerRevision} from './stunt-career-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('StuntCareer preserves every prior fixture, vehicle asset, control and camera input',verifyStuntCareerRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/stunt-career/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreStuntCareerBytes(file,bytes),readStuntCareerPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreStuntCareerBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreStuntCareerBytes('src/unknown.ts',unknown),unknown);
});
