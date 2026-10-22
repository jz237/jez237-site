import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {readHeadlightAimPrevious,restoreHeadlightAimBytes,verifyHeadlightAimRevision} from './headlight-aim-invariants';
const source=(file:string)=>readFileSync(new URL('../'+file,import.meta.url));
test('HeadlightAim preserves every prior fixture, vehicle asset, venue art and history input',verifyHeadlightAimRevision);
test('the successor bridge restores full predecessors and does not conceal later or corrupt edits',()=>{
 const manifest=JSON.parse(source('tests/fixtures/headlight-aim/revision.json').toString());
 for(const file of Object.keys(manifest.files)){
  const bytes=source(file);assert.deepEqual(restoreHeadlightAimBytes(file,bytes),readHeadlightAimPrevious(file));
  const corrupt=Buffer.concat([bytes,Buffer.from('\ncorrupt')]);assert.deepEqual(restoreHeadlightAimBytes(file,corrupt),corrupt);
 }
 const unknown=Buffer.from('unknown');assert.deepEqual(restoreHeadlightAimBytes('src/unknown.ts',unknown),unknown);
});
